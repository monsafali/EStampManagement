import React from "react";
import "../../styles/components/tooltip.css"

const Tooltip = ({ text, position = "top", children }) => {
  return (
    <div className={`tooltip-wrapper tooltip-${position}`}>
      {children}
      <span className="tooltip-box">{text}</span>
    </div>
  );
};

export default Tooltip;
