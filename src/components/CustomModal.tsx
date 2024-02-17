import React from 'react';

import '../css/custom-modal.css';

export function CustomModal({
  isVisible,
  children,
  onOuterClick = () => {},
}: {
  isVisible: boolean;
  children: React.ReactNode;
  onOuterClick?: () => void;
}) {
  return (
    <div
      className={`modal ${isVisible ? 'visible' : ''}`}
      onClick={onOuterClick}
    >
      <div className="modal-content">{children}</div>
    </div>
  );
}
