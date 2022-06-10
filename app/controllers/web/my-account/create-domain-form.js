function createDomainForm(ctx, next) {
  ctx.state.breadcrumbHeaderCentered = true;
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.t('Add Domain'),
      href: ctx.state.l('/my-account/domains')
    },
    {
      name: ctx.state.t('Add Domain')
    }
  ];
  return next();
}

module.exports = createDomainForm;
