import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useMemo } from 'react';
import DeleteCartMutation from './delete-cart.ctp.graphql';
import FetchCartsQuery from './fetch-carts.ctp.graphql';
import FreezeCartUpdate from './freeze-cart.ctp.graphql'
import UnfreezeCartUpdate from './unfreeze-cart.ctp.graphql'

export const useCart = ({ customerId, sort }) => {
  if(!sort){
    sort = "cartState asc"
  }
  const where = `customerId="${customerId}"`;
  const {
    refetch,
    data,
    error: fetchError,
    loading: fetchLoading,
  } = useMcQuery(FetchCartsQuery, {
    variables: {
      where,
      sort,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  const [deleteCart] = useMcMutation(DeleteCartMutation);

  const removeCarts = async (carts) => {
    const result = await Promise.all(
      carts.map((cart) =>
        deleteCart({
          variables: {
            version: cart.version,
            cartId: cart.id,
          },
          context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          },
        })
      )
    );
    refetch();
    return result;
  };


  const [freezeCartUpdate] = useMcMutation(FreezeCartUpdate);

  const freezeCart = async (carts) => {
    const result = await Promise.all(
      carts.map((cart) =>
      freezeCartUpdate({
          variables: {
            version: cart.version,
            cartId: cart.id,
          },
          context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          },
        })
      )
    );
    refetch();
    return result;
  };


  const [unfreezeCartUpdate] = useMcMutation(UnfreezeCartUpdate);

  const unfreezeCart = async (carts) => {
    const result = await Promise.all(
      carts.map((cart) =>
      unfreezeCartUpdate({
          variables: {
            version: cart.version,
            cartId: cart.id,
          },
          context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          },
        })
      )
    );
    refetch();
    return result;
  };

  const results = useMemo(() => {
    if (!fetchLoading && !!data?.carts?.results?.length) {
      return data.carts.results;
    }
    return null;
  }, [fetchLoading, data, customerId]);

  return {
    carts: results,
    removeCarts,
    freezeCart,
    unfreezeCart,
    error: fetchError,
    loading: fetchLoading,
  };
};
