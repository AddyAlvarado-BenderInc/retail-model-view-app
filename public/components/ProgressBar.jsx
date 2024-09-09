import React from 'react';

function ProgressBar({ progress }) {
    return (
        <div className="progress-bar-container" style={styles.container}>
            <div className="progress-bar" style={{ ...styles.bar, width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '80%',
        height: '30px',
        backgroundColor: '#ccc',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    bar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Sinter',
        fontWeight: '300',
        lineHeight: '30px',
        transition: 'width 0.3s ease',
    },
};

export default ProgressBar;