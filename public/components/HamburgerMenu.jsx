import React from 'react';
import PropTypes from 'prop-types';
import '/src/hamburgerMenu.css';

function HamburgerMenu({ menuOpen, toggleMenu }) {
    return (
        <div className={`hamburger-menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            {menuOpen ? (
                <span className="close-icon">✕</span>
            ) : (
                <>
                    <div className="hamburger-line top-line"></div>
                    <div className="hamburger-line middle-line"></div>
                    <div className="hamburger-line bottom-line"></div>
                </>
            )}
        </div>
    );
}

HamburgerMenu.propTypes = {
    menuOpen: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
};

export default HamburgerMenu;