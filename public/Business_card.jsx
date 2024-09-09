import React, { useState, useRef } from 'react';
import { Decal, useGLTF, useTexture, Line } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute } from 'three';

export function Model({ textureFront, textureBack, triggerUploadFront, triggerUploadBack, setHoveredSide, showTrimLines }) {
  const { nodes, materials } = useGLTF('/Business_card_UC.gltf');

  const [highlightFront, setHighlightFront] = useState(false);
  const [highlightBack, setHighlightBack] = useState(false);

  const textureFrontToUse = textureFront?.texture;
  const textureBackToUse = textureBack?.texture;

  const meshWidth = 3.75;
  const meshHeight = 2.25;

  const scaleXFront = (textureFront?.width / 405 * 32.5 || 405) / 405 * meshWidth;
  const scaleYFront = (textureFront?.height / 231 * 29.75 || 231) / 231 * meshHeight;

  const scaleXBack = (textureBack?.width / 405 * 32.5 || 405) / 405 * meshWidth;
  const scaleYBack = (textureBack?.height / 231 * 29.75 || 231) / 231 * meshHeight;

  const trimLineInset = useRef();

  const createTrimLineGeometry = () => {
    const geometry = new BufferGeometry();
    const vertices = new Float32BufferAttribute([
      -meshWidth / 2 + 0.97, meshHeight / 2 - 0.19, 0,
      -meshWidth / 1.5 + 1, meshHeight / 2 - 0.19, 0,
      -meshWidth / -6.5 + 1, meshHeight / 2 - 0.19, 0,
      meshWidth / 2 - 0.97, meshHeight / 2 - 0.19, 0,
      meshWidth / 2 - 0.97, meshHeight / 1.5 - 0.19, 0,
      meshWidth / 2 - 0.97, -meshHeight / 2 + 0.19, 0,
      meshWidth / 2 - 0.97, -meshHeight / 1.5 + 0.19, 0,
      meshWidth / 2 - 0.97, -meshHeight / 2 + 0.19, 0,
      meshWidth / 1.5 - 0.97, -meshHeight / 2 + 0.19, 0,
      meshWidth / -6.5 - 0.97, -meshHeight / 2 + 0.19, 0,
      -meshWidth / 2 + 0.97, -meshHeight / 2 + 0.19, 0,
      -meshWidth / 2 + 0.97, -meshHeight / 1.5 + 0.19, 0,
      -meshWidth / 2 + 0.97, -meshHeight / -6.5 + 0.19, 0,
      -meshWidth / 2 + 0.97, -meshHeight / -2 + 0.19, 0,
      -meshWidth / 2 + 0.97, meshHeight / 2 - 0.19, 0
    ], 3);
    geometry.setAttribute('position', vertices);
    return geometry;
  };

  return (
    <group dispose={null}>
      <group position={[0, 1.222, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[2, 1, 3.5]}>
        <mesh geometry={nodes.Plane_1.geometry} material={materials.front}>
          <Decal
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            scale={[scaleXFront, scaleYFront, 1]}
            onPointerOver={() => {
              setHoveredSide('front');
              setHighlightFront(true);
            }}
            onPointerOut={() => {
              setHoveredSide(null);
              setHighlightFront(false);
            }}
            onPointerDown={(event) => {
              if (event.button === 2) {
                event.stopPropagation();
                return;
              }
              if (triggerUploadFront.current) triggerUploadFront.current();
            }}
            onContextMenu={(event) => event.preventDefault()}
          >
            <meshStandardMaterial
              map={textureFrontToUse}
              emissive={highlightFront ? 'white' : 'black'}
              emissiveIntensity={highlightFront ? 0.5 : 0}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={1}
            />
          </Decal>
        </mesh>

        <mesh geometry={nodes.Plane_2.geometry} material={materials.back}>
          <Decal
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, Math.PI / 2]}
            scale={[scaleXBack, scaleYBack, 2]}
            onPointerOver={() => {
              setHoveredSide('back');
              setHighlightBack(true);
            }}
            onPointerOut={() => {
              setHoveredSide(null);
              setHighlightBack(false);
            }}
            onPointerDown={(event) => {
              if (event.button === 2) {
                event.stopPropagation();
                return;
              }
              if (triggerUploadBack.current) triggerUploadBack.current();
            }}
            onContextMenu={(event) => event.preventDefault()}
          >
            <meshStandardMaterial
              map={textureBackToUse}
              emissive={highlightBack ? 'white' : 'black'}
              emissiveIntensity={highlightBack ? 0.5 : 0}
              polygonOffset
              polygonOffsetFactor={-1}
              polygonOffsetUnits={1}
            />
          </Decal>
        </mesh>
        {showTrimLines && (
          <>
            <line ref={trimLineInset} geometry={createTrimLineGeometry()} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
              <lineBasicMaterial color={'red'} linewidth={2} />
            </line>
            <line ref={trimLineInset} geometry={createTrimLineGeometry()} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
              <lineBasicMaterial color={'red'} linewidth={2} />
            </line>
          </>
        )}

        <mesh geometry={nodes.Plane_3.geometry} material={materials.edges} />
      </group>
    </group>
  );
}

useGLTF.preload('/Business_card.gltf');