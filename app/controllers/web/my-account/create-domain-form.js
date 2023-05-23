function createDomainForm(ctx, next) {
  const header = ctx.translate('ADD_DOMAIN');
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.t('Add Domain'),
      href: ctx.state.l('/my-account/domains')
    },
    {
      name: ctx.state.t('Add Domain'),
      header
    }
  ];
  return next();
}

module.exports = createDomainForm;
