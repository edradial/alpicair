import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { CONTACT, HOME, LOGO, PRODUCTS, type WallProduct } from "./products";

/*
 * AlpicAir showroom wall: six wall-mounted indoor units hang on a deep night-blue
 * wall, each under its own floating picture light, with a slow stream of air
 * leaving the louvre. Choosing one zooms the wall in on it (desktop) or opens a
 * full-screen sheet (phone) with specs per model.
 *
 * Desktop: the wall has a fixed logical size and is scaled to the screen, so the
 * zoom is one transform. Phone: the same units stack in a vertical gallery.
 */

const W = 1440; // logical wall size
const H = 920;
const COL_X = [300, 720, 1140]; // centre of each column
const LIGHT_Y = [236, 560]; // picture light of each row
const SLOT_W = 400;
const SLOT_H = 300;
const UNIT_TOP = 66; // unit top inside the slot
const UNIT_MAX_W = 340;
const UNIT_MAX_H = 108;
const FJORD_RATIO = 3.2;

const ORDER = PRODUCTS.map((p) => p.id);
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p])) as Record<string, WallProduct>;

function ratio(p: WallProduct) {
  return p.size ? p.size[0] / p.size[1] : FJORD_RATIO;
}
function unitSize(p: WallProduct) {
  const r = ratio(p);
  const w = Math.min(UNIT_MAX_W, UNIT_MAX_H * r);
  return { w, h: w / r };
}
function slotPos(id: string) {
  const i = ORDER.indexOf(id);
  const cx = COL_X[i % 3]!;
  const ly = LIGHT_Y[Math.floor(i / 3)]!;
  return { x: cx - SLOT_W / 2, y: ly - 10, cx, ly };
}
const pad = (n: number) => String(n).padStart(2, "0");
const fullName = (p: WallProduct) => `${p.name}${p.finish ? ` ${p.finish}` : ""}`;

function useStageSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/* the indoor unit itself: its photo, or a glass silhouette while it has none */
function Unit({ p, className = "" }: { p: WallProduct; className?: string }) {
  const style: CSSProperties = { aspectRatio: String(ratio(p)) };
  if (!p.img) {
    return (
      <span className={`alp-unit alp-unit-ghost ${className}`} style={style} aria-hidden="true">
        <span className="alp-ghost-brand">AlpicAir</span>
        <span className="alp-ghost-louvre" />
      </span>
    );
  }
  return (
    <span className={`alp-unit ${p.dark ? "is-dark" : ""} ${className}`} style={style} aria-hidden="true">
      <img src={p.img} alt="" width={p.size?.[0]} height={p.size?.[1]} decoding="async" draggable={false} />
    </span>
  );
}

/* air leaving the louvre: soft plume plus a few streamlines */
function Air() {
  return (
    <span className="alp-air" aria-hidden="true">
      <span className="alp-air-plume" />
      <svg viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id="alp-air-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e3d9ff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e3d9ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M18 0 C 16 20, 8 38, 2 60" />
        <path d="M34 0 C 33 22, 28 40, 24 60" />
        <path d="M50 0 C 50 22, 50 40, 50 60" />
        <path d="M66 0 C 67 22, 72 40, 76 60" />
        <path d="M82 0 C 84 20, 92 38, 98 60" />
      </svg>
    </span>
  );
}

function Slot({
  p,
  active,
  dimmed,
  onOpen,
  tabbable,
  placed,
}: {
  p: WallProduct;
  active: boolean;
  dimmed: boolean;
  onOpen: () => void;
  tabbable: boolean;
  placed: boolean;
}) {
  const { x, y } = slotPos(p.id);
  const { w, h } = unitSize(p);
  const figures = p.upcoming ? "Drīzumā" : p.highlights.slice(0, 2).map(([v, l]) => `${l} ${v}`).join("  ·  ");
  return (
    <button
      type="button"
      onClick={onOpen}
      data-id={p.id}
      tabIndex={tabbable ? 0 : -1}
      aria-label={`${fullName(p)} — ${p.upcoming ? "drīzumā" : p.kicker}`}
      className={`alp-slot ${active ? "is-active" : ""} ${dimmed ? "is-dimmed" : ""} ${p.upcoming ? "is-upcoming" : ""}`}
      style={
        placed
          ? ({ left: x, top: y, width: SLOT_W, height: SLOT_H, "--unit-w": `${w}px`, "--unit-h": `${h}px` } as CSSProperties)
          : ({ "--unit-w": `${w}px`, "--unit-h": `${h}px` } as CSSProperties)
      }
    >
      <span className="alp-wash" aria-hidden="true" />
      <span className="alp-lamp" aria-hidden="true" />
      <span className="alp-hang">
        <Unit p={p} />
        {p.upcoming ? null : <Air />}
      </span>
      <span className="alp-label">
        <span className="alp-label-name">
          {p.name}
          {p.finish ? <em> {p.finish}</em> : null}
        </span>
        <span className="alp-label-figs">{figures}</span>
      </span>
    </button>
  );
}

function Detail({
  p,
  index,
  onClose,
  onStep,
  mobile,
}: {
  p: WallProduct;
  index: number;
  onClose: () => void;
  onStep: (d: number) => void;
  mobile: boolean;
}) {
  const [vi, setVi] = useState(0);
  useEffect(() => setVi(0), [p.id]);
  const variant = p.variants[Math.min(vi, p.variants.length - 1)];
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [p.id]);
  const count = `${pad(index + 1)} / ${pad(ORDER.length)}`;

  return (
    <div className={mobile ? "alp-sheet" : "alp-detail"} role="dialog" aria-modal="true" aria-labelledby="alp-detail-title">
      {mobile ? (
        <div
          className={`alp-sheet-stage ${p.upcoming ? "is-upcoming" : ""}`}
          style={{ "--unit-w": `${unitSize(p).w}px` } as CSSProperties}
          aria-hidden="true"
        >
          <span className="alp-wash" />
          <span className="alp-lamp" />
          <span className="alp-hang">
            <Unit p={p} />
            {p.upcoming ? null : <Air />}
          </span>
        </div>
      ) : null}

      <div className="alp-detail-head">
        <button type="button" className="alp-back" onClick={onClose}>
          {mobile ? <X className="h-4 w-4" aria-hidden="true" /> : <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
          {mobile ? "Aizvērt" : "Visa siena"}
        </button>
        <p className="alp-kicker">
          {count} · {p.kicker}
        </p>
        <h2 id="alp-detail-title" ref={headingRef} tabIndex={-1} className="alp-name">
          {p.name}
          {p.finish ? <span className="alp-finish">{p.finish}</span> : null}
        </h2>
        <p className="alp-desc">{p.desc}</p>
      </div>

      <aside className="alp-panel" aria-label="Tehniskie dati">
        {p.highlights.length ? (
          <dl className="alp-highlights">
            {p.highlights.map(([v, l]) => (
              <div key={l}>
                <dt>{l}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="alp-soon">
            <span>Drīzumā</span>
            Fjord sērijas dati vēl nav publicēti. Atstājiet pieprasījumu — pastāstīsim pirmie, kad sērija būs pieejama.
          </p>
        )}

        {p.variants.length > 1 ? (
          <div className="alp-variants" role="radiogroup" aria-label="Jauda">
            {p.variants.map((v, i) => (
              <button
                key={v.code}
                type="button"
                role="radio"
                aria-checked={i === vi}
                className={i === vi ? "is-on" : ""}
                onClick={() => setVi(i)}
              >
                {v.label}
              </button>
            ))}
          </div>
        ) : null}

        {variant ? (
          <>
            <p className="alp-code">{variant.code}</p>
            <dl className="alp-specs">
              {variant.specs.map(([l, v]) => (
                <div key={l}>
                  <dt>{l}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}

        <div className="alp-cta">
          <a href={CONTACT} target="_blank" rel="noopener noreferrer" className="alp-btn">
            Pieprasīt piedāvājumu
          </a>
          {p.url ? (
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="alp-link">
              Pilni dati alpicair.com <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </aside>

      <nav className="alp-steps" aria-label="Citas iekārtas">
        <button type="button" onClick={() => onStep(-1)} aria-label="Iepriekšējā iekārta">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="alp-steps-count">{count}</span>
        <button type="button" onClick={() => onStep(1)} aria-label="Nākamā iekārta">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}

/* slow drifting motes over the whole stage, like dust caught in the light */
function Motes() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.4,
      a: 0.08 + Math.random() * 0.3,
      v: 0.004 + Math.random() * 0.012,
      ph: Math.random() * Math.PI * 2,
    }));
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const x = (m.x + Math.sin(t * 0.00018 + m.ph) * 0.012) * w;
        const y = m.y * h;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.0012 + m.ph);
        ctx.beginPath();
        ctx.fillStyle = `rgba(222, 210, 255, ${m.a * tw})`;
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000));
      last = t;
      for (const m of motes) {
        m.y -= m.v * dt;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (still) draw(0);
    else raf = requestAnimationFrame(tick);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return <canvas ref={ref} className="alp-motes" aria-hidden="true" />;
}

export function AlpicAirWall() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const { w: sw, h: sh } = useStageSize(stageRef);
  const [openId, setOpenId] = useState<string | null>(null);
  const lastSlot = useRef<string | null>(null);
  const mobile = sw > 0 && sw < 900;

  const open = useCallback((id: string) => {
    lastSlot.current = id;
    setOpenId(id);
  }, []);
  const close = useCallback(() => setOpenId(null), []);
  const step = useCallback(
    (d: number) =>
      setOpenId((cur) => {
        const i = cur ? ORDER.indexOf(cur) : 0;
        const next = ORDER[(i + d + ORDER.length) % ORDER.length]!;
        lastSlot.current = next;
        return next;
      }),
    [],
  );

  // keyboard: Esc closes, arrows move between products
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId, close, step]);

  // return focus to the product on the wall after closing
  useEffect(() => {
    if (openId || !lastSlot.current) return;
    const el = document.querySelector<HTMLButtonElement>(`button[data-id="${lastSlot.current}"]`);
    el?.focus({ preventScroll: true });
  }, [openId]);

  // overview fits the whole wall; zoom centres the chosen unit between the text and the panel
  const transform = useMemo(() => {
    if (!sw || !sh || mobile) return null;
    const fit = Math.min(sw / W, sh / H);
    if (!openId) return { s: fit, x: (sw - W * fit) / 2, y: (sh - H * fit) / 2 };
    const { cx, y } = slotPos(openId);
    const { w, h } = unitSize(byId[openId]!);
    const s = Math.min(2.1, Math.max(1.2, Math.min((sw * 0.36) / w, (sh * 0.34) / h)));
    const uy = y + UNIT_TOP + h / 2;
    return { s, x: sw * 0.5 - s * cx, y: sh * 0.44 - s * uy };
  }, [sw, sh, openId, mobile]);

  const wallStyle: CSSProperties | undefined = transform
    ? { width: W, height: H, transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.s})` }
    : undefined;

  const index = openId ? ORDER.indexOf(openId) : -1;
  const product = openId ? byId[openId] : null;

  return (
    <div className="alp">
      <header className="alp-bar">
        <a href={HOME} target="_blank" rel="noopener noreferrer" className="alp-logo" aria-label="AlpicAir">
          <img src={LOGO} alt="AlpicAir" width={265} height={42} />
        </a>
        <nav className="alp-bar-nav" aria-label="AlpicAir">
          <a href={HOME} target="_blank" rel="noopener noreferrer">
            alpicair.com
          </a>
          <a href={CONTACT} target="_blank" rel="noopener noreferrer">
            Sazināties
          </a>
        </nav>
      </header>

      <div
        ref={stageRef}
        className={`alp-stage ${mobile ? "is-mobile" : ""} ${openId && !mobile ? "is-zoomed" : ""}`}
        style={{ visibility: sw ? undefined : "hidden" }}
      >
        <span className="alp-fog" aria-hidden="true" />
        <Motes />
        <div className="alp-wall" style={wallStyle} inert={openId && !mobile ? true : undefined}>
          <span className="alp-cove" aria-hidden="true" />
          <div className="alp-intro">
            <p className="alp-eyebrow">AlpicAir · Feel cool</p>
            <h1 className="alp-title">Gaiss, ko gribas apskatīt.</h1>
            <p className="alp-sub">Sešas sērijas vienā sienā. Izvēlieties iekārtu, lai to apskatītu tuvāk.</p>
          </div>
          {ORDER.map((id) => (
            <Slot
              key={id}
              p={byId[id]!}
              active={openId === id}
              dimmed={!!openId && openId !== id}
              onOpen={() => open(id)}
              tabbable={!openId}
              placed={!mobile}
            />
          ))}
          <span className="alp-floor" aria-hidden="true" />
        </div>
        {product ? <Detail p={product} index={index} onClose={close} onStep={step} mobile={mobile} /> : null}
      </div>
    </div>
  );
}
