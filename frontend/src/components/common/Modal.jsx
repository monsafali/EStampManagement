import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/components/modal.css";

const Modal = ({
  title,
  subtitle,
  children,
  onClose,
  closeOnOverlay = true,
}) => {
  const handleOverlayClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="overlay-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p className="update-sub">{subtitle}</p>}
          </div>

          {/* CLOSE BUTTON */}
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
