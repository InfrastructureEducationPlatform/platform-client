import React from 'react';

import '../css/custom-modal.css';

export function CustomModal({
  isVisible,
  children,
  onOuterClick = () => {},
  style = {},
}: {
  isVisible: boolean;
  children: React.ReactNode;
  onOuterClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`modal ${isVisible ? 'visible' : ''}`}
      onClick={onOuterClick}
    >
      <div
        className="modal-content"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
