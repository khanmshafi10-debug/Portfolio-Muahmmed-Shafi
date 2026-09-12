/**
 * JourneyLabels — Movement-driven story cards
 *
 * DESKTOP: Cards on LEFT / RIGHT sides at mid-screen.
 *          Advance when player holds W for ~4.5s.
 *          ← → keyboard navigation.
 *
 * MOBILE:  Compact card at TOP of screen (avoids joystick at bottom).
 *          Auto-advances every 6s. Tap NEXT / dots to skip.
 *          Card height is capped so the 3D scene stays visible below.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../core/store/gameStore';

// ─── CV story cards ───────────────────────────────────────────────────────────

interface Card {
  id: string;
  icon: string;
  eyebrow: string;
  headline: string;
  body: string;
  tags?: string[];
  accent: string;
  side: 'left' | 'right';
}

const RAW = [
  { id:'intro',      icon:'👤', accent:'#A855F7', eyebrow:'WHO I AM',            headline:'SHAFI',                   body:'Software Engineer — full-stack apps, immersive WebGL worlds and cloud data pipelines.',                                          tags:['Full-Stack','3D / WebGL','Cloud'] },
  { id:'education',  icon:'🎓', accent:'#818CF8', eyebrow:'EDUCATION',            headline:'B.Sc. Computer Science',  body:'Air University Multan · CGPA 3.71 / 4.00 · Class of 2025.',                                                                    tags:['CGPA 3.71 / 4.00','Air University'] },
  { id:'frontend',   icon:'🖥️', accent:'#C084FC', eyebrow:'SKILLS · FRONTEND',   headline:'Modern Web Interfaces',   body:'React, Next.js 14, TypeScript and Tailwind — scroll-driven, animated and 3D-enhanced.',                                         tags:['React','Next.js 14','TypeScript','Tailwind'] },
  { id:'backend',    icon:'⚙️', accent:'#38BDF8', eyebrow:'SKILLS · BACKEND',    headline:'Scalable API Architecture',body:'Node.js, ASP.NET Core 8 (C#), Docker, JWT auth and MongoDB / SQL.',                                                           tags:['Node.js','ASP.NET Core 8','Docker'] },
  { id:'threed',     icon:'🌍', accent:'#34D399', eyebrow:'SKILLS · 3D',         headline:'WebGL & WebGPU Worlds',   body:'Three.js, React Three Fiber, WebGPU compute shaders, GLTF animation, WASM C++ engines.',                                       tags:['Three.js','WebGPU','React Three Fiber'] },
  { id:'cloud',      icon:'☁️', accent:'#60A5FA', eyebrow:'CLOUD & DATA',        headline:'Azure Data Engineer',     body:'Microsoft Certified. ETL pipelines, analytics — Azure Synapse, Data Factory, PySpark.',                                         tags:['Azure Data Factory','PySpark','Synapse'] },
  { id:'experience', icon:'💼', accent:'#F472B6', eyebrow:'EXPERIENCE',           headline:'SPS Engineering Residency',body:'Production-grade delivery at SPS — agile workflow, code review, quality standards.',                                           tags:['SPS Enterprise','Agile','Code Review'] },
  { id:'projects',   icon:'🚀', accent:'#FBBF24', eyebrow:'FEATURED PROJECTS',   headline:'What I Have Built',       body:'NEXUS 3D Simulator · Cashup Digital Wallet · Luxe Estate Platform · WASM C++ Engine.',                                          tags:['NEXUS 3D','Cashup Wallet','Luxe Estate'] },
  { id:'certs',      icon:'🏆', accent:'#A78BFA', eyebrow:'CERTIFICATIONS',      headline:'Certified & Validated',   body:'Microsoft Azure Data Engineer · Arch Tech Full-Stack Pro · Air University Academic Distinction.',                               tags:['Microsoft Certified','Arch Tech Pro'] },
  { id:'services',   icon:'🛠️', accent:'#2DD4BF', eyebrow:'WHAT I OFFER',       headline:'End-to-End Dev',          body:'Full-Stack Web Apps · 3D / WebGL · Cloud Data Pipelines · REST API Architecture.',                                             tags:['Web Apps','3D / WebGL','Pipelines'] },
  { id:'blog',       icon:'✍️', accent:'#FB923C', eyebrow:'FOUNDER & WRITER',    headline:'BlogWithShafi',           body:'Tech publication for Python, C++ and web dev. Organic readership via SEO and analytics.',                                       tags:['Technical Writing','SEO','Python & C++'] },
  { id:'cta',        icon:'🤝', accent:'#A855F7', eyebrow:"LET'S BUILD",         headline:'Ready to Create?',        body:"Walk through my world. Whether web apps, 3D or cloud — let's build something extraordinary.",                                    tags:['Open to Work','Remote & On-site'] },
] as const;

const CARDS: Card[] = RAW.map((c, i) => ({
  ...c,
  tags: c.tags ? Array.from(c.tags) : undefined,
  side: i % 2 === 0 ? 'left' : 'right'
} as Card));

const WALK_PER_CARD_MS = 4500;
const MOBILE_AUTO_MS   = 6000;
const ANIM_MS          = 400;

// ─── CSS (injected once) ──────────────────────────────────────────────────────

function ensureCSS() {
  const ID = 'jl4-css';
  if (document.getElementById(ID)) return;
  const s = document.createElement('style');
  s.id = ID;
  s.textContent = `
    @keyframes jl4-inL  { from{opacity:0;transform:translateX(-44px) scale(.96)} to{opacity:1;transform:none} }
    @keyframes jl4-inR  { from{opacity:0;transform:translateX( 44px) scale(.96)} to{opacity:1;transform:none} }
    @keyframes jl4-outL { from{opacity:1;transform:none} to{opacity:0;transform:translateX(-44px) scale(.96)} }
    @keyframes jl4-outR { from{opacity:1;transform:none} to{opacity:0;transform:translateX( 44px) scale(.96)} }
    @keyframes jl4-inT  { from{opacity:0;transform:translateY(-20px) scale(.96)} to{opacity:1;transform:none} }
    @keyframes jl4-outT { from{opacity:1;transform:none} to{opacity:0;transform:translateY(-20px) scale(.96)} }
    @keyframes jl4-walk { from{width:0%} to{width:100%} }
    .jl4-btn { transition: background .15s, border-color .15s, transform .15s, color .15s; }
    .jl4-btn:hover { transform: scale(1.06) !important; }
    .jl4-btn:active { transform: scale(.97) !important; }
    .jl4-dot { transition: all .32s cubic-bezier(.22,1,.36,1); border:none; padding:0; cursor:pointer; flex-shrink:0; }
    .jl4-dot:hover { transform: scale(1.5); }
  `;
  document.head.appendChild(s);
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────

function Pill({ label, ac }: { label: string; ac: string }) {
  return (
    <span style={{
      display:'inline-block', padding:'3px 10px', borderRadius:999,
      border:`1px solid ${ac}50`, background:`linear-gradient(135deg, ${ac}22 0%, ${ac}08 100%)`,
      color:ac, fontSize:'0.56rem', fontFamily:'Cousine,monospace',
      letterSpacing:'0.09em', fontWeight:700, whiteSpace:'nowrap', flexShrink:0,
      boxShadow:`0 2px 8px ${ac}15`,
    }}>{label}</span>
  );
}

// ─── Ambient HUD (top-left) ───────────────────────────────────────────────────

function AmbientHUD({ show }: { show: boolean }) {
  return (
    <div style={{
      position:'absolute', top:18, left:18, pointerEvents:'none',
      fontFamily:'Cousine,monospace', fontSize:'0.58rem',
      letterSpacing:'0.22em', textTransform:'uppercase',
      color:'#C084FC', fontWeight:800, lineHeight:1.7,
      opacity: show ? 1 : 0, transition:'opacity 1.2s ease',
      background:'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(12,8,26,0.75) 100%)',
      backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
      border:'1px solid rgba(168,85,247,0.35)',
      borderRadius:12, padding:'8px 16px',
      boxShadow:'0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.25)',
    }}>
      SHAFI / MY JOURNEY
      <br/>
      <span style={{ color:'rgba(226,232,240,0.65)', fontSize:'0.5rem', letterSpacing:'0.12em', fontWeight:500 }}>
        Walk Forward to Discover
      </span>
    </div>
  );
}

// ─── Walk hint (desktop only, bottom-center) ──────────────────────────────────

function WalkHint({ show }: { show: boolean }) {
  return (
    <div style={{
      position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)',
      fontFamily:'Cousine,monospace', fontSize:'0.54rem',
      letterSpacing:'0.2em', textTransform:'uppercase',
      color:'rgba(248,250,252,0.75)', pointerEvents:'none',
      opacity: show ? 1 : 0, transition:'opacity 1s ease 1.5s',
      whiteSpace:'nowrap',
      background:'rgba(12,8,26,0.7)',
      backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)',
      border:'1px solid rgba(168,85,247,0.3)',
      borderRadius:20, padding:'6px 18px',
      boxShadow:'0 6px 20px rgba(0,0,0,0.4), 0 0 15px rgba(168,85,247,0.2)',
    }}>
      [ W ] Walk forward to explore my story
    </div>
  );
}

// ─── Vertical chapter dots (desktop, outside the card) ────────────────────────

function ChapterBar({ total, current, ac, side }: { total:number; current:number; ac:string; side:'left'|'right' }) {
  return (
    <div style={{
      position:'absolute', top:'50%', transform:'translateY(-50%)',
      [side === 'left' ? 'right' : 'left']: -16,
      display:'flex', flexDirection:'column', gap:4, alignItems:'center',
    }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          width:3, height:i===current?16:4, borderRadius:2,
          background: i===current ? ac : i<current ? `${ac}50` : 'rgba(255,255,255,.1)',
          boxShadow: i===current ? `0 0 8px ${ac}` : 'none',
          transition:'all .4s cubic-bezier(.22,1,.36,1)',
        }}/>
      ))}
    </div>
  );
}

// ─── Desktop card ─────────────────────────────────────────────────────────────

function DesktopCard({ card, idx, total, walkPct, animPhase, onNext, onPrev }: {
  card:Card; idx:number; total:number; walkPct:number;
  animPhase:'enter'|'exit'|'idle'; onNext:()=>void; onPrev:()=>void;
}) {
  const { side, accent:ac } = card;
  const isLeft = side === 'left';
  const enterAnim = isLeft ? 'jl4-inL' : 'jl4-inR';
  const exitAnim  = isLeft ? 'jl4-outL' : 'jl4-outR';
  const anim = animPhase === 'enter' ? enterAnim : animPhase === 'exit' ? exitAnim : 'none';

  return (
    <div style={{
      position:'absolute',
      top:'50%', [isLeft?'left':'right']:28,
      transform:'translateY(-50%)',
      width:330, pointerEvents:'auto',
    }}>
      <div style={{ position:'relative' }}>
        <ChapterBar total={total} current={idx} ac={ac} side={side} />
        <div style={{
          background:'linear-gradient(145deg, rgba(16, 9, 36, 0.94) 0%, rgba(8, 4, 20, 0.96) 100%)',
          backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
          border:`1px solid ${ac}40`, borderRadius:16, overflow:'hidden',
          boxShadow:`0 24px 60px rgba(0,0,0,0.7), 0 0 35px ${ac}20, inset 0 1px 0 rgba(255,255,255,0.12)`,
          animationName: anim, animationDuration:`${ANIM_MS}ms`,
          animationTimingFunction: animPhase==='enter' ? 'cubic-bezier(.22,1,.36,1)' : 'cubic-bezier(.55,0,1,.45)',
          animationFillMode:'both',
        }}>
          {/* Walk progress bar */}
          <div style={{ position:'relative', height:3, background:`${ac}20` }}>
            <div style={{ position:'absolute', top:0, left:0, bottom:0, width:`${walkPct*100}%`, background:`linear-gradient(90deg,${ac}70,${ac})`, boxShadow:`0 0 8px ${ac}`, transition:'width .12s linear' }}/>
          </div>
          {/* Left accent strip */}
          <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, background:`linear-gradient(180deg,transparent,${ac},transparent)`, opacity:.85 }}/>

          <div style={{ padding:'20px 20px 18px 24px' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:12 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:`${ac}25`, border:`1px solid ${ac}50`, boxShadow:`0 0 12px ${ac}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem', flexShrink:0 }}>
                {card.icon}
              </div>
              <div style={{ fontFamily:'Cousine,monospace', fontSize:'0.56rem', letterSpacing:'0.18em', color:ac, fontWeight:800, textTransform:'uppercase', flex:1 }}>
                {card.eyebrow}
              </div>
              <span style={{ fontFamily:'Cousine,monospace', fontSize:'0.52rem', color:'rgba(226,232,240,0.6)', background:'rgba(255,255,255,.08)', borderRadius:6, padding:'3px 7px', border:'1px solid rgba(255,255,255,.12)' }}>
                {String(idx+1).padStart(2,'0')}&thinsp;/&thinsp;{total}
              </span>
            </div>

            {/* Headline */}
            <div style={{ fontFamily:'Cousine,monospace', fontWeight:900, fontSize:'1.35rem', lineHeight:1.12, letterSpacing:'-0.01em', marginBottom:10, whiteSpace:'pre-line', color:'#FFFFFF', textShadow:`0 0 20px ${ac}A0, 0 0 45px ${ac}40` }}>
              {card.headline}
            </div>
            <div style={{ height:1, marginBottom:12, background:`linear-gradient(90deg,${ac}60,rgba(255,255,255,.05) 70%,transparent)` }}/>
            <p style={{ fontFamily:'Cousine,monospace', fontSize:'0.66rem', color:'#CBD5E1', lineHeight:1.65, margin:'0 0 12px', letterSpacing:'0.02em' }}>
              {card.body}
            </p>

            {/* Tags */}
            {card.tags && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:16 }}>
                {card.tags.map(t => <Pill key={t} label={t} ac={ac}/>)}
              </div>
            )}

            {/* Nav */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button className="jl4-btn" onClick={onPrev} style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:8, color:'rgba(248,250,252,.75)', fontFamily:'Cousine,monospace', fontSize:'0.58rem', letterSpacing:'0.1em', padding:'6px 12px', cursor:'pointer', flexShrink:0 }}>← PREV</button>
              <div style={{ flex:1, display:'flex', gap:4, alignItems:'center', justifyContent:'center', flexWrap:'wrap' }}>
                {CARDS.map((c,i) => (
                  <div key={c.id} className="jl4-dot" style={{ width:i===idx?16:4, height:4, borderRadius:2, background:i===idx?ac:i<idx?`${ac}50`:'rgba(255,255,255,.15)', boxShadow:i===idx?`0 0 8px ${ac}`:'none' }}/>
                ))}
              </div>
              <button className="jl4-btn" onClick={onNext} style={{ background:`linear-gradient(135deg, ${ac}35 0%, ${ac}18 100%)`, border:`1px solid ${ac}60`, borderRadius:8, color:'#FFFFFF', fontFamily:'Cousine,monospace', fontSize:'0.58rem', letterSpacing:'0.1em', padding:'6px 12px', cursor:'pointer', fontWeight:800, flexShrink:0, boxShadow:`0 0 14px ${ac}35` }}>NEXT →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile card (compact, TOP-positioned) ────────────────────────────────────

function MobileCard({ card, idx, total: _total, animPhase, onNext, onPrev: _onPrev }: {
  card:Card; idx:number; total:number;
  animPhase:'enter'|'exit'|'idle'; onNext:()=>void; onPrev:()=>void;
}) {
  const { accent:ac } = card;
  // Slide in/out from right — card lives on the right side
  const anim = animPhase === 'enter' ? 'jl4-inR' : animPhase === 'exit' ? 'jl4-outR' : 'none';

  return (
    <div style={{
      position: 'absolute',
      // ── Bottom-RIGHT corner ──
      // Joystick lives at bottom-LEFT → right side is always safe.
      // Character is center → 180px right card leaves full center visible.
      bottom: 120,   // above the joystick touch area
      right: 14,
      width: 182,
      pointerEvents: 'auto',
      zIndex: 20,
    }}>
      <div style={{
        background: 'rgba(7,4,18,.93)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${ac}28`,
        borderRadius: 13,
        overflow: 'hidden',
        boxShadow: `0 12px 36px rgba(0,0,0,.6), 0 0 24px ${ac}10, inset 0 1px 0 rgba(255,255,255,.04)`,
        animationName: anim, animationDuration: `${ANIM_MS}ms`,
        animationTimingFunction: 'cubic-bezier(.22,1,.36,1)',
        animationFillMode: 'both',
      }}>

        {/* Auto-advance progress bar */}
        <div style={{ height: 2, background: `${ac}15`, position: 'relative' }}>
          <div key={idx} style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            background: `linear-gradient(90deg, ${ac}70, ${ac})`,
            boxShadow: `0 0 5px ${ac}`,
            animationName: 'jl4-walk',
            animationDuration: `${MOBILE_AUTO_MS}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
          }} />
        </div>

        {/* Left accent glow strip */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 3,
          background: `linear-gradient(180deg, transparent, ${ac}, transparent)`,
          opacity: .7,
        }} />

        <div style={{ padding: '10px 12px 11px 15px' }}>

          {/* Icon + eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: `${ac}18`, border: `1px solid ${ac}32`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div style={{
              fontFamily: 'Cousine,monospace', fontSize: '0.5rem',
              letterSpacing: '0.15em', color: ac, fontWeight: 700,
              textTransform: 'uppercase', flex: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {card.eyebrow}
            </div>
          </div>

          {/* Headline */}
          <div style={{
            fontFamily: 'Cousine,monospace', fontWeight: 900,
            fontSize: '1rem', lineHeight: 1.12,
            letterSpacing: '-0.01em', marginBottom: 10,
            color: '#FFFFFF',
            textShadow: `0 0 14px ${ac}88, 0 0 30px ${ac}25`,
            // Allow 2 lines max on mobile
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {card.headline}
          </div>

          {/* Divider */}
          <div style={{
            height: 1, marginBottom: 9,
            background: `linear-gradient(90deg, ${ac}40, transparent)`,
          }} />

          {/* Counter + Next row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            {/* Chapter dots — smaller on mobile */}
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flex: 1, overflow: 'hidden' }}>
              {CARDS.map((c, i) => (
                <div key={c.id} style={{
                  width: i === idx ? 12 : 3, height: 3, borderRadius: 2, flexShrink: 0,
                  background: i === idx ? ac : i < idx ? `${ac}45` : 'rgba(255,255,255,.1)',
                  boxShadow: i === idx ? `0 0 4px ${ac}` : 'none',
                  transition: 'all .32s cubic-bezier(.22,1,.36,1)',
                }} />
              ))}
            </div>

            {/* NEXT only — no PREV on mobile to save space */}
            <button
              className="jl4-btn"
              onClick={onNext}
              style={{
                background: `${ac}1e`, border: `1px solid ${ac}40`,
                borderRadius: 7, color: ac,
                fontFamily: 'Cousine,monospace', fontSize: '0.55rem',
                letterSpacing: '0.08em', padding: '5px 10px',
                cursor: 'pointer', fontWeight: 700, flexShrink: 0,
              }}
            >
              NEXT →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function JourneyLabels() {
  const isGameStarted = useGameStore(s => s.isGameStarted);
  const isMobile      = useGameStore(s => s.isMobile);

  const [show,    setShow]    = useState(false);
  const [idx,     setIdx]     = useState(0);
  const [anim,    setAnim]    = useState<'enter'|'exit'|'idle'>('idle');
  const [walkMs,  setWalkMs]  = useState(0);

  const wHeld     = useRef(false);
  const walkTimer = useRef<ReturnType<typeof setInterval>|null>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => { ensureCSS(); }, []);

  useEffect(() => {
    if (!isGameStarted) return;
    const t = setTimeout(() => setShow(true), 1600);
    return () => clearTimeout(t);
  }, [isGameStarted]);

  const navigate = useCallback((dir: 'f'|'b') => {
    setAnim('exit');
    setWalkMs(0);
    if (autoTimer.current) clearTimeout(autoTimer.current);
    setTimeout(() => {
      setIdx(prev => dir === 'f'
        ? (prev + 1) % CARDS.length
        : (prev - 1 + CARDS.length) % CARDS.length
      );
      setAnim('enter');
      setTimeout(() => setAnim('idle'), ANIM_MS + 60);
    }, ANIM_MS - 80);
  }, []);

  // Desktop: W-key walk tracking
  useEffect(() => {
    if (!isGameStarted || isMobile) return;
    const dn = (e: KeyboardEvent) => { if (e.code === 'KeyW' && !e.repeat) wHeld.current = true; };
    const up = (e: KeyboardEvent) => { if (e.code === 'KeyW') wHeld.current = false; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup',   up);
    walkTimer.current = setInterval(() => {
      if (!wHeld.current) return;
      setWalkMs(prev => {
        const next = prev + 80;
        if (next >= WALK_PER_CARD_MS) { setTimeout(() => navigate('f'), 0); return 0; }
        return next;
      });
    }, 80);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup',   up);
      if (walkTimer.current) clearInterval(walkTimer.current);
    };
  }, [isGameStarted, isMobile, navigate]);

  // Mobile: timer-based
  useEffect(() => {
    if (!isGameStarted || !isMobile || !show) return;
    autoTimer.current = setTimeout(() => navigate('f'), MOBILE_AUTO_MS);
    return () => { if (autoTimer.current) clearTimeout(autoTimer.current); };
  }, [isGameStarted, isMobile, show, idx, navigate]);

  // Keyboard arrows
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') navigate('f');
      else if (e.key === 'ArrowLeft') navigate('b');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [navigate]);

  if (!isGameStarted) return null;

  const walkPct = Math.min(walkMs / WALK_PER_CARD_MS, 1);

  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:8 }}>
      <AmbientHUD show={show}/>

      <div style={{ position:'absolute', inset:0, opacity:show?1:0, transition:'opacity .8s ease' }}>
        {show && (
          isMobile ? (
            <MobileCard
              card={CARDS[idx]} idx={idx} total={CARDS.length}
              animPhase={anim}
              onNext={() => navigate('f')}
              onPrev={() => navigate('b')}
            />
          ) : (
            <DesktopCard
              card={CARDS[idx]} idx={idx} total={CARDS.length}
              walkPct={walkPct} animPhase={anim}
              onNext={() => navigate('f')}
              onPrev={() => navigate('b')}
            />
          )
        )}
      </div>

      {!isMobile && <WalkHint show={show}/>}
    </div>
  );
}
