/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const paginate = require('koa-ctx-paginate');

const getMongoQuery = require('#helpers/get-mongo-query');
const { Logs } = require('#models');

// Job message types for filtering
const JOB_MESSAGE_TYPES = [
  'job:start',
  'job:complete',
  'job:error',
  'job:cancelled'
];

/**
 * Get all unique job names from logs
 * @returns {Promise<Array>} - Array of unique job names
 */
async function getUniqueJobNames() {
  const jobNames = await Logs.distinct('meta.job.name', {
    message: { $in: JOB_MESSAGE_TYPES }
  });
  return jobNames.filter(Boolean).sort();
}

/**
 * Get job statistics aggregated by job name
 * @returns {Promise<Array>} - Array of job statistics
 */
async function getJobStatistics() {
  const stats = await Logs.aggregate([
    {
      $match: {
        message: { $in: JOB_MESSAGE_TYPES }
      }
    },
    {
      $sort: { created_at: -1 }
    },
    {
      $group: {
        _id: '$meta.job.name',
        lastRun: { $first: '$created_at' },
        lastStatus: { $first: '$message' },
        lastDuration: { $first: '$meta.job.duration' },
        lastError: {
          $first: {
            $cond: [{ $eq: ['$message', 'job:error'] }, '$err', null]
          }
        },
        totalRuns: {
          $sum: { $cond: [{ $eq: ['$message', 'job:start'] }, 1, 0] }
        },
        totalCompleted: {
          $sum: { $cond: [{ $eq: ['$message', 'job:complete'] }, 1, 0] }
        },
        totalErrors: {
          $sum: { $cond: [{ $eq: ['$message', 'job:error'] }, 1, 0] }
        },
        avgDuration: {
          $avg: {
            $cond: [
              { $eq: ['$message', 'job:complete'] },
              '$meta.job.duration',
              null
            ]
          }
        },
        breeInstance: { $first: '$meta.job.breeInstance' },
        interval: { $first: '$meta.job.interval' },
        cron: { $first: '$meta.job.cron' },
        timeout: { $first: '$meta.job.timeout' }
      }
    },
    {
      $project: {
        name: '$_id',
        lastRun: 1,
        lastStatus: 1,
        lastDuration: 1,
        lastError: 1,
        totalRuns: 1,
        totalCompleted: 1,
        totalErrors: 1,
        avgDuration: 1,
        breeInstance: 1,
        interval: 1,
        cron: 1,
        timeout: 1,
        successRate: {
          $cond: [
            { $gt: ['$totalRuns', 0] },
            {
              $multiply: [{ $divide: ['$totalCompleted', '$totalRuns'] }, 100]
            },
            0
          ]
        }
      }
    },
    {
      $sort: { name: 1 }
    }
  ]);

  return stats;
}

/**
 * Get recent job errors
 * @param {number} limit - Maximum number of errors to return
 * @returns {Promise<Array>} - Array of recent job errors
 */
async function getRecentErrors(limit = 10) {
  const errors = await Logs.find({
    message: 'job:error'
  })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
    .exec();

  return errors;
}

/**
 * Get job run history for a specific job
 * @param {string} jobName - Name of the job
 * @param {number} limit - Maximum number of runs to return
 * @returns {Promise<Array>} - Array of job runs
 */
async function getJobHistory(jobName, limit = 50) {
  const history = await Logs.find({
    message: { $in: JOB_MESSAGE_TYPES },
    'meta.job.name': jobName
  })
    .sort({ created_at: -1 })
    .limit(limit)
    .lean()
    .exec();

  return history;
}

/**
 * List all jobs with statistics and filtering
 */
async function list(ctx) {
  const query = getMongoQuery(ctx);

  // Base query for job-related logs
  const baseQuery = {
    message: { $in: JOB_MESSAGE_TYPES },
    ...query
  };

  // Apply filters
  if (ctx.query.job_name) {
    baseQuery['meta.job.name'] = ctx.query.job_name;
  }

  if (ctx.query.status) {
    baseQuery.message = `job:${ctx.query.status}`;
  }

  if (ctx.query.bree_instance) {
    baseQuery['meta.job.breeInstance'] = ctx.query.bree_instance;
  }

  if (ctx.query.errors_only === 'true') {
    baseQuery.message = 'job:error';
  }

  const [
    logs,
    itemCount,
    jobStats,
    recentErrors,
    uniqueJobNames,
    uniqueBreeInstances
  ] = await Promise.all([
    // eslint-disable-next-line unicorn/no-array-callback-reference
    Logs.find(baseQuery)
      .limit(ctx.query.limit)
      .skip(ctx.paginate.skip)
      .sort(ctx.query.sort || '-created_at')
      .lean()
      .exec(),
    Object.keys(baseQuery).length === 0
      ? Logs.estimatedDocumentCount()
      : Logs.countDocuments(baseQuery),
    getJobStatistics(),
    getRecentErrors(5),
    getUniqueJobNames(),
    Logs.distinct('meta.job.breeInstance', {
      message: { $in: JOB_MESSAGE_TYPES }
    })
  ]);

  // Calculate summary statistics
  const summary = {
    totalJobs: jobStats.length,
    totalRuns: jobStats.reduce((sum, job) => sum + job.totalRuns, 0),
    totalCompleted: jobStats.reduce((sum, job) => sum + job.totalCompleted, 0),
    totalErrors: jobStats.reduce((sum, job) => sum + job.totalErrors, 0),
    jobsWithErrors: jobStats.filter((job) => job.totalErrors > 0).length,
    avgSuccessRate:
      jobStats.length > 0
        ? jobStats.reduce((sum, job) => sum + job.successRate, 0) /
          jobStats.length
        : 0
  };

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  if (ctx.accepts('html'))
    return ctx.render('admin/jobs', {
      logs,
      pageCount,
      itemCount,
      jobStats,
      recentErrors,
      uniqueJobNames,
      uniqueBreeInstances: uniqueBreeInstances.filter(Boolean).sort(),
      summary,
      pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
    });

  const table = await ctx.render('admin/jobs/_table', {
    logs,
    pageCount,
    itemCount,
    pages: paginate.getArrayPages(ctx)(6, pageCount, ctx.query.page)
  });

  ctx.body = { table };
}

/**
 * Retrieve a specific job log entry
 */
async function retrieve(ctx) {
  ctx.state.result = await Logs.findById(ctx.params.id);
  if (!ctx.state.result) throw Boom.notFound(ctx.translateError('INVALID_LOG'));
  return ctx.render('admin/jobs/retrieve');
}

/**
 * Get job details and history for a specific job name
 */
async function jobDetail(ctx) {
  const { name } = ctx.params;

  const [history, stats] = await Promise.all([
    getJobHistory(name, 100),
    Logs.aggregate([
      {
        $match: {
          message: { $in: JOB_MESSAGE_TYPES },
          'meta.job.name': name
        }
      },
      {
        $group: {
          _id: null,
          totalRuns: {
            $sum: { $cond: [{ $eq: ['$message', 'job:start'] }, 1, 0] }
          },
          totalCompleted: {
            $sum: { $cond: [{ $eq: ['$message', 'job:complete'] }, 1, 0] }
          },
          totalErrors: {
            $sum: { $cond: [{ $eq: ['$message', 'job:error'] }, 1, 0] }
          },
          avgDuration: {
            $avg: {
              $cond: [
                { $eq: ['$message', 'job:complete'] },
                '$meta.job.duration',
                null
              ]
            }
          },
          minDuration: {
            $min: {
              $cond: [
                { $eq: ['$message', 'job:complete'] },
                '$meta.job.duration',
                null
              ]
            }
          },
          maxDuration: {
            $max: {
              $cond: [
                { $eq: ['$message', 'job:complete'] },
                '$meta.job.duration',
                null
              ]
            }
          },
          lastRun: { $max: '$created_at' },
          firstRun: { $min: '$created_at' }
        }
      }
    ])
  ]);

  const jobStats = stats[0] || {
    totalRuns: 0,
    totalCompleted: 0,
    totalErrors: 0,
    avgDuration: 0,
    minDuration: 0,
    maxDuration: 0
  };

  // Get the latest job configuration from the most recent log
  const latestLog = history[0];
  const jobConfig = latestLog?.meta?.job || {};

  return ctx.render('admin/jobs/detail', {
    jobName: name,
    history,
    jobStats,
    jobConfig
  });
}

module.exports = {
  list,
  retrieve,
  jobDetail,
  getJobStatistics,
  getRecentErrors,
  getJobHistory,
  JOB_MESSAGE_TYPES
};
