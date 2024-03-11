import {
  useApplicationContext,
  useCustomViewContext,
} from '@commercetools-frontend/application-shell-connectors';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { ContentNotification } from '@commercetools-uikit/notifications';
import SelectField from '@commercetools-uikit/select-field';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { getErrorMessage } from '../../helpers';

import { useShoppingLists } from '../../hooks/use-shooping-lists-connector';
import ShoppingList from '../shopping-list';
import ShoppingListTable from '../shopping-lists-table/shopping-lists-table';
import messages from './messages';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import {
  InfoDialog,
  useModalState,
} from '@commercetools-frontend/application-components';


const ShoppingLists = () => {
  const intl = useIntl();

  // const [isDeleteCartOpen, setIsDeleteCartOpen] = useState(false);
 // const [isUpdateCartOpen, setIsUpdateCartOpen] = useState(false);
  const [selectedAction, setSelectedAction]= useState();
  const [isShoppingListViewOpen, setIsShoppingListViewOpen] = useState(false);
  const [selectedShoppingList, setSelectedshoppingList] = useState([]);
  const infoModalState = useModalState();


  // const { env, testURL } = useApplicationContext(
  //   (context) => context.environment
  // );

  //const hostUrl = useCustomViewContext((context) => context.hostUrl);
  //const currentUrl = env === 'development' ? testURL : hostUrl;

  const { hostUrl } = useCustomViewContext((context) => ({
    hostUrl: context.hostUrl,
  }));

  //console.info("hostUrl: "+hostUrl)

//const url = "https://mc.australia-southeast1.gcp.commercetools.com/composable-demo/customers/8e3ff427-30b3-4c00-81a6-91ae450bfd7e/general";
const customerIdRegex = /\/customers\/([0-9a-fA-F-]+)\//
const match = hostUrl.match(customerIdRegex);
const customerId = match ? match[1] : null;

 


  const { shoppingLists, error, loading } = useShoppingLists({
    customerId
  });

  const handleOpenList = (shoppingList) => {
    setSelectedshoppingList([shoppingList]);
    setIsShoppingListViewOpen(true);
  };

 
  if (error || !customerId) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
 }




 if(loading){
 return (
    <LoadingSpinner />
 )
 }

  if (!loading && !shoppingLists?.length) {
    return (
      <ContentNotification type="info">
        <Text.Body intlMessage={messages.noResults} />
      </ContentNotification>
    );
  }

  return (
    <InfoMainPage title={intl.formatMessage(messages.title)}>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="s">
          <Text.Headline as="h2" intlMessage={messages.subtitle} />
        </Spacings.Stack>

        {loading && <LoadingSpinner />}

        {!!shoppingLists ? (
          <Spacings.Stack scale="l" alignItems="stretch">
            <Spacings.Inline
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Spacings.Stack scale="s" alignItems="stretch">
                <SelectField
                  title="Actions"
                  value="null"
                  isDisabled={selectedShoppingList.length === 0}
                  options={[{ value: 'delete', label: 'Delete' },{value: 'create', label: 'Create'}]}
                  onChange={(event) => {
                    setIsShoppingListViewOpen(true);
                    setSelectedAction(event.target.value);
                  }
                  }
                />
              </Spacings.Stack>
            </Spacings.Inline>

            {shoppingLists.length > 0 && (
              <ShoppingListTable
                items={shoppingLists}
                onSelectionChange={setSelectedshoppingList}
                onOpenShoppingList={handleOpenList}
                customerId={customerId}
              />
            )}
          </Spacings.Stack>
        ) : (
          <Spacings.Stack scale="s">
            <Text.Headline intlMessage={messages.noResults} />
          </Spacings.Stack>
        )}

        {isShoppingListViewOpen && (
          <ShoppingList
            onClose={() => setIsShoppingListViewOpen(false)}
            customerId={customerId}
            shoppingList={selectedShoppingList[0]}
          />
        )}

    

       

{/* {isUpdateCartOpen&& (
          <UpdateCart
            onClose={() => setIsUpdateCartOpen(false)}
            onCancel={() => setIsUpdateCartOpen(false)}
            customerId={customerId}
            selectedCarts={selectedCarts}
            action={selectedAction}
          />
        )} */}


      </Spacings.Stack>
    </InfoMainPage>
  );


};
ShoppingLists.displayName = 'Shopping Lists';

export default ShoppingLists;
