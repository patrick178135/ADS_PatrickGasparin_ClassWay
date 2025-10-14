import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        {children}
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Fechar</button>
      </div>
    </div>
  );
};

export default Modal;
