/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { useMemo } from 'react';
import FetchShoppingList from './fetch-shopping-lists.ctp.graphql'


export const useShoppingLists = ({ customerId }) => {
  //`customerId="${customerId}"`;
  const where = `customer(id="${customerId}")`; // "customer(id=" $customerId ")")
  const {
    refetch,
    data,
    error: fetchError,
    loading: fetchLoading,
  } = useMcQuery(FetchShoppingList, {
    variables: {
      where
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });




  const results = useMemo(() => {
    if (!fetchLoading && !!data?.shoppingLists?.results?.length) {
      return data.shoppingLists.results;
    }
    return null;
  }, [fetchLoading, data, customerId]);

  return {
    shoppingLists: results,
    error: fetchError,
    loading: fetchLoading,
  };
};