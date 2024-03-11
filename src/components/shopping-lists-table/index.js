import { lazy } from 'react';

const ShoppingListsTable = lazy(() =>
  import('./shopping-lists-table' /* webpackChunkName: "carts-table" */)
);

export default ShoppingListsTable;
