const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const Aliases = require('#models/aliases');

const config = require('#config');

async function retrieveAlias(ctx, next) {
  if (!isSANB(ctx.params.alias_id))
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));

  const query =
    ctx.state.domain.group === 'admin'
      ? {
          $or: [
            {
              id: ctx.params.alias_id,
              domain: ctx.state.domain._id
            },
            {
              name: ctx.params.alias_id,
              domain: ctx.state.domain._id
            }
          ]
        }
      : {
          $or: [
            {
              id: ctx.params.alias_id,
              user: ctx.state.user._id,
              domain: ctx.state.domain._id
            },
            {
              name: ctx.params.alias_id,
              user: ctx.state.user._id,
              domain: ctx.state.domain._id
            }
          ]
        };

  ctx.state.alias = await Aliases.findOne(query)
    .populate(
      'user',
      `id email ${config.passport.fields.displayName} ${config.userFields.isBanned}`
    )
    .populate('domain', 'id name')
    .lean()
    .exec();

  if (
    !ctx.state.alias ||
    !ctx.state.alias.user ||
    !ctx.state.alias.domain ||
    ctx.state.alias.user[config.userFields.isBanned]
  )
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));

  // set virtual alias.group helper
  ctx.state.alias.group =
    ctx.state.domain.group === 'admin' ||
    ctx.state.alias.user.id === ctx.state.user.id
      ? 'admin'
      : 'user';

  if (ctx.api) return next();

  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/${ctx.state.alias.id}`
  ) {
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push(
      {
        name: ctx.state.t('Aliases'),
        href: ctx.state.l(
          `/my-account/domains/${ctx.state.domain.name}/aliases`
        )
      },
      {
        header: ctx.state.t('Edit Alias'),
        name: `${ctx.state.alias.name}@${ctx.state.domain.name}`
      }
    );
  }

  return next();
}

module.exports = retrieveAlias;
