import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { Stage, OrbitControls } from '@react-three/drei';
import { Model as Business_card } from '../public/Business_card';
import HandleTextureUpload from '../public/components/HandleTextureUpload';
import RecenterButton from '../public/components/RecenterButton';
import ClearArtButton from '../public/components/ClearArtButton';
import OverlayHint from '../public/components/OverlayHint';
import Tooltip from '../public/components/ToolTip';
import HamburgerMenu from '../public/components/HamburgerMenu';

function App() {
  const orbitRef = useRef();
  const [textureFront, setTextureFront] = useState(null);
  const [textureBack, setTextureBack] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);
  const triggerUploadFront = useRef(null);
  const triggerUploadBack = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showTrimLines, setShowTrimLines] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 400);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const meshWidth = 3.5;
  const meshHeight = 2;
  const dpi = 300;

  const getColorForSide = (side) => {
    switch (side) {
      case 'front':
        return 'black';
      case 'back':
        return 'darkgrey';
      default:
        return 'black';
    }
  };

  const dismissOverlay = () => {
    setShowOverlay(false);
  };

  const displayOverlay = () => {
    setShowOverlay(true);
  };

  const toggleTrimLines = (e) => {
    setShowTrimLines(e.target.checked);
  };

  return (
    <div className="App">
      {showOverlay && (
        <OverlayHint
          message={
            isSmallScreen ? (
              <>
                <span className="message-highlight">👆 Hold & Drag</span> to orbit the Business Card
                <br />
                <span className="message-highlight"> ✌️ Use Two Fingers </span> to pan around the Business Card 
                <br />
                <span className="message-highlight"> 🤏 Pinch-In </span> to zoom out
                <br />
                <span className="message-highlight"> 👌 Pinch-Out </span> to zoom in
              </>
            ) : (
              <>
                <span className="message-highlight">👆 Click & Drag</span> to orbit around the Business Card
                <br />
                <strong>⤿</strong><span className="message-highlight"> Click </span> on the Business Card sides to{' '}
                <span className="message-highlight">Upload Images 📷</span> <strong>⤾</strong>
              </>
            )
          }
          onDismiss={dismissOverlay}
        />
      )}
      <Canvas flat shadows camera={{ position: [10, 40, 0], fov: 25 }}>
        <ambientLight intensity={0.25 * Math.PI} />
        <spotLight decay={0} position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Stage
          intensity={0.95}
          environment="city"
          shadows={{ type: 'accumulative', bias: -0.001, intensity: Math.PI }}
          adjustCamera={false}
        >
          <Business_card
            textureFront={textureFront}
            textureBack={textureBack}
            triggerUploadFront={triggerUploadFront}
            triggerUploadBack={triggerUploadBack}
            setHoveredSide={setHoveredSide}
            showTrimLines={showTrimLines}
          />
        </Stage>
        <OrbitControls ref={orbitRef} enableZoom enablePan makeDefault minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
        <EffectComposer disableNormalPass>
          <ToneMapping />
        </EffectComposer>
      </Canvas>

      {isSmallScreen && (
        <HamburgerMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
      )}

      <div className={`BoxOverlay ${isSmallScreen && menuOpen ? 'open' : ''}`}>
        <div className="ToolWrapper">
          <HandleTextureUpload
            setTextureFront={setTextureFront}
            setTextureBack={setTextureBack}
            dpi={dpi}
            meshWidth={meshWidth}
            meshHeight={meshHeight}
            triggerUploadFront={triggerUploadFront}
            triggerUploadBack={triggerUploadBack}
          />
          <RecenterButton orbitRef={orbitRef} />
          <div className="UploadButtons">
            <Tooltip message="Upload an image for the front side of the business card">
              <button onClick={() => triggerUploadFront.current()}>Upload Front</button>
            </Tooltip>
            <Tooltip message="Upload an image for the back side of the business card">
              <button onClick={() => triggerUploadBack.current()}>Upload Back</button>
            </Tooltip>
          </div>
          <ClearArtButton clearTextures={() => { setTextureFront(null); setTextureBack(null); }} />

          <button className="show-tips-button" onClick={displayOverlay}>Show Tips</button>
        </div>
      </div>

      {hoveredSide && (
        <div className="HoverText"
          style={{
            color: getColorForSide(hoveredSide),
          }}
        >
          {`Click to upload file to ${hoveredSide} side`}
        </div>
      )}

      <div className='rightBoxOverlay'>
        <div className="CheckboxWrapper">
          <div className='toggleElements'>
            <label className="switch">
              <input className='toggle-checkbox' type="checkbox" onChange={toggleTrimLines} />
              <span className="slider round"></span>
            </label>
            <p>Trim Lines</p>
          </div>
        </div>
      </div>
      <img width="300vh" className="bender-logo" src="https://store.bender-inc.com/DSF/IMGS/A6B0F33A-F440-4378-8E9A-BB320EE87610/RESPONSIVEUIDATA/STOREFRONT_2281/BENDERRETAILLOGO.PNG/" alt="Bender Logo" />
    </div>
  );
}

export default App;
