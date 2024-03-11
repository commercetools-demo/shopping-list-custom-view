import {
  InfoModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import SelectField from '@commercetools-uikit/select-field';
import { useIntl } from 'react-intl';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import DataTable from '@commercetools-uikit/data-table';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import { customProperties } from '@commercetools-uikit/design-system';
import TextField from '@commercetools-uikit/text-field';
import MoneyField from '@commercetools-uikit/money-field';
import Grid from '@commercetools-uikit/grid';
import Card from '@commercetools-uikit/card';
import DateTimeField from '@commercetools-uikit/date-time-field';
import { formatMoney } from '@commercetools-frontend/experimental-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Constraints from '@commercetools-uikit/constraints';
import { WarningIcon } from '@commercetools-uikit/icons';
import Stamp from '@commercetools-uikit/stamp';
import CheckboxInput from '@commercetools-uikit/checkbox-input';


import {
  formatLocalizedString,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import LineItem from '../lineItem/lineItem';


const Cart = ({ onClose, cart }) => {
  const intl = useIntl();

  const [selectedItem, setSelectedItem] = useState([]);

  const [isLineItemViewOpen, setIsLineItemViewOpen] = useState(false);

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const formModalState = useModalState();
  const isCartAcvite = cart.cartState === "Active" ? true : false;


  const handleClose = () => {
    formModalState.closeModal();
    onClose();
  };

  const onOpenLineItem = (lineItem) => {
    setIsLineItemViewOpen(true);
    setSelectedItem(lineItem);
  };

  useEffect(() => {
    formModalState.openModal();
    return handleClose;
  }, []);

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const columns = [
    { key: 'product', label: 'Product' },
    { key: 'sku', label: 'SKU' },
    { key: 'qty', label: 'Quantity' },
    { key: 'total', label: 'Total' },

  ];
  


  const itemRenderer = (
    item, column
  ) => {
    switch (column.key) {
      case 'product':
        //return item.nameAllLocales[0].value;

        return formatLocalizedString(
          {
            name: transformLocalizedFieldToLocalizedString(
              item.nameAllLocales ?? []
            ),
          },
          {
            key: 'name',
            locale: dataLocale,
            fallbackOrder: projectLanguages,
            fallback: NO_VALUE_FALLBACK,
          }
        );

      case 'sku':
        return item.variant.sku;
      case 'qty':
        return item.quantity;
      case 'total':
        return formatMoney(item.price.value, intl);
      default:
        return null;
    }
  };
  


  return (
    <InfoModalPage
      title={intl.formatMessage(messages.title)}
      subtitle={cart.id}
      topBarPreviousPathLabel={intl.formatMessage(messages.previous)}
      isOpen={formModalState.isModalOpen}
      onClose={handleClose}
      level={2}
      baseZIndex={10}
    >

      <Grid
        gridTemplateColumns={`repeat(2, ${customProperties.constraint11})`}
        gridGap={customProperties.spacingM}
      >
        <Grid.Item>
          <Card type="flat" insetScale="s">
            {isCartAcvite?
            
            <TextField title="Cart state" horizontalConstraint={6} isReadOnly={true} value={cart.cartState} hint="Currently active cart" hintIcon={<WarningIcon color="primary" />} onChange={(event) => alert(event)} />
            :
            <TextField title="Cart state" horizontalConstraint={6} isReadOnly={true} value={cart.cartState} hint="Inactive Cart" hintIcon={<WarningIcon color="warning" />}  onChange={(event) => alert(event)} />
            }
          </Card>
        </Grid.Item>




        <Grid.Item>
          <Card type="flat" insetScale="s">
            <DateTimeField title="Created" horizontalConstraint={6} timeZone="Australia/Sydney" isReadOnly={true} value={cart.createdAt} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item>

        <Grid.Item>
          <Card type="flat" insetScale="s">

            <MoneyField title="Total Price" horizontalConstraint={6} isReadOnly={true} value={{ amount: JSON.stringify(cart.totalPrice.centAmount / 100), currencyCode: cart.totalPrice.currencyCode }} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item>

        <Grid.Item>
          <Card type="flat" insetScale="s">
            <DateTimeField title="Modified" horizontalConstraint={6} timeZone="Australia/Sydney" isReadOnly={true} value={cart.lastModifiedAt} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item>


      </Grid>




        <CollapsiblePanel
          header={
            <CollapsiblePanel.Header>
              Line Items
            </CollapsiblePanel.Header>
          }>

<Spacings.Stack scale="l" alignItems="stretch">
            <Spacings.Inline
              alignItems="flex-start"
              justifyContent="space-between"
            >
           
            <SelectField
                title="Actions"
                value="null"
                isDisabled={false}
                options={[{ value: 'delete', label: 'Delete Line Item' }, { value: 'discount', label: 'Add Discount' }]}
                onChange={() => isDeleteItemOpen(true)}
              />
            
            </Spacings.Inline>
            </Spacings.Stack>
            

          {/* <Spacings.Stack scale="l" alignItems="stretch"> */}
          <Constraints.Horizontal max="scale">
              <DataTable
                
                columns={columns}
                rows={cart.lineItems}
                itemRenderer={itemRenderer}
                onRowClick={(item) => onOpenLineItem(item)}
              />
             </Constraints.Horizontal> 
          {/* </Spacings.Stack> */}
           
        </CollapsiblePanel>


        <Spacings.Stack scale="s">
           
           {isLineItemViewOpen && (
            <LineItem
              lineItem={selectedItem}
              onClose={() => setIsLineItemViewOpen(false)}
            />
           )}

          </Spacings.Stack>
     

      {/* <pre>{JSON.stringify(cart, null, 4)}</pre> */}
    </InfoModalPage>
  );
};

Cart.propTypes = {
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
};

export default Cart;
