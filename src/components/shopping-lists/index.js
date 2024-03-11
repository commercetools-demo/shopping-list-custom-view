import { lazy } from 'react';

const ShoppingLists = lazy(() => import('./shopping-lists' /* webpackChunkName: "carts" */));

export default ShoppingLists;
