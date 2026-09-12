import { Canvas, useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const assetPath = (path: string) => './' + (path.startsWith('/') ? path.slice(1) : path);

function StarField() {
  const positions = useMemo(() => {
    const values = new Float32Array(900 * 3);
    for (let i = 0; i < values.length; i += 3) {
      values[i] = (Math.random() - 0.5) * 70;
      values[i + 1] = Math.random() * 25 + 3;
      values[i + 2] = (Math.random() - 0.5) * 70;
    }
    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d7e9ff" size={0.07} sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

function GrassField() {
  const mesh = useMemo(() => {
    const count = 2400;
    const geometry = new THREE.PlaneGeometry(0.045, 0.8, 1, 1);
    geometry.translate(0, 0.4, 0);
    const material = new THREE.MeshStandardMaterial({ color: '#1b5364', roughness: 0.92, side: THREE.DoubleSide });
    const field = new THREE.InstancedMesh(geometry, material, count);
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    for (let i = 0; i < count; i += 1) {
      position.set((Math.random() - 0.5) * 58, 0, (Math.random() - 0.5) * 58);
      rotation.set(0, Math.random() * Math.PI, (Math.random() - 0.5) * 0.45);
      const height = 0.35 + Math.random() * 0.9;
      scale.set(0.7 + Math.random() * 0.7, height, 1);
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      field.setMatrixAt(i, matrix);
    }
    field.instanceMatrix.needsUpdate = true;
    return field;
  }, []);

  useFrame(({ clock }) => {
    mesh.rotation.z = Math.sin(clock.elapsedTime * 0.45) * 0.018;
  });

  return <primitive object={mesh} />;
}

function Explorer({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pressed = useRef(new Set<string>());
  const currentAction = useRef('Idle');
  const targetCamera = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const [astronaut, idle, walk, run, back] = useGLTF([
    assetPath('./models/Astronaut.glb'),
    assetPath('./models/Idle.glb'),
    assetPath('./models/Walking.glb'),
    assetPath('./models/Running.glb'),
    assetPath('./models/WalkingBack.glb'),
  ]) as any[];
  const character = useMemo(() => astronaut.scene.clone(true), [astronaut.scene]);
  const clips = useMemo(() => [
    Object.assign(idle.animations[0].clone(), { name: 'Idle' }),
    Object.assign(walk.animations[0].clone(), { name: 'Walk' }),
    Object.assign(run.animations[0].clone(), { name: 'Run' }),
    Object.assign(back.animations[0].clone(), { name: 'Back' }),
  ], [idle, walk, run, back]);
  const { actions } = useAnimations(clips, group);

  useEffect(() => {
    actions.Idle?.reset().fadeIn(0.2).play();
    const down = (event: KeyboardEvent) => pressed.current.add(event.code);
    const up = (event: KeyboardEvent) => pressed.current.delete(event.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [actions]);

  useFrame(({ camera }, delta) => {
    if (!group.current) return;
    const keys = pressed.current;
    const forward = keys.has('KeyW') || keys.has('ArrowUp');
    const backward = keys.has('KeyS') || keys.has('ArrowDown');
    const left = keys.has('KeyA') || keys.has('ArrowLeft');
    const right = keys.has('KeyD') || keys.has('ArrowRight');
    const running = keys.has('ShiftLeft') || keys.has('ShiftRight');
    const moving = active && (forward || backward);
    const desired = !moving ? 'Idle' : backward ? 'Back' : running ? 'Run' : 'Walk';

    if (desired !== currentAction.current) {
      actions[currentAction.current]?.fadeOut(0.16);
      actions[desired]?.reset().fadeIn(0.16).play();
      currentAction.current = desired;
    }

    if (active) {
      if (left) group.current.rotation.y += delta * 2.25;
      if (right) group.current.rotation.y -= delta * 2.25;
      if (moving) {
        const direction = new THREE.Vector3(0, 0, forward ? -1 : 1).applyQuaternion(group.current.quaternion);
        group.current.position.addScaledVector(direction, delta * (running ? 4.2 : 1.75));
      }
    }

    targetCamera.copy(group.current.position).add(new THREE.Vector3(5.8, 3.5, 7.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), group.current.rotation.y));
    camera.position.lerp(targetCamera, 1 - Math.pow(0.001, delta));
    lookAt.copy(group.current.position).add(new THREE.Vector3(0, 1.35, 0));
    camera.lookAt(lookAt);
  });

  return <group ref={group} position={[0, 0, 0]} scale={1.15} dispose={null}><primitive object={character} /></group>;
}

function World({ active }: { active: boolean }) {
  return (
    <>
      <color attach="background" args={['#0e0722']} />
      <fog attach="fog" args={['#0e0722', 10, 42]} />
      <ambientLight intensity={1.2} color="#bfa0ff" />
      <directionalLight position={[8, 13, 5]} intensity={4.0} color="#e9d5ff" />
      <pointLight position={[-8, 6, -9]} intensity={35} distance={35} color="#c084fc" />
      <StarField />
      <GrassField />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[64, 64, 1, 1]} />
        <meshStandardMaterial color="#1a0c36" roughness={0.8} />
      </mesh>
      <Suspense fallback={null}><Explorer active={active} /></Suspense>
    </>
  );
}

export function WebGLJourney() {
  const [started, setStarted] = useState(false);

  return (
    <main className="webgl-journey">
      <Canvas camera={{ position: [6, 4, 8], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <World active={started} />
      </Canvas>
      <header className="webgl-journey__header">
        <a href="/">SHAFI <span>/ JOURNEY</span></a>
        <span>False Earth / Live WebGL</span>
      </header>
      {!started && (
        <section className="webgl-journey__intro">
          <p className="webgl-journey__eyebrow">Journey / 01</p>
          <h1>Build. Explore. Refine.</h1>
          <p>My work moves between full-stack products, immersive visual systems, and cloud data engineering. Every project begins with curiosity and ends with a clearer experience.</p>
          <button onClick={() => setStarted(true)}>Enter my journey</button>
          <span>W / S move &nbsp; A / D turn &nbsp; Shift run</span>
        </section>
      )}
      {started && <div className="webgl-journey__hint">W / S move &nbsp; A / D turn &nbsp; Shift run</div>}
    </main>
  );
}
