import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, OrbitControls } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import * as THREE from 'three';

const SceneContent: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { scrollYProgress } = useScroll();

  useFrame((state, delta) => {
    // Animate the mesh rotation based on time
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;
    
    // Also animate based on scroll progress for an interactive feel
    meshRef.current.rotation.z = scrollYProgress.get() * Math.PI * 2;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <TorusKnot ref={meshRef} args={[1.5, 0.3, 200, 32]}>
        <meshStandardMaterial 
          color="#3b82f6" 
          metalness={0.6} 
          roughness={0.2}
        />
      </TorusKnot>
    </>
  );
};

const Scrollable3DScene: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scrollable3DScene;
