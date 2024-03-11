import {
    ConfirmationDialog,
    InfoDialog,
    useModalState,
} from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useCart } from '../../hooks/use-cart-connector';
import messages from './messages';


const UpdateCart = ({ onClose, onCancel, customerId, selectedCarts, action }) => {
  const intl = useIntl();
  const confirmationModalState = useModalState();
  const { freezeCart } = useCart({ customerId });
  const { removeCarts } = useCart({ customerId });
  const { unfreezeCart } = useCart({ customerId });


  const handleConfirm = useCallback(async () => {
    if(action === "freeze" ){
      
       await freezeCart(selectedCarts);
    } else if(action == "unfreeze"){
      await unfreezeCart(selectedCarts);
    } else if(action == "delete"){
      await removeCarts(selectedCarts);
    }
    
    handleClose();
  }, []);

  const handleCancel = () => {
    confirmationModalState.closeModal();
    onCancel();
  };

  const handleClose = () => {
    confirmationModalState.closeModal();
    onClose();
  };


  useEffect(() => {
    confirmationModalState.openModal();
    return handleClose;
  }, []);


  
    let messageTitle;
    let disableConfirmation = false;
    if(action === "delete"){
      messageTitle = messages.titleDelete;
    } else if(action === 'freeze'){
      messageTitle = messages.titleFreeze; 
      if((selectedCarts[0].cartState !== 'Active')){
        messageTitle = messages.titleNoFreezePossible
        disableConfirmation = true;
      }
    } else if(action === 'unfreeze'){
      messageTitle = messages.titleUnfreeze; 
      if((selectedCarts[0].cartState !== 'Frozen')){
        messageTitle = messages.titleNoUnfreezePossible
        disableConfirmation = true;
      }
    } else {
      messageTitle = messages.titleNotrecognized;
    }
 


  return (
    <ConfirmationDialog
      title="Confirm Cart Update"
      isOpen={confirmationModalState.isModalOpen}
      onClose={confirmationModalState.closeModal}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isPrimaryButtonDisabled={disableConfirmation}
    >
      <Spacings.Stack scale="m">
        <Text.Body>
          {intl.formatMessage(messageTitle)}
        </Text.Body>
      </Spacings.Stack>
    </ConfirmationDialog>
  );
};

UpdateCart.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedCarts: PropTypes.array.isRequired,
  customerId: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired
};

export default UpdateCart;
