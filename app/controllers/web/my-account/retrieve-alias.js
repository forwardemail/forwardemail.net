const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

function retrieveAlias(ctx, next) {
  if (!isSANB(ctx.params.alias_id))
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));
  ctx.state.alias = ctx.state.domain.aliases.find(
    (alias) =>
      alias.id === ctx.params.alias_id || alias.name === ctx.params.alias_id
  );
  if (!ctx.state.alias)
    return ctx.throw(Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST')));

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
