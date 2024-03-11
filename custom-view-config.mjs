/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomView}
 */
const config = {
  name: 'Shopping List Preview',
  cloudIdentifier: 'gcp-au',
  env: {
    development: {
      initialProjectKey: 'composable-demo',
      hostUriPath: '/composable-demo/customers/d26b721c-b721-4561-ba0e-23d6361ddddb/general'
    },
    production: {
      customViewId: 'cltmwki4x0001376bp5kbky32',
      url: 'https://serene-haupia-67b78c.netlify.app',
    },
  },
  oAuthScopes: {
    view: ['view_products','view_orders','view_customers','view_shopping_lists'],
    manage: ['manage_products','manage_orders','manage_shopping_lists'],
  },
  type: 'CustomPanel',
  typeSettings: {
    size: 'LARGE',
  },
  locators: ['customers.customer_details.general'],
};

export default config;
