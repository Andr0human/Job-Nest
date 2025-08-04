import { Modal as ModalComponent } from 'antd';
import { forwardRef } from 'react';

const Modal = forwardRef((props, ref) => (
  <ModalComponent {...props} ref={ref} />
));

Modal.displayName = 'Modal';

export default Modal;
