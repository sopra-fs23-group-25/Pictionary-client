import React from "react";
import "styles/ui/ErrorPopup.scss";

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className="error-popup">
      <div className="error-popup-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h1>Error</h1>
        <p className="error-message">{message}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
