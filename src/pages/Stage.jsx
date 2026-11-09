import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/use-document-title';
import { useLanguage } from '../hooks/use-language';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { getActiveMenuId, menuItems, setActiveMenuId } from '../lib/atlus';
import { QUICK_PATH } from '../lib/sections';
import { portraits } from '../data/portraits';
import { featuredProjects } from '../data/featured-projects';
import IntroOverlay from '../components/stage/IntroOverlay';
import ContactList from '../three/bonfire/ContactList';
import { grainTexture } from '../lib/noise-textures';

const INTRO_KEY = 'seen-stage-intro';
const BOOT_MS = 800;
const SCENE_TIMEOUT_MS = 4000;
// Each slab has its own size and offset (design bible, Card 03).
const SLAB_SIZES = [1, 0.84, 1.12, 0.92, 1.04];
const SLAB_OFFSETS = [0, 1.1, 0.4, 1.6, 0.7];
const SCROLL_TARGETS = { work: 'arcana', contact: 'bonfire' };

const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === 'true';
  } catch {
    return true;
  }
};

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, 'true');
  } catch {
    // The intro simply plays again next load.
  }
};

export default function Stage() {
  useDocumentTitle('Richard Zuikov — Embedded Systems & Hardware Developer');
  const { language, t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const { hash } = useLocation();
  const [webgl, setWebgl] = useState(() => !reducedMotion && 'WebGL2RenderingContext' in window);
  const [phase, setPhase] = useState(() => (webgl && !introSeen() && !hash ? 'boot' : 'done'));
  const [active, setActive] = useState(getActiveMenuId);

  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const fireRef = useRef(null);
  const abyssRef = useRef(null);
  const slotRefs = useRef([]);
  const panelRefs = useRef([]);
  const linkRefs = useRef({});
  const sceneRef = useRef(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!webgl) return undefined;
    let cancelled = false;
    const playIntro = phaseRef.current === 'boot';

    // Context creation is expensive, so it gets its own task after the first paint.
    const scenePromise = Promise.all([import('../components/stage/scene'), delay(0)]).then(([{ createStage }]) => {
      if (cancelled) return null;
      const stage = createStage({
        canvas: canvasRef.current,
        projects: featuredProjects,
        portraitSrc: portraits.about.large,
        onDiveEnd: () => setPhase('done'),
        anchors: () => ({
          portrait: portraitRef.current,
          fire: fireRef.current,
          abyss: abyssRef.current,
          slots: slotRefs.current.filter(Boolean),
          panels: panelRefs.current.filter(Boolean),
        }),
      });
      sceneRef.current = stage;
      return stage.prepare({ intro: playIntro }).then(() => {
        if (!cancelled) stage.start();
        return stage;
      });
    }).catch(() => {
      if (!cancelled) {
        setWebgl(false);
        setPhase('done');
      }
      return null;
    });

    if (playIntro) {
      markIntroSeen();
      Promise.race([Promise.all([scenePromise, delay(BOOT_MS)]), delay(SCENE_TIMEOUT_MS)]).then(() => {
        if (cancelled || phaseRef.current !== 'boot') return;
        if (sceneRef.current) {
          sceneRef.current.prepareDive();
          setPhase('tear');
        } else {
          setPhase('done');
        }
      });
    }

    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [webgl]);

  useEffect(() => {
    if (phase !== 'boot' && phase !== 'tear' && phase !== 'dive') return undefined;
    const skip = () => {
      sceneRef.current?.skipDive();
      setPhase('done');
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [phase]);

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
  }, [hash]);

  useEffect(() => {
    if (phase === 'done' && !window.location.hash) linkRefs.current[getActiveMenuId()]?.focus({ preventScroll: true });
  }, [phase]);

  const handleTearEnd = () => {
    if (phaseRef.current !== 'tear') return;
    sceneRef.current?.playDive();
    setPhase('dive');
  };

  const select = (id) => {
    setActive(id);
    setActiveMenuId(id);
  };

  const handleMenuKey = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = menuItems.findIndex((item) => item.id === active);
    const step = event.key === 'ArrowDown' ? 1 : -1;
    const next = menuItems[(index + step + menuItems.length) % menuItems.length];
    select(next.id);
    linkRefs.current[next.id]?.focus();
  };

  const scrollTo = (event, id) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView();
  };

  return (
    <div ref={stageRef} className="stage" data-webgl={webgl ? 'on' : 'off'}>
      {webgl && <canvas ref={canvasRef} aria-hidden="true" className="stage-canvas" />}
      <div aria-hidden="true" className="stage-grain" style={{ backgroundImage: grainTexture() }} />
      {phase !== 'done' && phase !== 'dive' && (
        <IntroOverlay phase={phase} loading={t.atlus.stage.loading} skip={t.atlus.stage.skip} onTearEnd={handleTearEnd} />
      )}

      <section aria-labelledby="stage-title" className={`stage-hero ${phase === 'done' ? 'is-settled' : ''}`}>
        <p aria-hidden="true" className="stage-hud stage-cue">↓ {t.atlus.stage.scroll}</p>
        <div className="relative z-10 flex flex-col justify-center">
          <h1 id="stage-title" className="font-mono text-xs tracking-[0.3em] text-ash-300 uppercase">Richard Zuikov · {t.career.role}</h1>
          <nav aria-label={t.atlus.menuNav} className="has-message stage-menu mt-5">
            <ul onKeyDown={handleMenuKey}>
              {menuItems.map((item, index) => {
                const target = SCROLL_TARGETS[item.id];
                const shared = {
                  ref: (node) => { linkRefs.current[item.id] = node; },
                  'aria-current': active === item.id ? 'true' : undefined,
                  onMouseEnter: () => select(item.id),
                  onFocus: () => select(item.id),
                  className: `stage-slab ${active === item.id ? 'is-active' : ''}`,
                  style: { '--i': index, '--size': SLAB_SIZES[index], '--offset': SLAB_OFFSETS[index] },
                };
                return (
                  <li key={item.id} className={active === item.id ? 'has-active' : undefined}>
                    <span aria-hidden="true" className="slab-number">{item.number}</span>
                    {target ? (
                      <a href={`#${target}`} onClick={(event) => scrollTo(event, target)} {...shared}>{t.landing.nav[item.id]}</a>
                    ) : (
                      <Link to={item.path} state={{ fromMenu: true }} {...shared}>{t.landing.nav[item.id]}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <span aria-hidden="true" className="ground-message mt-3">{t.atlus.hints.menu}</span>
          </nav>
          <Link to={QUICK_PATH} className="mt-6 inline-flex items-center min-h-11 self-start font-mono text-xs uppercase tracking-widest text-ash-200 underline underline-offset-4">
            {t.landing.menuPlaceholder.quickRead}
          </Link>
        </div>
        <div ref={portraitRef} className="stage-portrait">
          {!webgl && <img src={portraits.about.large} alt="" className="h-full w-full object-contain grayscale" />}
        </div>
      </section>

      <section aria-labelledby="descent-title" className="stage-descent">
        <p className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.stage.descent}</p>
        <h2 id="descent-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight mt-2">{t.atlus.stage.descentTitle}</h2>
        <div className="mt-16 space-y-24 md:space-y-32">
          {t.about.logEntries.map((entry, index) => (
            <article
              key={entry.title}
              ref={(node) => { panelRefs.current[index] = node; }}
              className={`manga-panel ${index % 2 ? 'is-right' : ''}`}
            >
              <span aria-hidden="true" className="font-anton text-6xl leading-none text-ash-600">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="font-anton uppercase text-3xl tracking-wide mt-2">{entry.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ash-200">{entry.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="arcana" aria-labelledby="works-title" className="stage-works scroll-mt-16">
        <h2 id="works-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight">{t.atlus.stage.works}</h2>
        <ul className="stage-tarot">
          {featuredProjects.map((project, index) => (
            <li key={project.title}>
              <a
                ref={(node) => { slotRefs.current[index] = node; }}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="tarot-slot"
                onMouseEnter={() => sceneRef.current?.setHover(index)}
                onMouseLeave={() => sceneRef.current?.setHover(-1)}
                onFocus={() => sceneRef.current?.setHover(index)}
                onBlur={() => sceneRef.current?.setHover(-1)}
              >
                {webgl ? <span className="sr-only">{project.title}</span> : <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover grayscale" />}
              </a>
              <p className="mt-9 text-center font-mono text-xs leading-relaxed text-ash-300">{project[language].summary}</p>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs tracking-widest">
          <Link to="/lab" className="inline-flex items-center min-h-11 text-ash-100 underline underline-offset-4">{t.atlus.allProjects}</Link>
          <a href="https://rack.richardzuikov.com" target="_blank" rel="noreferrer" className="inline-flex items-center min-h-11 text-ash-300 underline underline-offset-4">{t.atlus.stage.rack} ↗</a>
        </div>
      </section>

      <section id="bonfire" ref={abyssRef} aria-labelledby="abyss-title" className="stage-abyss scroll-mt-16">
        {!webgl && <div aria-hidden="true" className="ember-glow" />}
        <div ref={fireRef} className="stage-fire" />
        <div className="relative z-10 max-w-md">
          <p className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.stage.abyssLabel}</p>
          <h2 id="abyss-title" className="font-cinzel font-bold uppercase text-4xl sm:text-5xl tracking-wide leading-tight mt-3">{t.atlus.contact.headline}</h2>
          <ContactList />
        </div>
      </section>
    </div>
  );
}
