import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import './Modal.scss';

interface ModalProps {
  title: string;
  buttonText: string;
  children?: React.ReactNode;
}

export const Modal = function({ title, buttonText, children }: ModalProps): ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <button className="modal-button" onClick={() => { setIsOpen(true); }}>{buttonText}</button>

    {isOpen ?
      createPortal(
      <div className="modal-background" onClick={() => { setIsOpen(false); }}>
        <div className="modal" onClick={(e) => { e.stopPropagation(); }}>
          <span className="modal__close" onClick={() => { setIsOpen(false); }}>&times;</span>
          <h2 className="modal__title">{title}</h2>
          <div className="modal__content">{children}</div>
        </div>
      </div>,
      document.body
    ) :
    null
  }</>;
};