const test = require('ava');
const sinon = require('sinon');

const utils = require('../utils');
const { Inquiries } = require('#models');

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.countDocuments = sinon
    .stub(Inquiries, 'countDocuments')
    .callThrough();
});
test.after.always((t) => {
  t.context.countDocuments.restore();
});
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);

test('creates inquiry', async (t) => {
  const { web } = t.context;
  const res = await web
    .post('/en/help')
    .send({ email: 'test@example.com', message: 'Test message!' });

  t.is(res.status, 302);
  t.is(res.header.location, '/');
});

test('fails creating inquiry if last inquiry was within last 24 hours (HTML)', async (t) => {
  const { web, countDocuments } = t.context;
  const email = 'test2@example.com';
  countDocuments
    .withArgs(sinon.match.hasNested('$or[1].email', email))
    .resolves(1);

  const res = await web.post('/en/help').set({ Accept: 'text/html' }).send({
    email,
    message: 'Test message!'
  });

  t.is(res.status, 400);
  t.snapshot(res.text);
});

test('fails creating inquiry if last inquiry was within last 24 hours (JSON)', async (t) => {
  const { web, countDocuments } = t.context;
  const email = 'test3@example.com';
  countDocuments
    .withArgs(sinon.match.hasNested('$or[1].email', email))
    .resolves(1);

  const res = await web.post('/en/help').send({
    email,
    message: 'Test message!'
  });

  t.is(res.status, 400);
  t.is(
    JSON.parse(res.text).message,
    'You have reached the limit for sending help requests.  Please try again.'
  );

  t.context.countDocuments.restore();
});
