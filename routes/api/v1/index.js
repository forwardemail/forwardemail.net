/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const bytes = require('@forwardemail/bytes');
const dayjs = require('dayjs-with-plugins');
const koaMulter = require('@koa/multer');
const multer = require('multer');
const paginate = require('koa-ctx-paginate');
const { boolean } = require('boolean');

const _ = require('#helpers/lodash');
const api = require('#controllers/api');
const config = require('#config');
const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const upload = koaMulter();

const fileUpload = koaMulter({
  // storage: multer.memoryStorage() // this is the default
  limits: {
    //
    // TODO: note this technically allows 102 MB total file uploads
    //       but an alternative might be to use `koa-body` such as:
    //
    //       const { koaBody } = require('@koa/body');
    //
    //       koaBody({ // Add koaBody middleware here
    //         multipart: true,
    //         urlencoded: true,
    //         json: true,
    //         formLimit: '50mb', // Adjust as needed
    //         jsonLimit: '50mb', // Adjust as needed
    //         textLimit: '50mb', // Adjust as needed
    //         formidable: {
    //           maxFileSize: bytes('51MB'),
    //           keepExtensions: true,
    //         },
    //       }),
    //
    fieldSize: bytes('51MB'),
    fileSize: bytes('51MB')
  }
  // fileFilter(req, file, cb) {
  //   console.log('Multer fileFilter triggered:', file.originalname); // Add this
  //   cb(null, true);
  // }
});

const router = new Router({
  prefix: '/v1'
});

router.post(
  '/emails',
  policies.ensureApiToken,
  policies.checkVerifiedEmail,
  web.myAccount.ensureNotBanned,
  api.v1.enforcePaidPlan,
  web.myAccount.ensurePaidToDate,
  async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        switch (err.code) {
          case 'LIMIT_PART_COUNT': {
            throw Boom.badRequest('Too many parts in the form.');
          }

          case 'LIMIT_FILE_SIZE': {
            throw Boom.badRequest(
              `File size too large: Maximum allowed size for "${err.field}" is 50 MB.`
            );
          }

          case 'LIMIT_FILE_COUNT': {
            throw Boom.badRequest('Too many files uploaded.');
          }

          case 'LIMIT_FIELD_KEY': {
            throw Boom.badRequest(
              `Field name too long: Maximum allowed length is ${err.field}.`
            );
          }

          case 'LIMIT_FIELD_VALUE': {
            throw Boom.badRequest(
              `Field value too long for field: ${err.field}.`
            );
          }

          case 'LIMIT_FIELD_COUNT': {
            throw Boom.badRequest('Too many fields in the form.');
          }

          case 'LIMIT_UNEXPECTED_FILE': {
            throw Boom.badRequest(
              `Unexpected file field: "${err.field}". You must use "attachment" or "attachments" as the file field name.`
            );
          }

          default: {
            throw err;
          }
        }
      }

      throw err;
    }
  },
  // support varying content types
  // - application/json
  // - application/x-www-form-urlencoded
  // - multipart/form-data
  async (ctx, next) => {
    if (ctx.request.type.startsWith('multipart/form-data')) {
      // support file uploads and binary content
      return fileUpload.fields([
        { name: 'attachment', maxCount: 1 },
        { name: 'attachments' } // no maxCount
      ])(ctx, next);
    }

    return bodyParser({
      formLimit: bytes('51MB'),
      jsonLimit: bytes('51MB')
    })(ctx, next);
  },
  api.v1.emails.create
);

//
// support form data (multipart/form-data)
//
router.use(upload.none());

router
  //
  // hidden
  //
  .get('/test', api.v1.test)
  .post(
    '/log',
    async (ctx, next) => {
      try {
        // check if we provided an API secret (e.g. from bree)
        await api.v1.restricted(ctx);
      } catch {
        // check the API token of the logged in user
        await api.v1.log.checkToken(ctx);
      }

      return next();
    },
    //
    // rate limit logs sent from users
    //
    // NOTE: the rate limit helper does not rate limit API secrets
    //       however the global rate limiter does
    //       (but we whitelist the IP addresses of our servers)
    //
    rateLimit(100, 'log'),
    bodyParser({
      jsonLimit: '2mb'
    }),
    api.v1.log.parseLog
  )
  .post('/stripe', api.v1.stripe)
  .post('/paypal', api.v1.paypal)
  // <https://api.forwardemail.net/v1/apple>
  .post('/apple', api.v1.apple)

  //
  // restricted
  //
  .get('/lookup', api.v1.restricted, api.v1.lookup)
  .get('/port', api.v1.restricted, api.v1.port)
  .get('/settings', api.v1.restricted, api.v1.settings)
  .get(
    '/max-forwarded-addresses',
    api.v1.restricted,
    api.v1.maxForwardedAddresses
  )
  .post('/self-test', api.v1.restricted, api.v1.selfTest)
  .post('/upgrade', api.v1.restricted, api.v1.upgrade)

  //
  // public
  //
  .use((ctx, next) => {
    if (
      ctx.method === 'DELETE' &&
      ctx.get('Origin') &&
      ctx.get('Origin').startsWith(config.urls.web)
    )
      throw Boom.badRequest(ctx.translateError('DELETE_PROTECTED'));
    return next();
  })
  .post('/account', rateLimit(5, 'create user'), api.v1.users.create)
  .post('/encrypt', rateLimit(50, 'encrypt'), web.encryptTxt)
  .get(
    '/account',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate,
    api.v1.users.retrieve
  )
  .put(
    '/account',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate,
    api.v1.users.update
  );

// logs
router.get(
  '/logs/download',
  policies.ensureApiToken,
  policies.checkVerifiedEmail,
  web.myAccount.ensureNotBanned,
  api.v1.enforcePaidPlan,
  web.myAccount.ensurePaidToDate,
  rateLimit(20, 'download logs'),
  web.myAccount.retrieveDomains,
  web.myAccount.listLogs
);

// emails
router
  .use(
    '/emails',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    api.v1.enforcePaidPlan,
    web.myAccount.ensurePaidToDate
  )
  .get(
    '/emails',
    paginate.middleware(25, 100),
    web.myAccount.retrieveDomains,
    web.myAccount.listEmails,
    api.v1.emails.list
  )
  .get('/emails/limit', api.v1.emails.limit)
  .get('/emails/:id', web.myAccount.retrieveEmail, api.v1.emails.retrieve)
  .delete(
    '/emails/:id',
    web.myAccount.retrieveEmail,
    web.myAccount.removeEmail,
    api.v1.emails.retrieve
  );

// domains
router
  .use(
    '/domains',
    policies.ensureApiToken,
    policies.checkVerifiedEmail,
    web.myAccount.ensureNotBanned,
    web.myAccount.ensurePaidToDate,
    (ctx, next) => {
      //
      // starting November 1st we enforce API pagination on this endpoint
      // (unless user opts in beforehand using ?pagination=true)
      //
      const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
        ? boolean(ctx.query.pagination) ||
          !_.isUndefined(ctx.query.limit) ||
          !_.isUndefined(ctx.query.page)
        : true;
      if (!hasPagination) return next();
      if (typeof ctx.query.limit === 'undefined') ctx.query.limit = 1000;
      let defaultLimit = 50;
      if (typeof ctx.query.limit === 'number' && ctx.query.limit < 50)
        defaultLimit = 10;
      else if (
        typeof ctx.query.limit === 'string' &&
        Number.isFinite(Number.parseInt(ctx.query.limit, 10)) &&
        Number.parseInt(ctx.query.limit, 10) < 50
      )
        defaultLimit = 10;
      return paginate.middleware(defaultLimit, 1000)(ctx, next);
    },
    web.myAccount.retrieveDomains
  )
  .get('/domains', web.myAccount.listDomains, api.v1.domains.list)
  .post(
    '/domains',
    web.myAccount.validateDomain,
    rateLimit(50, 'create domain'),
    api.v1.enforcePaidPlan,
    web.myAccount.createDomain,
    api.v1.domains.retrieve
  )
  .get(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    api.v1.enforcePaidPlan,
    api.v1.domains.retrieve
  )
  .get(
    '/domains/:domain_id/verify-records',
    web.myAccount.retrieveDomain,
    api.v1.enforcePaidPlan,
    web.myAccount.verifyRecords
  )
  .get(
    '/domains/:domain_id/verify-smtp',
    web.myAccount.retrieveDomain,
    api.v1.enforcePaidPlan,
    web.myAccount.verifySMTP
  )
  .put(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.updateDomain,
    web.myAccount.retrieveDomains,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    api.v1.enforcePaidPlan,
    web.myAccount.removeDomain,
    web.myAccount.retrieveDomains,
    api.v1.domains.retrieve
  )

  // invites
  .get('/domains/:domain_id/invites', web.myAccount.retrieveInvite)
  .post(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(10, 'create invite'),
    web.myAccount.createInvite,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    api.v1.enforcePaidPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeInvite,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )

  // members
  .put(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    api.v1.enforcePaidPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.updateMember,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  )
  .delete(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    api.v1.enforcePaidPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.removeMember,
    web.myAccount.retrieveDomains,
    web.myAccount.retrieveDomain,
    api.v1.domains.retrieve
  );

// aliases
router
  .use(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan
  )
  .get(
    '/domains/:domain_id/aliases',
    (ctx, next) => {
      //
      // starting November 1st we enforce API pagination on this endpoint
      // (unless user opts in beforehand using ?pagination=true)
      //
      const hasPagination = dayjs().isBefore('11/1/2024', 'M/D/YYYY')
        ? boolean(ctx.query.pagination) ||
          !_.isUndefined(ctx.query.limit) ||
          !_.isUndefined(ctx.query.page)
        : true;
      if (!hasPagination) return next();
      if (typeof ctx.query.limit === 'undefined') ctx.query.limit = 1000;
      let defaultLimit = 50;
      if (typeof ctx.query.limit === 'number' && ctx.query.limit < 50)
        defaultLimit = 10;
      else if (
        typeof ctx.query.limit === 'string' &&
        Number.isFinite(Number.parseInt(ctx.query.limit, 10)) &&
        Number.parseInt(ctx.query.limit, 10) < 50
      )
        defaultLimit = 10;
      return paginate.middleware(defaultLimit, 1000)(ctx, next);
    },
    web.myAccount.retrieveAliases,
    api.v1.aliases.list
  )
  .post(
    '/domains/:domain_id/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias,
    api.v1.aliases.retrieve
  )
  .get(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    api.v1.aliases.retrieve
  )
  .put(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.validateAlias,
    web.myAccount.updateAlias,
    api.v1.aliases.retrieve
  )
  .delete(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.removeAlias,
    api.v1.aliases.retrieve
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/generate-password',
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    rateLimit(300, 'generate alias password'),
    web.myAccount.generateAliasPassword
  )
  .get(
    '/domains/:domain_id/catch-all-passwords',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    api.v1.domains.listCatchAllPasswords
  )
  .post(
    '/domains/:domain_id/catch-all-passwords',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(100, 'create catch all password'),
    web.myAccount.createCatchAllPassword
  )
  .delete(
    '/domains/:domain_id/catch-all-passwords/:token_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeCatchAllPassword
  );

// inquiries
// router.post('/inquiries', api.v1.inquiries.create);

//
// Alias endpoints (CardDAV, CalDAV, IMAP/POP3)
// These use alias authentication instead of API token
//

// contacts (CardDAV)
router
  .use('/contacts', api.v1.aliasAuth)
  .get('/contacts', paginate.middleware(25, 100), api.v1.contacts.list)
  .post('/contacts', api.v1.contacts.create)
  .get('/contacts/:id', api.v1.contacts.retrieve)
  .put('/contacts/:id', api.v1.contacts.update)
  .delete('/contacts/:id', api.v1.contacts.remove);

// calendars (CalDAV)
router
  .use('/calendars', api.v1.aliasAuth)
  .get('/calendars', paginate.middleware(25, 100), api.v1.calendars.list)
  .post('/calendars', api.v1.calendars.create)
  .get('/calendars/:id', api.v1.calendars.retrieve)
  .put('/calendars/:id', api.v1.calendars.update)
  .delete('/calendars/:id', api.v1.calendars.remove);

// messages (IMAP/POP3)
router
  .use('/messages', api.v1.aliasAuth)
  .get('/messages', paginate.middleware(25, 100), api.v1.messages.list)
  .post('/messages', api.v1.messages.create)
  .get('/messages/:id', api.v1.messages.retrieve)
  .put('/messages/:id', api.v1.messages.update)
  .delete('/messages/:id', api.v1.messages.remove);

// folders (IMAP/POP3)
router
  .use('/folders', api.v1.aliasAuth)
  .get('/folders', paginate.middleware(25, 100), api.v1.folders.list)
  .post('/folders', api.v1.folders.create)
  .get('/folders/:id', api.v1.folders.retrieve)
  .put('/folders/:id', api.v1.folders.update)
  .delete('/folders/:id', api.v1.folders.remove);

module.exports = router;
