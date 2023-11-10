/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const checkDiskSpace = require('check-disk-space').default;
const ip = require('ip');
const ms = require('ms');
const osu = require('node-os-utils');

const logger = require('#helpers/logger');

//
// this is a function that routinely monitors servers every minute for CPU/disk/memory
// and alerts us by text/email (via `isCodeBug=true`) if the disk
// or any block storage volume mounted on the current server under /mnt
// has exceeded certain % thresholds of capacity/usage
//
const IP_ADDRESS = ip.address();
const HOSTNAME = os.hostname();

// every minute we compare the values and if
// they were both exceeding threshold then we alert
let lastFreeMemPercentage = 100;
let lastCpuPercentage = 0;
let lastUsedPercentage = 0;
const mountMapping = {};

async function check() {
  try {
    // check memory
    const memInfo = await osu.mem.info();
    logger.debug('memInfo', { memInfo });
    if (lastFreeMemPercentage <= 25 && memInfo.freeMemPercentage <= 25)
      logger.fatal(
        new TypeError(
          `${Math.round(
            memInfo.freeMemPercentage
          )}% memory remaining on ${HOSTNAME} (${IP_ADDRESS})`
        )
      );
    // assign to memory
    lastFreeMemPercentage = memInfo.freeMemPercentage;

    // check cpu
    const cpuPercentage = await osu.cpu.usage();
    logger.debug('cpuPercentage', { cpuPercentage });
    if (lastCpuPercentage >= 80 && cpuPercentage >= 80)
      logger.fatal(
        new TypeError(
          `${Math.round(
            cpuPercentage
          )}% CPU usage on ${HOSTNAME} (${IP_ADDRESS})`
        )
      );
    // assign to memory
    lastCpuPercentage = cpuPercentage;

    // check main disk (cwd)
    const diskInfo = await osu.drive.info();
    logger.debug('diskInfo', { diskInfo });
    if (lastUsedPercentage >= 75 && diskInfo.usedPercentage >= 75)
      logger.fatal(
        new TypeError(
          `${Math.round(
            diskInfo.usedPercentage
          )}% disk usage on ${HOSTNAME} (${IP_ADDRESS})`
        )
      );
    // assign to memory
    lastUsedPercentage = diskInfo.usedPercentage;

    // check all /mnt paths
    try {
      const dirents = await fs.promises.readdir('/mnt', {
        withFileTypes: true
      });
      for (const dirent of dirents) {
        if (dirent.isDirectory()) {
          if (typeof mountMapping[dirent] !== 'number')
            mountMapping[dirent] = 0;

          // dirent.name
          try {
            // eslint-disable-next-line no-await-in-loop
            const diskSpace = await checkDiskSpace(
              path.join('/mnt', dirent.name)
            );
            // diskSpace = { diskPath: '/mnt/xyz', free: 37175373824, size: 494384795648 }
            logger.debug('diskSpace', { diskSpace });
            const usedPercentage =
              ((diskSpace.size - diskSpace.free) / diskSpace.size) * 100;
            if (mountMapping[dirent] >= 75 && usedPercentage >= 75)
              logger.fatal(
                new TypeError(
                  `${Math.round(
                    usedPercentage
                  )}% disk usage on ${HOSTNAME} (${IP_ADDRESS}) for ${
                    diskSpace.diskPath
                  }`
                )
              );
            // assign to memory
            mountMapping[dirent] = usedPercentage;
          } catch (err) {
            logger.fatal(err);
          }
        }
      }
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  } catch (err) {
    logger.fatal(err);
  }
}

function monitorServer() {
  check();
  const interval = setInterval(check, ms('1m'));
  return interval;
}

module.exports = monitorServer;
