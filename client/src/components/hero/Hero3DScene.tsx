import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LiquidShaderPlane } from './LiquidShaderPlane';

export const Hero3DScene: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  const terrainRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Dynamic topographic low-poly terrain
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 10, 36, 28);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.4) * 0.7 + Math.cos(y * 0.5) * 0.5 - Math.exp(-(x * x) * 0.1) * 1.1;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pointer = state.pointer;

    if (terrainRef.current) {
      terrainRef.current.rotation.z = Math.sin(t * 0.15) * 0.05 + pointer.x * 0.08;
      terrainRef.current.rotation.x = -Math.PI / 3 + pointer.y * 0.06;
      terrainRef.current.position.y = -1.6 + Math.sin(t * 0.4) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.2 + pointer.x * 0.3;
      ringRef.current.rotation.x = Math.sin(t * 0.15) * 0.15 + pointer.y * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 8]} intensity={1.4} color="#5CFFB1" />
      <pointLight position={[-6, -4, 4]} intensity={0.9} color="#FF7A2F" />

      {/* Interactive Liquid Fluid Shader Plane */}
      <LiquidShaderPlane scrollProgress={scrollProgress} />

      {/* Floating Low-Poly Topographic Terrain */}
      <mesh
        ref={terrainRef}
        geometry={terrainGeo}
        rotation={[-Math.PI / 3, 0, 0]}
        position={[0, -1.6, 0.4]}
      >
        <meshStandardMaterial
          color="#0E0F10"
          emissive="#5CFFB1"
          emissiveIntensity={0.08}
          roughness={0.7}
          metalness={0.3}
          wireframe={true}
        />
      </mesh>

      {/* Rotating Contour Elevation Rings */}
      <group ref={ringRef} position={[2.8, 0.6, -0.5]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.6, 0.015, 16, 64]} />
          <meshBasicMaterial color="#5CFFB1" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[Math.PI / 3, Math.PI / 6, 0]}>
          <torusGeometry args={[2.1, 0.012, 16, 64]} />
          <meshBasicMaterial color="#FF7A2F" transparent opacity={0.25} />
        </mesh>
      </group>
    </>
  );
};
