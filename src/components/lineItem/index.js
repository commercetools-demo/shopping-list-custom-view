import { lazy } from 'react';

const LineItem = lazy(() => import('./lineItem' /* webpackChunkName: "cart" */));

export default LineItem;
