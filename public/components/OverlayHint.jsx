import React, { useEffect } from 'react';
 
function OverlayHint({ message, onDismiss }) {
  useEffect(() => {
    const dismissHandler = (event) => {
      if (event.target.closest('.show-tips-button')) {
        return;
      }
      onDismiss();
    };
 
    window.addEventListener('click', dismissHandler);
    window.addEventListener('keydown', dismissHandler);
    window.addEventListener('touchstart', dismissHandler);
 
    return () => {
      window.removeEventListener('click', dismissHandler);
      window.removeEventListener('keydown', dismissHandler);
      window.removeEventListener('touchstart', dismissHandler);
    };
  }, [onDismiss]);
 
  return (
<div className="overlay-hint">
<div className="overlay-hint-message">
        {message}
</div>
</div>
  );
}
 
export default OverlayHint;