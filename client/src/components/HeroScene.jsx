import React, { Suspense, useRef, useReducer, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Lightformer } from "@react-three/drei";
import { BallCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { easing } from "maath";
import ErrorBoundary from "./ErrorBoundary";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// Color and material properties based on the CodeSandbox example
const accents = ["#8A2BE2", "#500c90", "#E9E5EC", "#3c096c"];
const shuffle = (accent = 0) => [
  { color: "#444", roughness: 0.1, metalness: 0.5 },
  { color: "#444", roughness: 0.1, metalness: 0.5 },
  { color: "#444", roughness: 0.1, metalness: 0.5 },
  { color: "white", roughness: 0.1, metalness: 0.1 },
  { color: "white", roughness: 0.1, metalness: 0.1 },
  { color: "white", roughness: 0.1, metalness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true },
  { color: "#444", roughness: 0.1 },
  { color: "#444", roughness: 0.3 },
  { color: "#444", roughness: 0.3 },
  { color: "white", roughness: 0.1 },
  { color: "white", roughness: 0.2 },
  { color: "white", roughness: 0.1 },
  { color: accents[accent], roughness: 0.1, accent: true, transparent: true, opacity: 0.5 },
  { color: accents[accent], roughness: 0.3, accent: true },
  { color: accents[accent], roughness: 0.1, accent: true }
];

// Helper to handle sphere movement and material properties
function Sphere({ position, vec = new THREE.Vector3(), scale = 1, r = THREE.MathUtils.randFloatSpread, color = 'white', ...props }) {
  const api = useRef();
  const ref = useRef();
  const pos = useMemo(() => {
    if (position) return position;
    // Shift spheres to the left side by subtracting offset from x-coordinate
    return [r(5) - 5, r(10), r(10)]; // -5 offset to move spheres to left
  }, [position, r]);

  useFrame((state, delta) => {
    delta = Math.min(0.1, delta);
    if (api.current) {
      api.current.applyImpulse(
        vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
      );
    }
    if (ref.current?.material) {
      easing.dampC(ref.current.material.color, color, 0.2, delta);
    }
  });

  return (
    <RigidBody 
      linearDamping={4} 
      angularDamping={1} 
      friction={0.1} 
      position={pos} 
      ref={api} 
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial {...props} />
      </mesh>
    </RigidBody>
  );
}

// Invisible pointer to attract/repel spheres - shifted to left
function Pointer({ vec = new THREE.Vector3() }) {
  const ref = useRef();
  useFrame(({ mouse, viewport }) => {
    if (ref.current) {
      // Shift pointer interaction to left side by subtracting offset
      ref.current.setNextKinematicTranslation(
        vec.set(
          (mouse.x * viewport.width) / 2 - 5, // -5 offset to move interaction to left
          (mouse.y * viewport.height) / 2,
          0
        )
      );
    }
  });
  
  return (
    <RigidBody position={[-5, 0, 0]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

export default function HeroScene() {
  const [accent, click] = useReducer((state) => (state + 1) % accents.length, 0);
  const connectors = useMemo(() => shuffle(accent), [accent]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Scene as a background element */}
      <Canvas 
        className="absolute inset-0 z-0" 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: true }}
        // Camera positioned to focus on left side
        camera={{ position: [-5, 0, 20], fov: 45, near: 0.1, far: 100 }}
        onClick={click}
      >
        <Suspense fallback={
          <mesh position={[-5, 0, 0]} scale={2}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#666" wireframe />
          </mesh>
        }>
          <ErrorBoundary fallback={
            <mesh position={[-5, 0, 0]} scale={3}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="red" />
            </mesh>
          }>
            <color attach="background" args={["#141622"]} />
            
            {/* Lighting - shifted to left */}
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 10, 10]} intensity={1} />
            <directionalLight
              position={[-10, 5, 5]} // Adjusted to focus on left side
              intensity={0.5}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            <Physics timeStep="vary" gravity={[0, 0, 0]}>
              <Pointer />
              {connectors.map((props, i) => (
                <Sphere key={i} {...props} scale={1.5} />
              ))}
            </Physics>
            
            <Environment resolution={256}>
              <group rotation={[-Math.PI / 3, 0, 1]}>
                <Lightformer form="circle" intensity={100} rotation-x={Math.PI / 2} position={[-5, 5, -9]} scale={2} />
                <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-10, 1, -1]} scale={2} />
                <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-10, -1, -1]} scale={2} />
                <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[5, 1, 0]} scale={8} />
                <Lightformer form="ring" color="#4060ff" intensity={80} onUpdate={(self) => self.lookAt(-5, 0, 0)} position={[5, 10, 0]} scale={10} />
              </group>
            </Environment>

            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              maxPolarAngle={Math.PI}
              minPolarAngle={0}
              // Target the left side
              target={[-5, 0, 0]}
            />
          </ErrorBoundary>
        </Suspense>
      </Canvas>
      
      {/* Text Content - responsive positioning */}
      {/* Text Content */}

      <div className="mt-12 sm:mt-18 absolute top-20 sm:top-28 md:top-1/2 left-4 sm:left-8 md:left-20 lg:left-28 z-10 md:-translate-y-1/2 w-[92%] sm:w-[80%] md:max-w-lg">
        <div className="bg-white/10 backdrop-blur-lg 
          p-3 sm:p-5 md:p-8 
          rounded-lg shadow-lg border border-white/20
          max-h-[90vh] overflow-y-auto
        ">
        <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight text-white">
          Hi, I'm Bhumika Rawat!
        </h2>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight text-white mt-2">
          WEB DESIGNER
        </h1>
        <p className="mt-2 sm:mt-4 text-sm sm:text-lg md:text-xl text-gray-200 leading-relaxed">
          To showcase my skills, projects, and professional experience as a Full-Stack Developer 
                through a clean, user-friendly, and responsive portfolio website. The goal is to highlight 
                my technical expertise, creative problem-solving, and commitment to building efficient, 
                scalable, and user-centric web applications.
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 sm:mt-6">
          <div className="flex items-center gap-3 sm:gap-6 mt-4 md:mt-8">
            <a
              href="https://github.com/bhumirawat"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl text-white border border-transparent p-2 sm:p-3 rounded-full transition-all duration-300 hover:border-white hover:border-[1px] hover:scale-110 hover:-translate-y-1"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/bhumika-rawat-82880829a/"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl text-white border border-transparent p-2 sm:p-3 rounded-full transition-all duration-300 hover:border-white hover:border-[1px] hover:scale-110 hover:-translate-y-1"
            >
              <FaLinkedin />
            </a>
          </div>

          <div className="mt-4 md:mt-0 mb-2 sm:mb-0">
            <a
              href="mailto:rawatbhumika210@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold px-3 sm:px-4 py-2 rounded shadow border transition-all duration-300 
              bg-white text-[#141622] border-transparent hover:bg-white/10 hover:text-white hover:border-white 
              inline-flex items-center gap-2 text-sm sm:text-base"
            >
              Hire me <span>&#10148;</span>
            </a>
          </div>
        </div>
        </div>
      </div>


    </section>
  );
}




