import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate subtle undulation terrain
  const terrainGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 20, 48, 48);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Gentle valley and riverbed depression
      const z = Math.sin(x * 0.2) * 1.2 + Math.cos(y * 0.25) * 0.8 - Math.exp(-(x * x) * 0.05) * 1.5;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // Sparse rain particles
  const particleGeo = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = Math.random() * 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (waterRef.current) {
      // Gentle undulating waterline
      waterRef.current.position.z = -0.4 + Math.sin(t * 0.8) * 0.08;
    }
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let z = pos.getZ(i) - 0.08;
        if (z < -1) z = 8;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#22D3EE" />
      <pointLight position={[-8, -5, 4]} intensity={0.8} color="#14B8A6" />

      {/* Topographic valley terrain */}
      <mesh
        ref={meshRef}
        geometry={terrainGeo}
        rotation={[-Math.PI / 3, 0, 0]}
        position={[0, -2, -2]}
      >
        <meshStandardMaterial
          color="#071B34"
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
          flatShading
        />
      </mesh>

      {/* Shader-like dynamic water surface */}
      <mesh
        ref={waterRef}
        rotation={[-Math.PI / 3, 0, 0]}
        position={[0, -2.2, -0.4]}
      >
        <planeGeometry args={[28, 18, 32, 32]} />
        <meshPhysicalMaterial
          color="#0A4D8C"
          emissive="#22D3EE"
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Sparse soft rain particles */}
      <points ref={particlesRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.06}
          color="#22D3EE"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

