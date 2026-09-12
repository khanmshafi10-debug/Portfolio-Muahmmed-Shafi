import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Orbit, Compass, Cpu, Sparkles } from 'lucide-react';

interface FalseEarthAboutCanvasProps {
  className?: string;
}

export const FalseEarthAboutCanvas: React.FC<FalseEarthAboutCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telemetry, setTelemetry] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera & WebGL Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x18122b, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. High-End Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Cosmic Accent Lights (Purple & Cyan Neon Rim Lights)
    const purpleLight = new THREE.PointLight(0xa855f7, 5, 20);
    purpleLight.position.set(-4, 3, 4);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x38bdf8, 4, 20);
    cyanLight.position.set(4, -2, 3);
    scene.add(cyanLight);

    // 3. Procedural Starfield & Dust Particles
    const starCount = 800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // 4. Load False Earth 3D Astronaut Model & Idle Animation
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let characterMesh: THREE.Object3D | null = null;

    // Premium Metallic Materials matching False Earth aesthetic
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe, // Metallic Light Purple Suit Tone
      roughness: 0.2,
      metalness: 0.75,
      emissive: 0x2e1065,
      emissiveIntensity: 0.2,
    });

    const helmetVisorMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Glowing Cyan Visor
      roughness: 0.05,
      metalness: 0.95,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
    });

    const detailMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.3,
      metalness: 0.6,
    });

    const gltfLoader = new GLTFLoader();

    // Load Main Model
    gltfLoader.load(
      './models/Astronaut.glb',
      (gltf) => {
        characterMesh = gltf.scene;
        characterMesh.scale.set(1.15, 1.15, 1.15);
        characterMesh.position.set(0, -1.2, 0);

        characterMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.name.toLowerCase().includes('helmet') || mesh.name.toLowerCase().includes('visor')) {
              mesh.material = helmetVisorMaterial;
            } else if (mesh.name.toLowerCase().includes('body') || mesh.name.toLowerCase().includes('suit')) {
              mesh.material = bodyMaterial;
            } else {
              mesh.material = detailMaterial;
            }
          }
        });

        characterGroup.add(characterMesh);

        // Check if animations exist in Astronaut.glb
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(characterMesh);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }

        setIsLoading(false);

        // Load Idle skeletal animation
        gltfLoader.load('./models/Idle.glb', (idleGltf) => {
          if (characterMesh && idleGltf.animations && idleGltf.animations.length > 0) {
            if (!mixer) mixer = new THREE.AnimationMixer(characterMesh);
            mixer.stopAllAction();
            const action = mixer.clipAction(idleGltf.animations[0]);
            action.play();
          }
        });
      },
      undefined,
      (error) => {
        console.warn('GLTF fallback trigger:', error);
        setIsLoading(false);
      }
    );

    // 5. Interactive Mouse Parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
      mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 6. Animation RAF Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (mixer) mixer.update(delta);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Zero-G Orbital Float Motion
      const floatY = Math.sin(elapsed * 1.5) * 0.15;
      const floatX = Math.cos(elapsed * 1.2) * 0.08;

      characterGroup.position.x = mouse.x * 0.35 + floatX;
      characterGroup.position.y = mouse.y * 0.35 + floatY;

      characterGroup.rotation.y = mouse.x * 0.2 + Math.sin(elapsed * 0.9) * 0.06;
      characterGroup.rotation.x = -mouse.y * 0.18;
      characterGroup.rotation.z = -mouse.x * 0.05;

      starPoints.rotation.y = elapsed * 0.015;

      setTelemetry({
        x: Number(characterGroup.position.x.toFixed(2)),
        y: Number(characterGroup.position.y.toFixed(2)),
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      bodyMaterial.dispose();
      helmetVisorMaterial.dispose();
      detailMaterial.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full rounded-3xl bg-gradient-to-b from-[#251B3E]/95 via-[#1A1230]/95 to-[#120D26]/95 border border-[#A855F7]/40 shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-2xl overflow-hidden group ${className}`}>
      {/* Gloss Reflection Top Overlay */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/15 via-white/5 to-transparent rounded-t-3xl pointer-events-none z-10" />

      {/* Top Card Telemetry Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18122B]/85 border border-[#A855F7]/40 text-[#A855F7] text-[11px] font-mono font-bold tracking-wider backdrop-blur-md shadow-lg">
          <Orbit className="w-3.5 h-3.5 animate-spin-slow" />
          <span>FALSE EARTH 3D</span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#38BDF8] bg-[#18122B]/85 border border-[#38BDF8]/30 px-2.5 py-1 rounded-full backdrop-blur-md shadow-lg">
          <Cpu className="w-3 h-3 text-[#38BDF8]" />
          <span>ASTRONAUT.GLB</span>
        </div>
      </div>

      {/* Center 3D Canvas Viewport */}
      <div ref={mountRef} className="relative size-full min-h-[380px] sm:min-h-[440px] cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#18122B]/90 backdrop-blur-md pointer-events-none">
          <div className="w-8 h-8 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin mb-2" />
          <span className="text-xs font-mono text-[#A855F7] uppercase tracking-wider font-bold">
            Loading False Earth 3D Model...
          </span>
        </div>
      )}

      {/* Bottom Telemetry Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[10px] font-mono text-[#94A3B8] pointer-events-none bg-[#18122B]/85 border border-[#94A3B8]/20 px-3.5 py-2 rounded-2xl backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-[#A855F7]" />
          <span>POS &bull; X:{telemetry.x} Y:{telemetry.y}</span>
        </div>
        <div className="flex items-center gap-1 text-[#F8FAFC]">
          <Sparkles className="w-3 h-3 text-[#A855F7]" />
          <span>3D PARALLAX</span>
        </div>
      </div>
    </div>
  );
};
