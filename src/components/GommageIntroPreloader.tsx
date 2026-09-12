import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface GommageIntroPreloaderProps {
  onComplete: () => void;
}

export const GommageIntroPreloader: React.FC<GommageIntroPreloaderProps> = ({ onComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Setup Three.js Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    // Scene background transparent to show vibrant CSS radial nebula flare
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // 2. Mood Lighting Setup — Sleek, Deep Dark Cosmic Atmosphere
    const ambientLight = new THREE.AmbientLight(0xc084fc, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(2, 4, 5);
    scene.add(dirLight);

    // Deep, focused violet core light creating high-contrast dark ambiance
    const centerPointLight = new THREE.PointLight(0xa855f7, 4.5, 12);
    centerPointLight.position.set(0, 0, 1.5);
    scene.add(centerPointLight);

    const violetCoreLight = new THREE.PointLight(0x7e22ce, 6.0, 20);
    violetCoreLight.position.set(0, 0, -0.5);
    scene.add(violetCoreLight);

    // 3. Create Offscreen Canvas for "SHAFI" Cinzel Typography Texture
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 1024;
    textCanvas.height = 512;
    const ctx = textCanvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 1024, 512);

      // Render "SHAFI" with warm gold (#ECCFA3) Cinzel serif font & glow
      ctx.font = '700 170px "Cinzel", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.shadowColor = 'rgba(236, 207, 163, 0.6)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#ECCFA3';
      ctx.fillText('SHAFI', 512, 256);
    }

    // Sample pixel data from text canvas to build 3D Gommage Text Geometry
    const imgData = ctx ? ctx.getImageData(0, 0, 1024, 512) : null;
    const textParticlePositions: number[] = [];
    const textParticleOriginals: number[] = [];
    const textVelocities: number[] = [];

    if (imgData) {
      const step = 4;
      for (let y = 0; y < 512; y += step) {
        for (let x = 0; x < 1024; x += step) {
          const idx = (y * 1024 + x) * 4;
          const r = imgData.data[idx];
          const g = imgData.data[idx + 1];
          const b = imgData.data[idx + 2];
          const a = imgData.data[idx + 3];

          if (a > 50 && (r > 150 || g > 150)) {
            const posX = (x / 1024 - 0.5) * 4.4;
            const posY = -(y / 512 - 0.5) * 2.2;
            const posZ = (Math.random() - 0.5) * 0.05;

            textParticlePositions.push(posX, posY, posZ);
            textParticleOriginals.push(posX, posY, posZ);

            textVelocities.push(
              (Math.random() - 0.8) * 2.2,
              (Math.random() - 0.5) * 1.5 + 0.5,
              (Math.random() - 0.5) * 2.0
            );
          }
        }
      }
    }

    // 4. Create 3D Gommage Text Particles
    const textCount = textParticlePositions.length / 3;
    const textGeo = new THREE.BufferGeometry();
    const textPosAttr = new Float32Array(textParticlePositions);
    textGeo.setAttribute('position', new THREE.BufferAttribute(textPosAttr, 3));

    const textMat = new THREE.PointsMaterial({
      color: 0xeccfa3, // Warm beige gold #ECCFA3
      size: 0.035,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const textMesh = new THREE.Points(textGeo, textMat);
    scene.add(textMesh);

    // 5. Build Instanced 3D Violet & White Petal Mesh Engine (Website Theme Colors)
    const PETAL_COUNT = 320;
    const petalMeshGroup = new THREE.Group();
    scene.add(petalMeshGroup);

    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.quadraticCurveTo(0.25, 0.4, 0, 0.7);
    petalShape.quadraticCurveTo(-0.25, 0.4, 0, 0);

    const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.03,
      bevelThickness: 0.02,
    });
    petalGeo.scale(0.3, 0.3, 0.3);

    // Theme Violet Petal Material (#A855F7 / #7E22CE)
    const violetPetalMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, // Website Theme Cosmic Violet
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.4,
      side: THREE.DoubleSide,
    });

    // Theme White Petal Material (#FFFFFF)
    const whitePetalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // Crisp White Petal
      roughness: 0.1,
      metalness: 0.2,
      emissive: 0x555555,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
    });

    // Load actual GLTF Petal model if available
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('./models/petal.glb', (gltf) => {
      const loadedMesh = gltf.scene.children[0] as THREE.Mesh;
      if (loadedMesh && loadedMesh.geometry) {
        loadedMesh.geometry.scale(0.12, 0.12, 0.12);
      }
    });

    const petalsData: {
      mesh: THREE.Mesh;
      origPos: THREE.Vector3;
      velocity: THREE.Vector3;
      rotSpeed: THREE.Vector3;
      spawnDelay: number;
    }[] = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      const isWhite = i % 4 === 0; // 25% white petals, 75% violet petals
      const mesh = new THREE.Mesh(petalGeo, isWhite ? whitePetalMat : violetPetalMat);

      const spawnX = (Math.random() - 0.5) * 4.5;
      const spawnY = (Math.random() - 0.5) * 1.5;
      const spawnZ = (Math.random() - 0.5) * 1.0;

      mesh.position.set(spawnX, spawnY, spawnZ);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.scale.setScalar(0.001);

      petalMeshGroup.add(mesh);

      petalsData.push({
        mesh,
        origPos: new THREE.Vector3(spawnX, spawnY, spawnZ),
        velocity: new THREE.Vector3(
          -Math.random() * 0.8 - 0.3,
          Math.random() * 0.6 - 0.2,
          (Math.random() - 0.5) * 0.8
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ),
        spawnDelay: (spawnX + 2.25) / 4.5 * 0.6,
      });
    }

    // 6. White Dust Particles
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 6;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // 7. Gommage Dissolve Animation RAF Loop (1.8 Seconds)
    let animId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      animId = requestAnimationFrame(animate);
      const elapsed = (currentTime - startTime) / 1000;
      
      // Smooth 4.5-Second Pacing
      // 0.0s - 1.0s: "SHAFI" appears solid & clear with gentle zero-g breathing wave
      // 1.0s - 3.8s: Left-to-right Gommage dissolve wave & 3D Violet/White Petal burst
      // 3.8s - 4.5s: Gentle fade transition into Hero section
      
      const dissolveProgress = Math.max(0, Math.min((elapsed - 1.0) / 2.8, 1.0));

      // A) Animate "SHAFI" Text Dissolve
      const positions = textMesh.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < textCount; i++) {
        const origX = textParticleOriginals[i * 3];
        const origY = textParticleOriginals[i * 3 + 1];
        const origZ = textParticleOriginals[i * 3 + 2];

        const vx = textVelocities[i * 3];
        const vy = textVelocities[i * 3 + 1];
        const vz = textVelocities[i * 3 + 2];

        const sweepFactor = (origX + 2.2) / 4.4; // 0 to 1

        if (dissolveProgress > sweepFactor * 0.5) {
          const delta = (dissolveProgress - sweepFactor * 0.5) * 2.2;
          positions[i * 3] = origX + vx * delta;
          positions[i * 3 + 1] = origY + vy * delta;
          positions[i * 3 + 2] = origZ + vz * delta;
        } else {
          positions[i * 3 + 1] = origY + Math.sin(elapsed * 2.5 + origX) * 0.012;
        }
      }
      textMesh.geometry.attributes.position.needsUpdate = true;

      // Text opacity fade out near end of dissolve
      if (dissolveProgress > 0.6) {
        textMat.opacity = Math.max(0, 1 - (dissolveProgress - 0.6) / 0.4);
      }

      // B) Animate 3D Violet & White Petals Swirling
      for (let i = 0; i < PETAL_COUNT; i++) {
        const data = petalsData[i];
        if (dissolveProgress > data.spawnDelay) {
          const pFactor = (dissolveProgress - data.spawnDelay) * 1.5;

          const currentScale = Math.min(pFactor * 0.85, 1.0) * (i % 2 === 0 ? 1.0 : 0.75);
          data.mesh.scale.setScalar(currentScale);

          data.mesh.position.x = data.origPos.x + data.velocity.x * pFactor;
          data.mesh.position.y = data.origPos.y + data.velocity.y * pFactor;
          data.mesh.position.z = data.origPos.z + data.velocity.z * pFactor;

          data.mesh.rotation.x += data.rotSpeed.x * 0.012;
          data.mesh.rotation.y += data.rotSpeed.y * 0.012;
          data.mesh.rotation.z += data.rotSpeed.z * 0.012;
        }
      }

      // C) Animate Dust Drift
      dustMesh.rotation.y = elapsed * 0.15;
      dustMesh.rotation.x = elapsed * 0.08;

      renderer.render(scene, camera);

      // Finish at exactly 4.5 seconds for complete visual enjoyment
      if (elapsed >= 4.5) {
        cancelAnimationFrame(animId);
        setIsDone(true);
        onComplete();
      }
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      textGeo.dispose();
      textMat.dispose();
      petalGeo.dispose();
      violetPetalMat.dispose();
      whitePetalMat.dispose();
      textCanvas.remove();
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-[radial-gradient(ellipse_at_50%_50%,_#4c1d95_0%,_#2e1065_25%,_#150730_50%,_#070212_75%,_#020105_100%)] overflow-hidden select-none cursor-pointer"
          onClick={() => {
            setIsDone(true);
            onComplete();
          }}
        >
          {/* Center WebGL 3D Gommage Canvas Viewport (Clean, 0 Text Overlays) */}
          <div ref={mountRef} className="absolute inset-0 size-full pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
