import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes
const FloatingShape = ({ position, color, speed = 1, distort = 0.3 }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.5;
            meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <icosahedronGeometry args={[1, 1]} />
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={distort}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

// Animated particles
const Particles = ({ count = 500 }) => {
    const points = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        return positions;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
            pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                color="#22c55e"
                sizeAttenuation
                transparent
                opacity={0.8}
            />
        </points>
    );
};

// Glowing orb
const GlowOrb = ({ position = [0, 0, 0], size = 2 }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(
                size + Math.sin(state.clock.elapsedTime * 2) * 0.1
            );
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
                color="#22c55e"
                transparent
                opacity={0.3}
            />
        </mesh>
    );
};

// Main 3D Scene
const Scene = () => {
    return (
        <>
            {/* Ambient lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#22c55e" />

            {/* Background stars */}
            <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            {/* Floating shapes */}
            <FloatingShape position={[-3, 1, -2]} color="#22c55e" speed={0.8} />
            <FloatingShape position={[3, -1, -3]} color="#3b82f6" speed={1.2} distort={0.5} />
            <FloatingShape position={[0, 2, -4]} color="#8b5cf6" speed={0.6} distort={0.2} />

            {/* Central glow */}
            <GlowOrb position={[0, 0, -5]} size={3} />

            {/* Particles */}
            <Particles count={300} />
        </>
    );
};

// ThreeHero Component
const ThreeHero = ({ children }) => {
    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
            {/* 3D Canvas Background */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 60 }}
                    dpr={[1, 2]}
                    gl={{ antialias: true, alpha: true }}
                >
                    <Scene />
                </Canvas>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-dark-900/80 via-dark-900/50 to-dark-900" />

            {/* Content overlay */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
                {children}
            </div>
        </div>
    );
};

export default ThreeHero;
