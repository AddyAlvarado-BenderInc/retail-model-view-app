import React from 'react';

function ClearArtButton({ clearTextures }) {
    return (
        <button
            className='clearButton'
            onClick={clearTextures}
            style={{
                width: '50%',
                textTransform: 'uppercase',
                padding: '10px',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }}
        >
            Clear
        </button>
    );
}

export default ClearArtButton;