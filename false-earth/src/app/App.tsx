import { Environment, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { LevaWrapper, KeyboardMapper, KTX2Preloader, preloadVATAssets } from "@core";
import { Canvas } from "@react-three/fiber";
import { useEffect, Suspense, useMemo, useState } from "react";
import { DirectionalLight } from "../components/DirectionalLight";
import { WebGPURenderer } from "three/webgpu";
import Effects from "../components/Effects/Effects";
import { useGameStore } from "../core/store/gameStore";
import { CameraViewControl } from "../components/camera/CameraViewControl";
import { DeviceDetector } from "../core/utils/DeviceDetector";
import { UI } from "../ui/UI";
import { WorldController } from "../components/WorldController";
import { createContext } from "react";
import * as THREE from "three/webgpu";
import { input, keyBindings } from "../core/input/controls";
import { useShortcut } from "@core/hooks/useShortcut";
import { ROSE_TEXTURES } from "../components/Rose/core/config";
import { BODY_TEXTURE_PATHS, DETAIL_TEXTURE_PATHS, MODEL_PATHS } from '../components/character/config';
import { WebGLJourney } from './WebGLJourney';

useGLTF.preload(MODEL_PATHS);

preloadVATAssets('./vat/Rose_meta.json');
preloadVATAssets('./vat/RoseLowPoly_meta.json');

export const BeamSceneContext = createContext<THREE.Scene | null>(null);

export default function App() {
    const beamScene = useMemo(() => new THREE.Scene(), []);
    // Start at 1.0 DPR — PerformanceMonitor raises if GPU can handle more
    const [dpr, setDpr] = useState(1.0);
    const hasWebGPU = typeof navigator !== 'undefined' && !!navigator.gpu;
    const forceWebGL = new URLSearchParams(window.location.search).get('renderer') === 'webgl';

    const toggleCameraMode = useGameStore((state) => state.toggleCameraMode);
    const setGpuError = useGameStore((state) => state.setGpuError);
    const gpuError = useGameStore((state) => state.gpuError);

    // Check WebGPU support on mount
    useEffect(() => {
        const checkWebGPU = async () => {
            if (!navigator.gpu) {
                setGpuError("WEBGPU NOT SUPPORTED");
                console.error("WebGPU is not supported in this browser");
                return;
            }
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) {
                    setGpuError("NO GPU ADAPTER FOUND");
                    console.error("No GPU adapter found");
                    return;
                }
                console.log('WebGPU initialized successfully');
                setGpuError(null);
            } catch (e) {
                setGpuError("GPU INIT FAILED");
                console.error("WebGPU initialization failed:", e);
            }
        };
        checkWebGPU();
    }, [setGpuError]);

    useShortcut('c', () => {
        toggleCameraMode();
    });

    if (forceWebGL || !hasWebGPU || gpuError) {
        return <WebGLJourney />;
    }

    return <>
        <LevaWrapper collapsed={true} initialHidden={true} />
        <DeviceDetector />
        <UI />
        <KeyboardMapper input={input} keyMap={keyBindings} />

        <Canvas
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 200,
                    position: [20, 20, 30]
                }}
                frameloop="always"
                gl={(canvas) => {
                    const renderer = new WebGPURenderer({
                        ...canvas as any,
                        powerPreference: "high-performance",
                        antialias: false, // disabled — SMAA handles AA at much lower cost
                        alpha: true,
                    });
                    renderer.setClearColor('#0B061A');
                    renderer.autoClear = true;
                    renderer.sortObjects = false;

                    return renderer.init().then(() => renderer);
                }}
                dpr={dpr}
            >
                <Suspense fallback={null}>
                    <KTX2Preloader paths={ROSE_TEXTURES} />
                    <KTX2Preloader paths={BODY_TEXTURE_PATHS} />
                    <KTX2Preloader paths={DETAIL_TEXTURE_PATHS} />
                </Suspense>

                <PerformanceMonitor
                    // 45–60fps target: gives room to hold HD DPR while staying smooth
                    bounds={() => [45, 60]}
                    flipflops={3}
                    factor={0.5}
                    onFallback={() => setDpr(1.0)}
                    onChange={({ factor }) => {
                        // DPR range: 1.0 (under load) → 2.0 (smooth HD) — full native resolution when GPU can handle it
                        const targetDpr = 1.0 + 1.0 * factor;
                        setDpr(Math.round(targetDpr * 4) / 4); // snap to 0.25 increments
                    }}
                />

                <BeamSceneContext.Provider value={beamScene}>
                    <WorldController />

                    <Suspense fallback={null}>
                        <color attach="background" args={['#0B061A']} />
                        <CameraViewControl />
                        <Environment
                            files="./textures/potsdamer_platz_1k_nb.hdr"
                            environmentIntensity={0.75}
                        />
                        <DirectionalLight />
                        <Effects />
                    </Suspense>
                </BeamSceneContext.Provider>
            </Canvas>
    </>;
}
