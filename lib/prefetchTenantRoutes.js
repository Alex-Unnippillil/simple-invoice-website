import Router from 'next/router';

const frequentRoutes = [
  '/tenant/dashboard',
  '/tenant/invoices',
  '/tenant/settings'
];

export function prefetchTenantRoutes() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isMetered = connection?.saveData || connection?.metered;
  if (isMetered) {
    return;
  }

  frequentRoutes.forEach(route => {
    Router.prefetch(route);
  });
}
