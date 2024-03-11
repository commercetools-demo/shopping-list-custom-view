import { lazy } from 'react';

const ShoppingList = lazy(() => import('./shopping-list' /* webpackChunkName: "cart" */));

export default ShoppingList;
