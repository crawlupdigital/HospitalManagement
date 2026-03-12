import React from 'react';
import { AlertTriangle} from 'lucide-react';
import Modal from './Modal';
import { Button } from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmLabel = 'Confirm', variant = 'danger' }) => {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    primary: 'bg-blue-600 hover:bg-blue-700',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="text-center py-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button className={`text-white ${variantStyles[variant]}`} onClick={onConfirm}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
