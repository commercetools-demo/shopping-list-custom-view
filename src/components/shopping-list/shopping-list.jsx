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
import DataTable from '@commercetools-uikit/data-table';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import { customProperties } from '@commercetools-uikit/design-system';
import TextField from '@commercetools-uikit/text-field';
import Grid from '@commercetools-uikit/grid';
import Card from '@commercetools-uikit/card';
import DateTimeField from '@commercetools-uikit/date-time-field';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import Constraints from '@commercetools-uikit/constraints';


const ShoppingList = ({ onClose, shoppingList }) => {
  const intl = useIntl();

  console.log("Shopping list: " +JSON.stringify(shoppingList))

  const [selectedItem, setSelectedItem] = useState([]);

  const [isLineItemViewOpen, setIsLineItemViewOpen] = useState(false);

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const formModalState = useModalState();



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



  const columns = [
    { key: 'key', label: 'Key' },
    { key: 'nameAllLocales', label: 'Name' },
    { key: 'qty', label: 'Quantity' },
    { key: 'productType', label: 'Product Type' },
    { key: 'addedAt', label: 'Added At' },
  ];

  function formatDateString(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}, ${hours}:${minutes}`;
}


  const itemRenderer = (
    item, column
  ) => {
    switch (column.key) {
      case 'key':
        //return item.nameAllLocales[0].value;

        return item.id.substring(0,4);

      case 'nameAllLocales':
        return item.nameAllLocales[0].value;
      case 'qty':
        return item.quantity;
      case 'productType':
        return item.productType.name;
        case 'addedAt':
          return formatDateString(item.addedAt);
      default:
        return null;
    }
  };
  


  return (
    <InfoModalPage
      title={intl.formatMessage(messages.title)}
      subtitle={shoppingList.key}
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
            
            
            <TextField title="Gift Registry name" horizontalConstraint={6} isReadOnly={true} value={shoppingList.nameAllLocales[0].value}  onChange={(event) => alert(event)} />
            
          </Card>
        </Grid.Item>




        <Grid.Item>
          <Card type="flat" insetScale="s">
            <TextField title="Created at" horizontalConstraint={6}  isReadOnly={true} value={formatDateString(shoppingList.createdAt)} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item>

        {/* <Grid.Item>
          <Card type="flat" insetScale="s">

            <MoneyField title="Total Price" horizontalConstraint={6} isReadOnly={true} value={{ amount: JSON.stringify(cart.totalPrice.centAmount / 100), currencyCode: cart.totalPrice.currencyCode }} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item>

        <Grid.Item>
          <Card type="flat" insetScale="s">
            <DateTimeField title="Modified" horizontalConstraint={6} timeZone="Australia/Sydney" isReadOnly={true} value={cart.lastModifiedAt} onChange={(event) => alert(event)} />
          </Card>
        </Grid.Item> */}


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
                options={[{ value: 'delete', label: 'Delete Line Item' },{value: 'add', label: 'Add Line Item'}]}
                onChange={() => isDeleteItemOpen(true)}
              />
            
            </Spacings.Inline>
            </Spacings.Stack>
            

          {/* <Spacings.Stack scale="l" alignItems="stretch"> */}
          <Constraints.Horizontal max="scale">
              <DataTable
                
                columns={columns}
                rows={shoppingList.lineItems}
                itemRenderer={itemRenderer}
                onRowClick={(item) => onOpenLineItem(item)}
              />
             </Constraints.Horizontal> 
          {/* </Spacings.Stack> */}
           
        </CollapsiblePanel>
     

      {/* <pre>{JSON.stringify(cart, null, 4)}</pre> */}
    </InfoModalPage>
  );
};

ShoppingList.propTypes = {
  onClose: PropTypes.func.isRequired,
  shoppingList: PropTypes.object.isRequired,
};

export default ShoppingList;
