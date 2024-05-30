/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { isMainThread, workerData } = require('node:worker_threads');
const { memoryUsage } = require('node:process');

const bytes = require('bytes');
const checkDiskSpace = require('check-disk-space').default;
const ip = require('ip');
const ms = require('ms');
const osu = require('node-os-utils');
const prettyBytes = require('pretty-bytes');

const env = require('#config/env');
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
  // ensure that `netstat`, `tcpdump`, `get`, `curl`, `nc`, `gcc` is not installed
  // TODO: apparmor
  // TODO: routinely clear shell history
  // TODO: check shell history and send to admins
  // TODO: ensure hard drive is luks-encrypted
  // TODO: <https://github.com/ansible-lockdown/UBUNTU22-CIS-Audit>
  // TODO: email alert if users logged in via ssh
  // TODO: email alert if root user is accessed
  // TODO: sysctl kernel.unprivileged_bpf_disabled to 1
  // TODO: sysctl net.core.bpf_jit_harden to 2
  // TODO: sysctl kernel.kptr_restrict to 2
  // TODO: fail2ban running as devops user instead of root
  // TODO: kernel option CONFIG_REFCOUNT_FULL
  // TODO: kernel option CONFIG_IO_STRICT_DEVMEM

  try {
    // only monitor main thread
    if (isMainThread) {
      // check memory
      const memInfo = await osu.mem.info();
      logger.debug('memInfo', { memInfo });
      if (lastFreeMemPercentage <= 25 && memInfo.freeMemPercentage <= 25) {
        const err = new TypeError(
          `${Math.round(
            memInfo.freeMemPercentage
          )}% memory remaining on ${HOSTNAME} (${IP_ADDRESS})`
        );
        logger.fatal(err, { lastFreeMemPercentage, memInfo });
      }

      // assign to memory
      lastFreeMemPercentage = memInfo.freeMemPercentage;

      // check cpu
      const cpuPercentage = await osu.cpu.usage();
      logger.debug('cpuPercentage', { cpuPercentage });
      if (lastCpuPercentage >= 80 && cpuPercentage >= 80) {
        const err = new TypeError(
          `${Math.round(
            cpuPercentage
          )}% CPU usage on ${HOSTNAME} (${IP_ADDRESS})`
        );
        logger.fatal(err, { lastCpuPercentage, cpuPercentage });
      }

      // assign to memory
      lastCpuPercentage = cpuPercentage;

      // check main disk (cwd)
      const diskInfo = await osu.drive.info();
      logger.debug('diskInfo', { diskInfo });
      if (lastUsedPercentage >= 75 && diskInfo.usedPercentage >= 75) {
        const err = new TypeError(
          `${Math.round(
            diskInfo.usedPercentage
          )}% disk usage on ${HOSTNAME} (${IP_ADDRESS})`
        );
        logger.fatal(err, { lastUsedPercentage, diskInfo });
      }

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
              if (mountMapping[dirent] >= 75 && usedPercentage >= 75) {
                const err = new TypeError(
                  `${Math.round(
                    usedPercentage
                  )}% disk usage on ${HOSTNAME} (${IP_ADDRESS}) for ${
                    diskSpace.diskPath
                  }`
                );
                logger.fatal(err, {
                  mountMapping,
                  dirent,
                  specific: mountMapping[dirent],
                  usedPercentage
                });
              }

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
    }

    //
    // in worker threads we want to alert if heap total is >= 2 GB
    // (so we can optimize each job and monitor in real-time)
    //
    const memoryInfo = memoryUsage();
    if (memoryInfo.heapTotal > bytes('2GB')) {
      let message = `Exceeded 2 GB threshold memory usage on ${HOSTNAME} (${IP_ADDRESS})`;
      if (!isMainThread && workerData?.job?.name) {
        message += ` (${workerData.job.name})`;
      }

      const err = new TypeError(message);
      err.memoryUsed = prettyBytes(memoryInfo.heapTotal);
      err.memoryInfo = memoryInfo;
      logger.fatal(err);
    }
  } catch (err) {
    logger.fatal(err);
  }
}

function monitorServer() {
  if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') return;
  check();
  const interval = setInterval(check, isMainThread ? ms('1m') : ms('10s'));
  return interval;
}

module.exports = monitorServer;
