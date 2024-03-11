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
import { useCart } from '../../hooks/use-cart-connector';
import Cart from '../cart';
import CartsTable from '../carts-table';
import UpdateCart from '../update-cart';
import messages from './messages';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import {
  InfoDialog,
  useModalState,
} from '@commercetools-frontend/application-components';


const Carts = () => {
  const intl = useIntl();

  // const [isDeleteCartOpen, setIsDeleteCartOpen] = useState(false);
  const [isUpdateCartOpen, setIsUpdateCartOpen] = useState(false);
  const [selectedAction, setSelectedAction]= useState();
  const [isCartViewOpen, setIsCartViewOpen] = useState(false);
  const [selectedCarts, setSelectedCarts] = useState([]);
  const infoModalState = useModalState();
  const [isCartFreezeInfo, setIsCartFreezeInfo]= useState(false);

  const { env, testURL } = useApplicationContext(
    (context) => context.environment
  );

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

 
 const defaultSort = "cartState asc"

  const { carts, error, loading } = useCart({
    customerId, defaultSort
  });

  const handleOpenCart = (cart) => {
    setSelectedCarts([cart]);
    setIsCartViewOpen(true);
  };

 
  if (error || !customerId) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
 }

//  const handleInfoDialogs = (currentSelectedAction) =>
//  {
//   console.log("selectedCarts[0].cartState: " + selectedCarts[0].cartState);
//   console.log(currentSelectedAction);
//   console.log("isUpdateCartOpen: " + isUpdateCartOpen);
//   if((selectedCarts[0].cartState !== 'Active')  && (selectedAction === "freeze") ){
//     setIsCartFreezeInfo(true)
//   }else if((selectedCarts[0].cartState === 'Active')  && (selectedAction === "freeze")){
//     setIsCartFreezeInfo(false)
//   }

//   console.log("isCartFreezeInfo: " +isCartFreezeInfo)
//  }


 if(loading){
 return (
    <LoadingSpinner />
 )
 }

  if (!loading && !carts?.length) {
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

        {!!carts ? (
          <Spacings.Stack scale="l" alignItems="stretch">
            <Spacings.Inline
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Spacings.Stack scale="s" alignItems="stretch">
                <SelectField
                  title="Actions"
                  value="null"
                  isDisabled={selectedCarts.length === 0}
                  options={[{ value: 'delete', label: 'Delete' },{ value: 'freeze', label: 'Freeze Cart' },{ value: 'unfreeze', label: 'Unfreeze Cart' }]}
                  onChange={(event) => {
                    setIsUpdateCartOpen(true);
                    setSelectedAction(event.target.value);
                  }
                  }
                />
              </Spacings.Stack>
            </Spacings.Inline>

            {carts.length > 0 && (
              <CartsTable
                items={carts}
                onSelectionChange={setSelectedCarts}
                onOpenCart={handleOpenCart}
                customerId={customerId}
              />
            )}
          </Spacings.Stack>
        ) : (
          <Spacings.Stack scale="s">
            <Text.Headline intlMessage={messages.noResults} />
          </Spacings.Stack>
        )}

        {isCartViewOpen && (
          <Cart
            onClose={() => setIsCartViewOpen(false)}
            customerId={customerId}
            cart={selectedCarts[0]}
          />
        )}

        {isCartFreezeInfo && (
          <CartFeezeInfo
  
          />
        )}

       

{isUpdateCartOpen&& (
          <UpdateCart
            onClose={() => setIsUpdateCartOpen(false)}
            onCancel={() => setIsUpdateCartOpen(false)}
            customerId={customerId}
            selectedCarts={selectedCarts}
            action={selectedAction}
          />
        )}


      </Spacings.Stack>
    </InfoMainPage>
  );


};
Carts.displayName = 'Carts';

export default Carts;
