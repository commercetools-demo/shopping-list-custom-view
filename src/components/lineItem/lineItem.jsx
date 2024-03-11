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




import PrimaryButton from '@commercetools-uikit/primary-button';


const LineItem = ({lineItem, onClose}) => {
  const intl = useIntl();


  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project?.languages,
  }));

  const formModalState = useModalState();


  const handleClose = () => {
    formModalState.closeModal();
    onClose();
  };

  useEffect(() => {
    formModalState.openModal();
    return handleClose;
  }, []);


  
  


  return (
    <InfoModalPage
      title={intl.formatMessage(messages.title)}
      subtitle={lineItem.id}
      topBarPreviousPathLabel={intl.formatMessage(messages.previous)}
      isOpen={formModalState.isModalOpen}
      onClose={handleClose}
      level={2}
      baseZIndex={10}
    >

<Spacings.Stack scale="m">


{/* <Grid
        gridTemplateColumns={`repeat(2, ${customProperties.constraint11})`}
        gridGap={customProperties.spacingM}
      >
        <Grid.Item>
          <Card type="flat" insetScale="s">

          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <PrimaryButton
              onClick={() => {
                console.log("lineItem ID to delete" + lineItem.id)
              }}
              iconLeft={<WarningIcon />}
              label={intl.formatMessage(messages.delete)}
              tone='critical'
            />
          </div>
          </Card>
        </Grid.Item>
        </Grid> */}


</Spacings.Stack>




    

      <pre>{JSON.stringify(lineItem, null, 4)}</pre>
    </InfoModalPage>
  );
};

LineItem.propTypes = {
  lineItem: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LineItem;
