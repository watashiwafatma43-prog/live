import { useEffect, useRef } from "react";

interface LampIntroProps {
  onDone: () => void;
}

export default function LampIntro({ onDone }: LampIntroProps) {
  const mainSceneRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<SVGSVGElement>(null);
  const cordRef = useRef<SVGPathElement>(null);
  const hitRef = useRef<SVGCircleElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const cord = cordRef.current!;
    const hit = hitRef.current!;
    const lampEl = lampRef.current!;
    const nextBtn = nextBtnRef.current!;
    const mainScene = mainSceneRef.current!;

    const AX = 124, AY = 190;
    const REST_X = 124, REST_Y = 348;
    const TRIGGER_DIST = 55;

    let dragging = false, animating = false, lightOn = false;
    let curX = REST_X, curY = REST_Y, clicked = false;

    function toSVG(sx: number, sy: number) {
      const ctm = lampEl.getScreenCTM();
      if (!ctm) return { x: REST_X, y: REST_Y };
      const pt = lampEl.createSVGPoint();
      pt.x = sx; pt.y = sy;
      return pt.matrixTransform(ctm.inverse());
    }

    function buildCord(tx: number, ty: number) {
      const dx = tx - AX, dy = ty - AY;
      const sag = Math.max(4, 30 - Math.hypot(dx, dy) * 0.06);
      const c1x = AX + dx * 0.15 + sag, c1y = AY + dy * 0.30 + sag;
      const c2x = AX + dx * 0.70 - sag * 0.3, c2y = AY + dy * 0.72 - sag * 0.2;
      return `M${AX},${AY} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`;
    }

    function updateCord(tx: number, ty: number) {
      curX = tx; curY = ty;
      cord.setAttribute('d', buildCord(tx, ty));
      const tension = Math.min(Math.hypot(tx - REST_X, ty - REST_Y) / 120, 1);
      cord.style.stroke = `hsl(45, 0%, ${Math.round(38 + tension * 52)}%)`;
    }

    function easeElastic(t: number) {
      if (!t || t === 1) return t;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
    }

    function easeOutBounce(t: number) {
      if (t < 1/2.75) return 7.5625*t*t;
      if (t < 2/2.75) { t -= 1.5/2.75; return 7.5625*t*t + 0.750; }
      if (t < 2.5/2.75) { t -= 2.25/2.75; return 7.5625*t*t + 0.9375; }
      t -= 2.625/2.75; return 7.5625*t*t + 0.984375;
    }

    function springBack(fromX: number, fromY: number, triggered: boolean) {
      if (animating) return;
      animating = true;
      const dur = triggered ? 380 : 500;
      const t0 = performance.now();
      function tick(now: number) {
        const t = Math.min((now - t0) / dur, 1);
        const fn = triggered ? easeElastic(t) : easeOutBounce(t);
        updateCord(fromX + (REST_X - fromX) * fn, fromY + (REST_Y - fromY) * fn);
        if (t < 1) { requestAnimationFrame(tick); return; }
        updateCord(REST_X, REST_Y);
        cord.style.stroke = '';
        animating = false;
      }
      requestAnimationFrame(tick);
    }

    function client(e: MouseEvent | TouchEvent) {
      if ('touches' in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function onDown(e: MouseEvent | TouchEvent) {
      if (animating || clicked) return;
      e.preventDefault();
      dragging = true;
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      e.preventDefault();
      const { x, y } = client(e);
      const sv = toSVG(x, y);
      updateCord(sv.x, Math.max(AY + 20, sv.y));
    }

    function onUp() {
      if (!dragging) return;
      dragging = false;
      const dist = Math.hypot(curX - REST_X, curY - REST_Y);
      if (dist > TRIGGER_DIST) toggleLight();
      springBack(curX, curY, dist > TRIGGER_DIST);
    }

    function toggleLight() {
      lightOn = !lightOn;
      root.style.setProperty('--on', lightOn ? '1' : '0');
      if (lightOn) {
        nextBtn.classList.add('lamp-show');
        if (hintRef.current) hintRef.current.classList.remove('lamp-hint-visible');
      }
      try {
        const sfx = new Audio('/click-sound.mp3');
        sfx.volume = 0.7;
        sfx.play().catch(() => {});
      } catch (_) {}
    }

    const hintTimer = setTimeout(() => {
      if (!lightOn && hintRef.current) {
        hintRef.current.classList.add('lamp-hint-visible');
      }
    }, 15000);

    [hit, cord].forEach(el => {
      el.addEventListener('mousedown', onDown as EventListener);
      el.addEventListener('touchstart', onDown as EventListener, { passive: false });
    });
    window.addEventListener('mousemove', onMove as EventListener);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove as EventListener, { passive: false });
    window.addEventListener('touchend', onUp);

    const handleNext = () => {
      clicked = true;
      nextBtn.classList.remove('lamp-show');
      mainScene.classList.add('lamp-changed');
      setTimeout(onDone, 1200);
    };
    nextBtn.addEventListener('click', handleNext);

    return () => {
      clearTimeout(hintTimer);
      [hit, cord].forEach(el => {
        el.removeEventListener('mousedown', onDown as EventListener);
        el.removeEventListener('touchstart', onDown as EventListener);
      });
      window.removeEventListener('mousemove', onMove as EventListener);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as EventListener);
      window.removeEventListener('touchend', onUp);
      nextBtn.removeEventListener('click', handleNext);
    };
  }, [onDone]);

  return (
    <>
      <style>{`
        .lamp-root {
          --on: 0;
          --opening: hsl(45, calc((10 + var(--on) * 70) * 1%), calc((18 + var(--on) * 68) * 1%));
          --base-top: hsl(45, calc((30 + var(--on) * 25) * 1%), calc((60 + var(--on) * 20) * 1%));
          --base-side: hsl(45, calc((30 + var(--on) * 25) * 1%), calc((50 + var(--on) * 15) * 1%));
          --post: hsl(45, calc((25 + var(--on) * 20) * 1%), calc((55 + var(--on) * 18) * 1%));
          --shade-l: hsl(45, calc((35 + var(--on) * 35) * 1%), calc((65 + var(--on) * 20) * 1%));
          --shade-m: hsl(45, calc((35 + var(--on) * 35) * 1%), calc((50 + var(--on) * 15) * 1%));
          --shade-d: hsl(45, calc((35 + var(--on) * 35) * 1%), calc((40 + var(--on) * 12) * 1%));
          --blend-a: hsla(45, calc((30 + var(--on) * 30) * 1%), calc((60 + var(--on) * 30) * 1%), 0.85);
          --blend-b: hsla(45, calc((30 + var(--on) * 30) * 1%), calc((45 + var(--on) * 20) * 1%), 0.25);
          --blend-c: hsla(45, calc((30 + var(--on) * 30) * 1%), calc((45 + var(--on) * 20) * 1%), 0.50);
          --glow-a: hsla(45, calc((40 + var(--on) * 40) * 1%), calc((65 + var(--on) * 25) * 1%), 0.85);
          --cord-l: calc((38 + var(--on) * 52) * 1%);
          --bg: #0a0a08;
          --acc: #ff9900;
          --tp: #ffffff;
          --tm: #cccccc;
        }
        .lamp-root::after {
          content: '';
          position: fixed; inset: 0;
          background: radial-gradient(ellipse 60% 70% at 40% 50%,
            rgba(255,180,60,calc(var(--on)*0.2)) 0%,
            rgba(200,120,40,calc(var(--on)*0.08)) 40%,
            transparent 70%);
          pointer-events: none; z-index: 5;
        }
        .lamp-main-scene {
          position: fixed; width: 100%; height: 100%; top: 0; left: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: row; gap: 20px; padding: 15px;
          background: var(--bg);
          transition: all 3s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 9999;
          font-family: 'Cairo', 'DM Sans', sans-serif;
        }
        .lamp-main-scene.lamp-changed { opacity: 0; pointer-events: none; }
        .lamp-svg {
          height: 30vmin; min-height: 180px; max-height: 280px;
          overflow: visible !important; flex-shrink: 0;
          transition: all 3s cubic-bezier(0.22, 1, 0.36, 1);
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.25));
        }
        .lamp-main-scene.lamp-changed .lamp-svg { opacity: 0; transform: translateX(200px) scale(0.7); }
        .lamp-cord { stroke: hsl(45,0%,var(--cord-l)); transition: stroke .1s; }
        .lamp-light { opacity: var(--on); }
        .lamp-fill-opening { fill: var(--opening); }
        .lamp-fill-base-top { fill: var(--base-top); }
        .lamp-fill-base-side { fill: var(--base-side); }
        .lamp-fill-post { fill: var(--post); }
        .lamp-fill-shade { fill: var(--shade-d); }
        .lamp-hit-circle { cursor: grab; fill: transparent; pointer-events: all; }
        .lamp-hit-circle:active { cursor: grabbing; }
        .lamp-text-container { max-width: 300px; text-align: center; padding: 15px; flex: 1; }
        .lamp-constant-text { font-size: clamp(0.75rem,2.5vw,0.9rem); color: var(--tp); margin-bottom: 12px; font-weight: 500; line-height: 1.4; }
        .lamp-variable-text { font-size: clamp(0.65rem,2vw,0.8rem); color: var(--tm); font-weight: 600; opacity: var(--on); transition: opacity 1.2s ease; line-height: 1.4; min-height: 1.4em; }
        .lamp-next-btn {
          position: absolute; bottom: 35px;
          background: var(--acc); color: white; border: none;
          padding: 10px 24px; font-size: 0.85rem; border-radius: 50px;
          cursor: pointer; display: flex; align-items: center; gap: 6px;
          font-weight: 600; transition: all 0.3s ease;
          opacity: 0; pointer-events: none; z-index: 50;
          font-family: 'Cairo', sans-serif;
        }
        .lamp-next-btn.lamp-show { opacity: 1; pointer-events: all; }
        .lamp-next-btn:hover { background: #ff8800; transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255,153,0,0.4); }
        .lamp-btn-arrow { width: 16px; height: 16px; animation: lampSlideArrow 1.5s ease-in-out infinite; }
        @keyframes lampSlideArrow {
          0%,20% { transform: translateX(0); } 50% { transform: translateX(3px); } 100% { transform: translateX(0); }
        }
        .lamp-hint {
          position: absolute; bottom: 90px;
          left: 50%; transform: translateX(-50%);
          display: flex; align-items: center; gap: 8px;
          color: #888; font-size: 0.8rem; font-weight: 600;
          font-family: 'Cairo', sans-serif;
          opacity: 0; pointer-events: none;
          transition: opacity 0.8s ease;
          white-space: nowrap;
        }
        .lamp-hint.lamp-hint-visible { opacity: 1; }
        .lamp-hint-icon {
          animation: lampHintPull 1.4s ease-in-out infinite;
          display: inline-block; font-size: 1rem;
        }
        @keyframes lampHintPull {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(5px); }
        }
      `}</style>

      <div ref={rootRef} className="lamp-root">
        <div className="lamp-main-scene" ref={mainSceneRef}>
          <svg ref={lampRef} className="lamp-svg" viewBox="0 0 333 484" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="lamp-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="3" dy="8" stdDeviation="4" floodOpacity="0.3"/>
              </filter>
            </defs>
            <ellipse className="lamp-fill-opening" cx="165" cy="220" rx="130" ry="20" />
            <ellipse cx="165" cy="220" rx="130" ry="20" fill="url(#grad-opening)" style={{opacity: 'calc(1 - var(--on))'}} />
            <path className="lamp-fill-base-side" d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" />
            <path d="M165 464c44.183 0 80-8.954 80-20v-14h-22.869c-14.519-3.703-34.752-6-57.131-6-22.379 0-42.612 2.297-57.131 6H85v14c0 11.046 35.817 20 80 20z" fill="url(#grad-side)" />
            <ellipse className="lamp-fill-base-top" cx="165" cy="430" rx="80" ry="20" />
            <ellipse cx="165" cy="430" rx="80" ry="20" fill="url(#grad-base)" />
            <path className="lamp-fill-post" d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" />
            <path d="M180 142h-30v286c0 3.866 6.716 7 15 7 8.284 0 15-3.134 15-7V142z" fill="url(#grad-post)" />
            <path ref={cordRef} className="lamp-cord" d="M124 190 L124 348" strokeWidth="6" strokeLinecap="round" />
            <path className="lamp-light" d="M290.5 193H39L0 463.5c0 11.046 75.478 20 165.5 20s167-11.954 167-23l-42-267.5z" fill="url(#grad-light)" />
            <path className="lamp-fill-shade" fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M164.859 0c55.229 0 100 8.954 100 20l29.859 199.06C291.529 208.451 234.609 200 164.859 200S38.189 208.451 35 219.06L64.859 20c0-11.046 44.772-20 100-20z" fill="url(#grad-shade)" />
            <linearGradient id="grad-opening" x1="35" y1="220" x2="295" y2="220" gradientUnits="userSpaceOnUse"><stop /><stop offset="1" stopOpacity="0" /></linearGradient>
            <linearGradient id="grad-base" x1="85" y1="444" x2="245" y2="444" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-a)" /><stop offset=".8" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
            <linearGradient id="grad-side" x1="119" y1="430" x2="245" y2="430" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-c)" /><stop offset="1" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
            <linearGradient id="grad-post" x1="150" y1="288" x2="180" y2="288" gradientUnits="userSpaceOnUse"><stop stopColor="var(--blend-a)" /><stop offset="1" stopColor="var(--blend-b)" stopOpacity="0" /></linearGradient>
            <linearGradient id="grad-light" x1="165.5" y1="218.5" x2="165.5" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="var(--glow-a)" stopOpacity=".10" /><stop offset="1" stopColor="var(--glow-a)" stopOpacity="0" /></linearGradient>
            <linearGradient id="grad-shade" x1="56" y1="110" x2="295" y2="110" gradientUnits="userSpaceOnUse"><stop stopColor="var(--shade-l)" stopOpacity=".8" /><stop offset="1" stopColor="var(--shade-m)" stopOpacity="0" /></linearGradient>
            <circle ref={hitRef} className="lamp-hit-circle" cx="124" cy="348" r="60" />
          </svg>

          <div className="lamp-text-container">
            <p className="lamp-constant-text">مناهجنا مكنتش للامتحان بس...<br/>في حاجات تهمنا مش بناخد بالنا منها</p>
            <p className="lamp-variable-text">لانها ما اتربطتش بالواقع من الاساس</p>
          </div>

          <button className="lamp-next-btn" ref={nextBtnRef}>
            <span>اضغط للمتابعة</span>
            <svg className="lamp-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <div className="lamp-hint" ref={hintRef}>
            <span>اسحب الشريط لتشغيل اللمبة</span>
          </div>
        </div>
      </div>
    </>
  );
}
