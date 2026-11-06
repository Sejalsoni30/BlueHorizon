import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollShift; // 0.0 = mint (flood), 1.0 = ember (drought)
  varying vec2 vUv;

  // 2D Simplex noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Mouse influence
    vec2 mouseDelta = uv - uMouse;
    float mouseDist = length(mouseDelta);
    float mouseRipple = sin(mouseDist * 16.0 - uTime * 2.5) * exp(-mouseDist * 3.5);

    // Fluid distortion using octave noise
    float n1 = snoise(uv * 2.2 + vec2(uTime * 0.12, uTime * 0.08) + mouseRipple * 0.25);
    float n2 = snoise(uv * 4.5 - vec2(uTime * 0.18, n1 * 0.35));

    // Base colors: Obsidian (#060606)
    vec3 cObsidian = vec3(0.024, 0.024, 0.024);
    // Mint (#5CFFB1)
    vec3 cMint = vec3(0.36, 1.0, 0.69);
    // Ember (#FF7A2F)
    vec3 cEmber = vec3(1.0, 0.48, 0.18);

    // Blend accent between Mint and Ember based on scroll shift
    vec3 activeAccent = mix(cMint, cEmber, clamp(uScrollShift, 0.0, 1.0));

    // Intensity weighting
    float glow = smoothstep(-0.25, 0.85, n1 + n2 * 0.5 + mouseRipple * 0.4);
    glow = pow(glow, 2.2);

    vec3 finalColor = mix(cObsidian, activeAccent * 0.42, glow * 0.55);

    // Subtle edge vignette
    float vignette = smoothstep(1.2, 0.2, length(uv - 0.5) * 1.5);
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export const LiquidShaderPlane: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollShift: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    uniforms.uTime.value = t;

    // Smooth mouse position mapping
    const pointer = state.pointer;
    const targetX = (pointer.x + 1) * 0.5;
    const targetY = (pointer.y + 1) * 0.5;
    mouseRef.current.lerp(new THREE.Vector2(targetX, targetY), 0.06);
    uniforms.uMouse.value.copy(mouseRef.current);

    uniforms.uScrollShift.value = THREE.MathUtils.lerp(
      uniforms.uScrollShift.value,
      scrollProgress,
      0.08
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[18, 12, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
};

