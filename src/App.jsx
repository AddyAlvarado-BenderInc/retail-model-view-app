import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { Stage, OrbitControls } from '@react-three/drei';
import { Model as Business_card } from '../public/Business_card';
import HandleTextureUpload from '../public/components/HandleTextureUpload';
import RecenterButton from '../public/components/RecenterButton';
import ClearArtButton from '../public/components/ClearArtButton';
import OverlayHint from '../public/components/OverlayHint';
import Tooltip from '../public/components/ToolTip';

function App() {
  const orbitRef = useRef();
  const [textureFront, setTextureFront] = useState(null);
  const [textureBack, setTextureBack] = useState(null);
  const [hoveredSide, setHoveredSide] = useState(null);
  const triggerUploadFront = useRef(null);
  const triggerUploadBack = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showTrimLines, setShowTrimLines] = useState(false); // State to control trim lines visibility

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
    setShowTrimLines(e.target.checked); // Set state based on checkbox checked value
  };

  return (
    <div className="App">
      {showOverlay && (
        <OverlayHint
          message={
            <>
              <span className="message-highlight">👆 Click & Drag</span> to orbit around the Business Card
              <br />
              <strong>⤿</strong><span className="message-highlight"> Click </span> on the Business Card sides to{' '}
              <span className="message-highlight">Upload Images 📷</span> <strong>⤾</strong>
              <br />
            </>
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
      <div className="BoxOverlay">
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
      <div id='rightBoxOverlay' className='rightBoxOverlay'>
            <div className="CheckboxWrapper">
              <div className='toggleElements'>
              <label class="switch">
                <input className='toggle-checkbox' type="checkbox" onChange={toggleTrimLines} />
                <span class="slider round"></span>
              </label>
                <p>Trim Lines</p>
              </div>
            </div>
      </div>
      <img width="300vh" className="bender-logo" src="retail-hover-app/public/assets/BenderRetailLogo.png" alt="Bender Logo" />
    </div>
  );
}

export default App;
