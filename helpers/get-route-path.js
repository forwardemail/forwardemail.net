/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Analytics record the route a request matched as its pattern
// (`/my-account/domains/:domain_id/aliases`), never the path itself, which
// can carry domain names, alias names, IDs and one-time tokens.
//
// The locale prefix of localized pages is dropped, so `/en/faq` and
// `/de/faq` both count as `/faq`.
//
function toRoutePath(route) {
  if (typeof route !== 'string' || route === '') return;
  return route.replace(/^\/:locale(?=\/|$)/, '') || '/';
}

//
// The route among the router layers that match a path: the first one
// registered for the method, which is the one @koa/router runs first (a
// static route such as `/my-account/domains/new` is registered before the
// `/my-account/domains/:domain_id` route that also matches it). Layers of
// `router.use()` middleware have no methods and are never the route.
//
// Without a method (a path stored without one), the first route registered
// for GET, or else the first route.
//
function findRoute(layers, method) {
  if (!Array.isArray(layers)) return;
  const routes = layers.filter(
    (layer) => Array.isArray(layer?.methods) && layer.methods.length > 0
  );
  const route = method
    ? routes.find((layer) => layer.methods.includes(method))
    : routes.find((layer) => layer.methods.includes('GET')) || routes[0];
  return typeof route?.path === 'string' ? route.path : undefined;
}

//
// The pattern of the route a request matched, or nothing when no route
// matched. It comes from the layers the router matched (`ctx.matched`), not
// from `ctx._matchedRoute`, which names the last layer that ran: a request
// that middleware such as `ensureLoggedIn` stopped would count as that
// middleware's pattern.
//
function getRoutePath(ctx) {
  return toRoutePath(findRoute(ctx?.matched, ctx?.method));
}

module.exports = getRoutePath;
module.exports.findRoute = findRoute;
module.exports.toRoutePath = toRoutePath;
