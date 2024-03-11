import { lazy } from 'react';

const UpdateCart = lazy(() =>
  import('./update-cart' /* webpackChunkName: "update-cart" */)
);

export default UpdateCart;
