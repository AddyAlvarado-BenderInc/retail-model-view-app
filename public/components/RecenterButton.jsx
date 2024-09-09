import React from 'react';
import { Vector3 } from 'three';

function RecenterButton({ orbitRef }) {
  const recenter = () => {
    if (orbitRef.current) {
      const { current } = orbitRef;

      const start = {
        cameraPosition: { ...current.object.position },
        targetPosition: { ...current.target },
      };

      const target = {
        cameraPosition: new Vector3(25, 6.5, 0),
        targetPosition: new Vector3(0, 0, 0),
      };

      let t = 0;

      const animateRecenter = () => {
        t += 0.02;

        current.object.position.lerpVectors(start.cameraPosition, target.cameraPosition, t);
        current.target.lerpVectors(start.targetPosition, target.targetPosition, t);
        current.update();

        if (t < 1) requestAnimationFrame(animateRecenter);
      };

      animateRecenter();
    }
  };

  return (
    <button className="recenter-button" onClick={recenter}>
      Recenter
    </button>
  );
}

export default RecenterButton;