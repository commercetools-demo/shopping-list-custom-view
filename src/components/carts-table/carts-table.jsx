import DataTable, { useRowSelection } from '@commercetools-uikit/data-table';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { formatMoney } from '@commercetools-frontend/experimental-components';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import { useIntl } from 'react-intl';
import { useCart } from '../../hooks/use-cart-connector';
import Stamp from '@commercetools-uikit/stamp';

const initialVisibleColumns = [
  { key: 'id', label: 'Cart ID' },
  {key: 'cartState', label: 'State', isSortable: true},
  { key: 'count', label: 'Line Item count' },
  { key: 'totalPrice', label: 'Total price' },
  {
    key: 'billingAddress',
    label: 'Billing address',
  },
];

const initialHiddenColumns = [
  {
    key: 'shippingAddress',
    label: 'Shipping address',
  },
];

const initialColumnsState = [...initialVisibleColumns, ...initialHiddenColumns];

const getAddress = (address) => {
  if (!address) {
    return '';
  }
  return (
    (address.firstName || '') + ' ' +
    (address.lastName || '') +
    ', ' +
    (address.streetName || '') +
    ' ' +
    (address.streetNumber || '') +
    (address.postalCode || '') +
    ', ' +
    (address.city || '') +
    ', ' +
    (address.country || '')
  );
};

const CartsTable = ({ items, onSelectionChange, onOpenCart, customerId }) => {

  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const intl = useIntl();


  // const { carts, error, loading, refetch } = useCart({
  //   customerId,
  //   sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
  // });

  

  const [tableData, setTableData] = useState({
    columns: initialColumnsState,
    visibleColumnKeys: initialVisibleColumns.map(({ key }) => key),
  });

  const [isCondensed, setIsCondensed] = useState(true);

  const [isWrappingText, setIsWrappingText] = useState(false);
  const {
    rows: rowsWithSelection,
    toggleRow,
    deselectRow,
    selectAllRows,
    deselectAllRows,
    getIsRowSelected,
    getNumberOfSelectedRows,
  } = useRowSelection('checkbox', items);

  const countSelectedRows = getNumberOfSelectedRows();
  const isSelectColumnHeaderIndeterminate =
    countSelectedRows > 0 && countSelectedRows < rowsWithSelection.length;

  //  const handleSelectColumnHeaderChange =
  //    countSelectedRows === deselectAllRows;

  const mappedColumns = tableData.columns.reduce(
    (columns, column) => ({
      ...columns,
      [column.key]: column,
    }),
    {}
  );
  const visibleColumns = tableData.visibleColumnKeys.map(
    (columnKey) => mappedColumns[columnKey]
  );

  const columnsWithSelect = [
    {
      key: 'checkbox',
      label: (
        <CheckboxInput
          isIndeterminate={isSelectColumnHeaderIndeterminate}
          isChecked={false}
          onChange={deselectAllRows}
        />
      ),
      shouldIgnoreRowClick: true,
      align: 'center',
      renderItem: (row) => (
        <CheckboxInput
          isChecked={getIsRowSelected(row.id)}
          onChange={() => 
            {
              // only allow to select single row
              if(countSelectedRows<=0){
                toggleRow(row.id);
              }
              if(getIsRowSelected(row.id)){
                deselectRow(row.id)
              }
          }
            
            }
        />
      ),
      disableResizing: true,
    },
    ...visibleColumns,
  ];
  const onSettingChange = (action, nextValue) => {
    const {
      COLUMNS_UPDATE,
      IS_TABLE_CONDENSED_UPDATE,
      IS_TABLE_WRAPPING_TEXT_UPDATE,
    } = UPDATE_ACTIONS;

    switch (action) {
      case IS_TABLE_CONDENSED_UPDATE: {
        setIsCondensed(nextValue);
        break;
      }
      case IS_TABLE_WRAPPING_TEXT_UPDATE: {
        setIsWrappingText(nextValue);
        break;
      }
      case COLUMNS_UPDATE: {
        if (Array.isArray(nextValue)) {
          Array.isArray(nextValue) &&
            setTableData({
              ...tableData,
              columns: tableData.columns.filter((column) =>
                nextValue.includes(column.key)
              ),
              visibleColumnKeys: nextValue,
            });
        }
        break;
      }
      default:
        break;
    }
  };

  const displaySettings = {
    disableDisplaySettings: false,
    isCondensed,
    isWrappingText,
  };

  const columnManager = {
    areHiddenColumnsSearchable: true,
    disableColumnManager: false,
    visibleColumnKeys: tableData.visibleColumnKeys,
    hideableColumns: tableData.columns,
  };


  useEffect(() => {
    onSelectionChange(
      rowsWithSelection?.filter((row) => getIsRowSelected(row.id))
    );
  }, [countSelectedRows]);

  
  return (
    <DataTableManager
      columns={columnsWithSelect}
      onSettingsChange={onSettingChange}
      columnManager={columnManager}
      displaySettings={displaySettings}
    >
      <DataTable
        isCondensed
        rows={rowsWithSelection}
        columns={columnsWithSelect}
        itemRenderer={(item, column) => {
          switch (column.key) {
            case 'id':
              return item.id;
            case 'cartState':
              if(item.cartState === "Active"){
               return <Stamp tone="primary" label={item.cartState} />;
          
              }else if (item.cartState === "Merged"){
                return <Stamp tone="secondary" label={item.cartState} />;
              }else if (item.cartState === "Ordered"){
                return <Stamp tone="information" label={item.cartState} />;
              }  else if (item.cartState === "Frozen"){
                return <Stamp tone="critical" label={item.cartState} />;
              } 
              else{
                return item.cartState
              }
                
            case 'count':
              return item.lineItems?.reduce((a, c) => a + c.quantity, 0);
            case 'totalPrice':
              return formatMoney(item.totalPrice, intl);
            case 'shippingAddress':
              return getAddress(item.shippingAddress);
            case 'billingAddress':
              return getAddress(item.billingAddress);
            default:
              return null;
          }
        }}
        sortedBy={tableSorting.value.key}
        sortDirection={tableSorting.value.order}
        onSortChange={tableSorting.onChange}
        onRowClick={(item) => onOpenCart(item)}
      />
    </DataTableManager>
  );
};

CartsTable.propTypes = {
  items: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func,
  onOpenCart: PropTypes.func,
};

export default CartsTable;
