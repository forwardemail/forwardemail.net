/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ct = require('countries-and-timezones');
const dayjs = require('dayjs-with-plugins');
const { distance, closest } = require('fastest-levenshtein');

/**
 * Comprehensive timezone handler that:
 * 1. Converts UTC offsets like "+00:00" to proper timezone names
 * 2. Fixes misspelled timezone names using fuzzy matching
 * 3. Validates and normalizes timezone inputs
 */
class TimezoneHandler {
  constructor() {
    // Get all valid IANA timezone names
    this.validTimezones = Object.keys(ct.getAllTimezones());

    // Common offset to timezone mappings (using major cities as defaults)
    this.offsetToTimezone = {
      '+00:00': 'UTC',
      '+01:00': 'Europe/London',
      '+02:00': 'Europe/Berlin',
      '+03:00': 'Europe/Moscow',
      '+04:00': 'Asia/Dubai',
      '+05:00': 'Asia/Karachi',
      '+05:30': 'Asia/Kolkata',
      '+06:00': 'Asia/Dhaka',
      '+07:00': 'Asia/Bangkok',
      '+08:00': 'Asia/Shanghai',
      '+09:00': 'Asia/Tokyo',
      '+10:00': 'Australia/Sydney',
      '+11:00': 'Pacific/Noumea',
      '+12:00': 'Pacific/Auckland',
      '-01:00': 'Atlantic/Azores',
      '-02:00': 'Atlantic/South_Georgia',
      '-03:00': 'America/Sao_Paulo',
      '-04:00': 'America/New_York',
      '-05:00': 'America/Chicago',
      '-06:00': 'America/Denver',
      '-07:00': 'America/Los_Angeles',
      '-08:00': 'America/Anchorage',
      '-09:00': 'Pacific/Gambier',
      '-10:00': 'Pacific/Honolulu',
      '-11:00': 'Pacific/Midway',
      '-12:00': 'Etc/GMT+12'
    };
  }

  /**
   * Convert UTC offset string to timezone name
   * @param {string} offset - UTC offset like "+00:00" or "-05:00"
   * @returns {string} - IANA timezone name
   */
  offsetToTimezoneName(offset) {
    // Normalize the offset format
    const normalizedOffset = this.normalizeOffset(offset);

    if (this.offsetToTimezone[normalizedOffset]) {
      return this.offsetToTimezone[normalizedOffset];
    }

    // If no direct mapping, try to find a timezone with matching current offset
    const offsetMinutes = this.offsetToMinutes(normalizedOffset);
    const matchingTimezones = this.findTimezonesByOffset(offsetMinutes);

    // Return the first matching timezone (preferably a major city)
    return matchingTimezones.length > 0 ? matchingTimezones[0] : 'UTC';
  }

  /**
   * Normalize offset format to "+HH:MM" or "-HH:MM"
   * @param {string} offset - Various offset formats
   * @returns {string} - Normalized offset
   */
  normalizeOffset(offset) {
    // Remove any whitespace
    offset = offset.trim();

    // Handle formats like "+9", "-5", "+0900", "-0500"
    if (/^[+-]\d{1,2}$/.test(offset)) {
      const sign = offset[0];
      const hours = offset.slice(1).padStart(2, '0');
      return `${sign}${hours}:00`;
    }

    if (/^[+-]\d{4}$/.test(offset)) {
      const sign = offset[0];
      const hours = offset.slice(1, 3);
      const minutes = offset.slice(3, 5);
      return `${sign}${hours}:${minutes}`;
    }

    // Already in correct format
    if (/^[+-]\d{2}:\d{2}$/.test(offset)) {
      return offset;
    }

    return offset;
  }

  /**
   * Convert offset string to minutes
   * @param {string} offset - Offset like "+05:30"
   * @returns {number} - Offset in minutes
   */
  offsetToMinutes(offset) {
    const match = offset.match(/^([+-])(\d{2}):(\d{2})$/);
    if (!match) return 0;

    const sign = match[1] === '+' ? 1 : -1;
    const hours = Number.parseInt(match[2], 10);
    const minutes = Number.parseInt(match[3], 10);

    return sign * (hours * 60 + minutes);
  }

  /**
   * Find timezones that match a specific offset
   * @param {number} offsetMinutes - Offset in minutes
   * @returns {string[]} - Array of matching timezone names
   */
  findTimezonesByOffset(offsetMinutes) {
    const allTimezones = ct.getAllTimezones();
    const matching = [];

    for (const [name, timezone] of Object.entries(allTimezones)) {
      // Check both standard and DST offsets
      if (
        timezone.utcOffset === offsetMinutes ||
        timezone.dstOffset === offsetMinutes
      ) {
        matching.push(name);
      }
    }

    // Sort by preference (major cities first)
    return matching.sort((a, b) => {
      const majorCities = [
        'London',
        'New_York',
        'Los_Angeles',
        'Tokyo',
        'Sydney',
        'Berlin',
        'Paris'
      ];
      const aIsMajor = majorCities.some((city) => a.includes(city));
      const bIsMajor = majorCities.some((city) => b.includes(city));

      if (aIsMajor && !bIsMajor) return -1;
      if (!aIsMajor && bIsMajor) return 1;
      return a.localeCompare(b);
    });
  }

  /**
   * Fix misspelled timezone names using fuzzy matching
   * @param {string} timezone - Potentially misspelled timezone
   * @returns {string} - Corrected timezone name
   */
  fixMisspelledTimezone(timezone) {
    // If it's already valid, return as-is
    if (this.validTimezones.includes(timezone)) {
      return timezone;
    }

    // Check for common aliases and corrections
    const commonCorrections = {
      'Asia/Calcutt': 'Asia/Kolkata',
      'Asia/Calcutta': 'Asia/Kolkata',
      'Asia/Katmandu': 'Asia/Kathmandu',
      'Asia/Saigon': 'Asia/Ho_Chi_Minh',
      'Asia/Rangoon': 'Asia/Yangon',
      'Europe/Kiev': 'Europe/Kyiv',
      'Pacific/Samoa': 'Pacific/Apia'
    };

    if (commonCorrections[timezone]) {
      return commonCorrections[timezone];
    }

    // Use fastest-levenshtein to find the closest match
    const bestMatch = closest(timezone, this.validTimezones);
    const editDistance = distance(timezone, bestMatch);
    const maxLength = Math.max(timezone.length, bestMatch.length);
    const similarity = 1 - editDistance / maxLength;

    // Only accept matches with similarity > 0.6 (60%)
    if (similarity > 0.6) {
      return bestMatch;
    }

    // If no good match found, return UTC as fallback
    return 'UTC';
  }

  /**
   * Main method to normalize any timezone input
   * @param {string} timezone - Raw timezone input from browser
   * @returns {string} - Normalized IANA timezone name
   */
  normalizeTimezone(timezone) {
    // Handle null, undefined, or empty strings
    if (!timezone || timezone.trim() === '') {
      return 'UTC';
    }

    timezone = timezone.trim();

    // Handle special cases
    if (timezone === 'Etc/Unknown') {
      return 'UTC';
    }

    // Check if it's a UTC offset format
    if (/^[+-]\d/.test(timezone)) {
      return this.offsetToTimezoneName(timezone);
    }

    // Check if it's already a valid timezone
    if (this.validTimezones.includes(timezone)) {
      return timezone;
    }

    // Try to fix misspelled timezone
    return this.fixMisspelledTimezone(timezone);
  }

  /**
   * Test a timezone with dayjs to ensure it works
   * @param {string} timezone - IANA timezone name
   * @returns {boolean} - Whether the timezone works with dayjs
   */
  testTimezone(timezone) {
    try {
      dayjs().tz(timezone).format('M/D/YY');
      return true;
    } catch {
      return false;
    }
  }
}

// Export for use in other files
module.exports = TimezoneHandler;
