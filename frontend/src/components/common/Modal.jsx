import React from "react";
import "../../styles/components/modal.css";

const Modal = ({ title, subtitle, children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="update-adc-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3>{title}</h3>}
        {subtitle && <p className="update-sub">{subtitle}</p>}

        {children}
      </div>
    </div>
  );
};

export default Modal;
