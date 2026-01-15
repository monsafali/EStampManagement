import React from "react";
import "../../styles/components/modal.css";

const Modal = ({
  title,
  subtitle,
  children,
  onClose,
  closeOnOverlay = true, // 👈 default behavior
}) => {
  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
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
