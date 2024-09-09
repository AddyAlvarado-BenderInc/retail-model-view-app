import React from 'react';

function Tooltip({ message, position = 'top', children }) {
    return (
        <div className="tooltip-container" style={{ position: 'relative', display: 'inline-block' }}>
            {children}
            <div className={`tooltip-bubble tooltip-${position}`}>
                <div className="tooltip-message">{message}</div>
            </div>
        </div>
    );
}

export default Tooltip;