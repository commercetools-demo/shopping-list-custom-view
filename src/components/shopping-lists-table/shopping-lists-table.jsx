import DataTable, { useRowSelection } from '@commercetools-uikit/data-table';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import DataTableManager, {
  UPDATE_ACTIONS,
} from '@commercetools-uikit/data-table-manager';
import { useDataTableSortingState } from '@commercetools-uikit/hooks';
import { useIntl } from 'react-intl';


const initialVisibleColumns = [
  { key: 'key', label: 'Key' },
  { key: 'nameAllLocales',label: 'Name'},
  { key: 'createdAt', label: 'Created at' },
  { key: 'items', label: 'Number of items' }  
];


const initialColumnsState = [...initialVisibleColumns];



const ShoppingListTable = ({ items, onSelectionChange, onOpenShoppingList, customerId }) => {

  const tableSorting = useDataTableSortingState({ key: 'createdAt', order: 'asc' });
  const intl = useIntl();



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

  function formatDateString(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}, ${hours}:${minutes}`;
}

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
            case 'key':
              return item.key;
            case 'items':
              return item.lineItems.length;
            case 'createdAt':
              return formatDateString(item.createdAt);
            case 'nameAllLocales':
              return item.nameAllLocales[0].value;

            default:
              return null;
          }
        }}
        sortedBy={tableSorting.value.key}
        sortDirection={tableSorting.value.order}
        onSortChange={tableSorting.onChange}
        onRowClick={(item) => onOpenShoppingList(item)}
      />
    </DataTableManager>
  );
};

ShoppingListTable.propTypes = {
  items: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func,
  onOpenShoppingList: PropTypes.func,
};

export default ShoppingListTable;
