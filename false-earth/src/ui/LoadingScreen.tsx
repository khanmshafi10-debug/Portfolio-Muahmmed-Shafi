import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState, useMemo } from "react";
import { useGameStore } from "../core/store/gameStore";
import gsap from "gsap";

// --- Sub Components ---
const Key = ({ children }: { children: React.ReactNode }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: '18px', height: '22px', padding: '0 5px', margin: '0 4px',
        border: '1px solid rgba(168,85,247,0.4)', borderRadius: '4px',
        background: 'rgba(168,85,247,0.1)',
        fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 'bold',
        color: '#DDD6FE',
        lineHeight: 1, verticalAlign: 'middle', boxSizing: 'border-box'
    }}>
        {children}
    </span>
);

const MouseIcon = () => (
    <span style={{
        display: 'inline-block', position: 'relative', width: '12px', height: '18px', margin: '0 4px',
        border: '1.5px solid #DDD6FE', borderRadius: '6px', verticalAlign: 'middle', opacity: 0.8
    }}>
        <span style={{
            position: 'absolute', top: '3px', left: '50%', transform: 'translateX(-50%)',
            width: '1.5px', height: '4px', background: '#DDD6FE', borderRadius: '1px'
        }} />
    </span>
);

const InstructionRow = ({ input, label }: { input: React.ReactNode, label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {input}
        <span style={{ marginLeft: '6px', fontSize: '0.7rem', letterSpacing: '1px', fontWeight: 500, transform: 'translateY(1px)', color: '#94A3B8' }}>
            {label}
        </span>
    </div>
);

// --- Main Component ---

export function LoadingScreen() {
    // Store & Hooks
    const { active, progress: downloadProgress } = useProgress();
    const activeTargets = useGameStore((state) => state.activeTargets);
    const readyStatus = useGameStore((state) => state.readyStatus);
    const isMobile = useGameStore((state) => state.isMobile);
    const setIsGameStarted = useGameStore((state) => state.setIsGameStarted);
    const gpuError = useGameStore((state) => state.gpuError);

    // Local State
    const [isReadyToStart, setIsReadyToStart] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isLandscape, setIsLandscape] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);

    // Orientation detection
    useEffect(() => {
        const checkOrientation = () => {
            setIsLandscape(window.innerWidth > window.innerHeight);
        };
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        return () => window.removeEventListener('resize', checkOrientation);
    }, []);

    const total = activeTargets.length;
    const loaded = activeTargets.filter((id) => readyStatus[id]).length;
    const compileProgress = total === 0 ? 0 : (loaded / total) * 100;

    const displayProgress = useMemo(() => {
        if (active) return Math.round(downloadProgress * 0.5);
        return Math.min(Math.round(50 + compileProgress * 0.5), 99);
    }, [active, downloadProgress, compileProgress]);

    useEffect(() => {
        if (!active && loaded === total && total > 0) {
            const t = setTimeout(() => setIsReadyToStart(true), 200);
            return () => clearTimeout(t);
        }
    }, [active, loaded, total]);

    const handleStart = () => {
        if (!isReadyToStart || gpuError) return;
        setIsGameStarted(true);
        if (containerRef.current) {
            animationRef.current = gsap.to(containerRef.current, {
                opacity: 0,
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => setIsVisible(false)
            });
        }
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) animationRef.current.kill();
        };
    }, []);

    if (!isVisible) return null;

    // --- Dynamic Styles ---
    const isMobileLandscape = isMobile && isLandscape;

    const containerStyle: React.CSSProperties = {
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100dvh',
        // Matches main site: #18122B deep purple with radial centre glow
        background: 'radial-gradient(ellipse at 50% 35%, #1e0f3a 0%, #18122B 50%, #0E0A1B 100%)',
        zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: '#F8FAFC', fontFamily: 'Cousine',
        pointerEvents: 'auto',
        fontSize: isMobile ? '0.8rem' : '0.9rem',
        opacity: 0.99,
        overflow: 'hidden',
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
    };

    const entryContainerStyle: React.CSSProperties = {
        opacity: 1,
        maxWidth: isMobileLandscape ? '80%' : (isMobile ? '100%' : '600px'),
        padding: isMobileLandscape ? '20px' : '40px',
        animation: 'fadeIn 2s ease',
        display: 'flex',
        flexDirection: isMobileLandscape ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobileLandscape ? '40px' : '0px',
        height: isMobileLandscape ? '100%' : 'auto'
    };

    const playButtonStyle: React.CSSProperties = {
        color: gpuError ? '#f87171' : '#F8FAFC',
        backgroundColor: 'transparent',
        border: 'none',
        letterSpacing: '3px',
        transition: 'all 0.5s ease',
        transform: 'scale(1)',
        cursor: gpuError ? 'default' : (isReadyToStart ? 'pointer' : 'wait'),
        opacity: gpuError ? 0.8 : 1,
        whiteSpace: 'nowrap',
        animation: isReadyToStart ? 'breathe 2s infinite ease-in-out' : 'none',
        // Purple glow pulse when ready — matches site accent #A855F7
        textShadow: isReadyToStart ? '0 0 20px rgba(168,85,247,0.9), 0 0 40px rgba(168,85,247,0.4)' : 'none',
    };

    return (
        <div ref={containerRef} style={containerStyle}>

            {/* Subtle purple orb decoration — matches site's ambient glow */}
            <div style={{
                position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
                width: '600px', height: '300px',
                background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                borderRadius: '50%',
            }} />

            <div className='entry' style={entryContainerStyle}>

                {/* Left Side: Content Text */}
                <div style={{
                    flex: isMobileLandscape ? '1' : 'auto',
                    textAlign: isMobileLandscape ? 'left' : 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isMobileLandscape ? 'center' : 'flex-start'
                }}>
                    {/* Title — purple gradient shimmer matching .hero-heading-gradient */}
                    <div style={{
                        fontSize: '1rem', fontWeight: 'bold',
                        letterSpacing: isMobile ? '0.3rem' : '0.5rem',
                        marginBottom: isMobileLandscape ? '1rem' : '2rem',
                        background: 'linear-gradient(135deg, #A855F7 0%, #C084FC 45%, #F8FAFC 70%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 0 14px rgba(168,85,247,0.55))',
                    }}>
                        SHAFI / MY JOURNEY
                    </div>

                    {/* Intro Text */}
                    <div style={{
                        textAlign: 'left',
                        display: 'inline-block',
                        lineHeight: '1.6', color: '#94A3B8',
                        marginBottom: isMobileLandscape ? '0' : '3rem',
                        fontSize: isMobileLandscape ? '0.75rem' : 'inherit',
                    }}>
                        <p>
                            Software Engineer · B.Sc. CS (CGPA 3.71/4.00) · Microsoft Azure Data Engineer.
                            I build full-stack web apps, immersive WebGL worlds, and cloud data pipelines.
                        </p>

                        <p>
                            Walk through this field to explore who I am — my skills, experience, certifications
                            and projects will reveal themselves as you move forward through my journey.
                        </p>
                    </div>
                </div>

                {/* Right Side: Interaction Area */}
                <div style={{
                    flex: isMobileLandscape ? '0.8' : 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: isMobileLandscape ? '200px' : 'auto'
                }}>
                    {/* Play Button & Progress Bar */}
                    <div className='play'>
                        <button
                            onClick={handleStart}
                            disabled={!isReadyToStart || !!gpuError}
                            style={playButtonStyle}
                            onMouseEnter={(e) => (isReadyToStart && !gpuError) && (e.currentTarget.style.transform = 'scale(1.04)')}
                            onMouseLeave={(e) => (isReadyToStart && !gpuError) && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {gpuError ? (
                                <span style={{ letterSpacing: '2px', color: '#f87171' }}>SYSTEM INCOMPATIBLE</span>
                            ) : isReadyToStart ? (
                                "[ START ]"
                            ) : (
                                <span>
                                    {active ? "LOADING" : "CALIBRATING"}... {displayProgress}%
                                </span>
                            )}
                        </button>

                        {/* Progress bar — purple accent */}
                        <div style={{
                            width: '100%', maxWidth: '250px', height: '1px',
                            background: 'rgba(168,85,247,0.15)',
                            margin: '10px auto',
                            opacity: (isReadyToStart || gpuError) ? 0 : 1, transition: 'opacity 0.5s'
                        }}>
                            <div style={{
                                width: `${displayProgress}%`, height: '100%',
                                background: 'linear-gradient(90deg, #7C3AED, #A855F7, #C084FC)',
                                transition: 'width 0.3s ease',
                                boxShadow: '0 0 8px rgba(168,85,247,0.7)'
                            }} />
                        </div>
                    </div>

                    {/* Bottom Area: Controls */}
                    <div style={{
                        marginTop: isMobileLandscape ? '15px' : '40px',
                        color: '#94A3B8', opacity: 0.75, animation: 'fadeIn 3s ease',
                        userSelect: 'none', display: 'flex', justifyContent: 'center', gap: '24px',
                        flexDirection: 'row',
                    }}>
                        {gpuError ? (
                            <div style={{ fontSize: '0.8rem', maxWidth: '400px', lineHeight: '1.4', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.7rem', color: '#f87171' }}>ERROR CODE: {gpuError}</p>
                            </div>
                        ) : (
                            isMobile ? (
                                <>
                                    <InstructionRow input={<Key>L-STICK</Key>} label="MOVE" />
                                    <InstructionRow input={<Key>TOUCH</Key>} label="LOOK" />
                                </>
                            ) : (
                                <>
                                    <InstructionRow input={<><Key>W</Key><Key>A</Key><Key>S</Key><Key>D</Key></>} label="MOVE" />
                                    <InstructionRow input={<Key>SHIFT</Key>} label="RUN" />
                                    <InstructionRow input={<Key>C</Key>} label="CAM" />
                                    <InstructionRow input={<MouseIcon />} label="LOOK" />
                                </>
                            )
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
