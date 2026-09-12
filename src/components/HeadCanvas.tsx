import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeadCanvasProps {
  progress: number; // 0 to 1
  isComplete: boolean;
  manager?: THREE.LoadingManager;
  onTextureLoaded?: () => void;
  className?: string;
  faceRef?: React.RefObject<HTMLDivElement | null>;
}

export const HeadCanvas: React.FC<HeadCanvasProps> = ({
  progress,
  isComplete,
  manager,
  onTextureLoaded,
  className = '',
  faceRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Texture Loader with LoadingManager
    const loader = manager ? new THREE.TextureLoader(manager) : new THREE.TextureLoader();
    const texture = loader.load('./avatar.png', () => {
      if (onTextureLoaded) onTextureLoaded();
    });
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Custom Shader Material for High-Tech Cinematic Shader
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: { value: texture },
        uProgress: { value: progress },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uProgress;
        uniform float uTime;

        void main() {
          vUv = uv;
          vPosition = position;
          vec3 pos = position;
          
          // Subtle breathing / micro-mesh oscillation
          float breathe = sin(uTime * 1.8) * 0.008;
          pos.z += breathe;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uProgress;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec4 color = texture2D(uTexture, vUv);
          if (color.a < 0.02) discard;

          gl_FragColor = color;
        }
      `,
    });
    materialRef.current = material;

    // Mesh setup
    const planeGeo = new THREE.PlaneGeometry(2.4, 2.4, 32, 32);
    const mesh = new THREE.Mesh(planeGeo, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Mouse Parallax Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      mousePos.current.targetX = (e.clientX / windowWidth - 0.5) * 0.2;
      mousePos.current.targetY = -(e.clientY / windowHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Idle Breathing Rotation
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth parallax mouse interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      if (mesh) {
        // Idle Y-axis slow breathing rotation (±3 degrees) + mouse tilt
        const idleRotY = Math.sin(elapsedTime * 1.2) * 0.05;
        mesh.rotation.y = mousePos.current.x + idleRotY;
        mesh.rotation.x = mousePos.current.y;
      }

      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = elapsedTime;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planeGeo.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [manager]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = isComplete ? 1.0 : progress;
    }
  }, [progress, isComplete]);

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        if (faceRef) {
          (faceRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      className={`relative w-full h-full flex justify-center items-center pointer-events-auto will-change-transform ${className}`}
    />
  );
};
