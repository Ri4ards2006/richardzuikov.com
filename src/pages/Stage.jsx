import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/use-document-title';
import { useLanguage } from '../hooks/use-language';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { ROMAN, getActiveMenuId, landOnSection, menuItems, scrollTargets, setActiveMenuId } from '../lib/atlus';
import { QUICK_PATH } from '../lib/sections';
import { portraits } from '../data/portraits';
import { featuredProjects } from '../data/featured-projects';
import IntroOverlay from '../components/stage/IntroOverlay';
import AboutSection from '../components/stage/AboutSection';
import PanelIllustration from '../components/stage/PanelIllustration';
import ProjectDeck from '../components/stage/ProjectDeck';
import NowSection from '../components/stage/NowSection';
import CardInspect from '../components/stage/CardInspect';
import SkillBoard from '../components/atlus/SkillBoard';
import RecordBoard from '../components/atlus/RecordBoard';
import ContactList from '../three/bonfire/ContactList';
import { grainTexture } from '../lib/noise-textures';
import { ImpactInk, InkSplat, TraceStar } from '../components/atlus/glyphs';

const INTRO_KEY = 'seen-stage-intro';
const BOOT_MS = 800;
const SCENE_TIMEOUT_MS = 4000;
// Each slab has its own size and offset (design bible, Card 03).
const SLAB_SIZES = [1, 0.84, 1.12, 0.92, 1.04];
const SLAB_OFFSETS = [0, 1.1, 0.4, 1.6, 0.7];
// Depth layer per descent panel: near panels move against the scroll, far ones trail it.
const PANEL_LAYERS = ['near', 'far', 'mid', 'near', 'far'];
const LAND_PIN_MS = 1500;
const LAND_RELEASE_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

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
  const [inspected, setInspected] = useState(null);

  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutPortraitRef = useRef(null);
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
        portraitSrc: portraits.stage.large,
        profileSrc: portraits.about.large,
        profilePlaceholder: portraits.about.isPlaceholder,
        onDiveEnd: () => setPhase('done'),
        anchors: () => ({
          portrait: portraitRef.current,
          about: aboutRef.current,
          aboutPortrait: aboutPortraitRef.current,
          fire: fireRef.current,
          abyss: abyssRef.current,
          slots: slotRefs.current.filter(Boolean),
          panels: panelRefs.current.filter(Boolean),
          skillProp: stageRef.current?.querySelector('.skill-prop'),
          // Text the descent props must keep clear of.
          obstacles: [...(stageRef.current?.querySelectorAll('.manga-panel, .stage-descent h2, .stage-descent > p, .stage-now h2, .now-panel') ?? [])],
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

  // The scroll cue fades out after the first scroll and stays gone.
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 8) return;
      stageRef.current?.classList.add('is-scrolled');
      window.removeEventListener('scroll', onScroll);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    if (!hash) return undefined;
    const id = hash.slice(1);
    landOnSection(id, 'instant');
    // Fonts and images still change the page height after a deep link, until the visitor takes over.
    const observer = new ResizeObserver(() => landOnSection(id, 'instant'));
    observer.observe(document.documentElement);
    const release = () => {
      observer.disconnect();
      clearTimeout(timer);
      LAND_RELEASE_EVENTS.forEach((type) => window.removeEventListener(type, release));
    };
    const timer = setTimeout(release, LAND_PIN_MS);
    LAND_RELEASE_EVENTS.forEach((type) => window.addEventListener(type, release, { passive: true }));
    return release;
  }, [hash]);

  // A hash change on this page never reaches the router's displayed location.
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash) landOnSection(window.location.hash.slice(1), 'instant');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (phase === 'done' && !window.location.hash) linkRefs.current[getActiveMenuId()]?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // A panel already above the viewport (deep link, fast scroll) must not stay hidden.
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    panelRefs.current.filter(Boolean).forEach((panel) => {
      panel.classList.add('is-armed');
      observer.observe(panel);
    });
    // The illustrations only run while their panel is on screen.
    const live = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-live', entry.isIntersecting));
    });
    panelRefs.current.filter(Boolean).forEach((panel) => live.observe(panel));
    return () => {
      observer.disconnect();
      live.disconnect();
    };
  }, []);

  // The card on the table disappears while its copy is zoomed, and comes back when it has returned.
  const openInspect = (card, sourceEl, sceneIndex = -1) => {
    sourceEl.style.visibility = 'hidden';
    sceneRef.current?.setHidden(sceneIndex);
    setInspected({ card, sourceEl });
  };

  const closeInspect = () => {
    const { sourceEl } = inspected;
    sourceEl.style.visibility = '';
    sceneRef.current?.setHidden(-1);
    setInspected(null);
    sourceEl.focus({ preventScroll: true });
  };

  const inspectFeatured = (project, index, element) => openInspect({
    numeral: ROMAN[index],
    title: project.title,
    image: project.image,
    imageLift: project.imageLift,
    lines: project[language].summary,
    details: project[language].specs,
    tags: project.tags,
    link: { href: project.href, label: t.atlus.inspect.source },
  }, element, index);

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
    landOnSection(id);
  };

  return (
    <div ref={stageRef} className="stage" data-webgl={webgl ? 'on' : 'off'}>
      {webgl && <canvas ref={canvasRef} aria-hidden="true" className="stage-canvas" />}
      <div aria-hidden="true" className="stage-grain" style={{ backgroundImage: grainTexture() }} />
      {phase !== 'done' && phase !== 'dive' && (
        <IntroOverlay phase={phase} loading={t.atlus.stage.loading} skip={t.atlus.stage.skip} onTearEnd={handleTearEnd} />
      )}

      <section aria-labelledby="stage-title" className={`stage-hero ${phase === 'done' ? 'is-settled' : ''}`}>
        <div className="stage-name">
          <InkSplat variant={1} className="ink-stage-name" />
          <h1 id="stage-title" className="stage-name-block"><span>Richard</span> <span>Zuikov</span></h1>
          <p className="stage-role">{t.career.role}</p>
        </div>
        <Link to={QUICK_PATH} className="stage-hud stage-quick">{t.landing.menuPlaceholder.quickRead} →</Link>
        <p aria-hidden="true" className="stage-hud stage-cue"><TraceStar small /> {t.atlus.stage.scroll}</p>
        <div className="relative z-10 flex flex-col justify-center">
          <InkSplat variant={0} className="ink-stage-menu" />
          <nav aria-label={t.atlus.menuNav} className="has-message stage-menu">
            <ul onKeyDown={handleMenuKey}>
              {menuItems.map((item, index) => {
                const target = scrollTargets[item.id];
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
        </div>
        <div ref={portraitRef} className="stage-portrait">
          {!webgl && <img src={portraits.stage.large} alt="" className="h-full w-full object-contain grayscale" />}
        </div>
      </section>

      <AboutSection ref={aboutRef} portraitRef={aboutPortraitRef} webgl={webgl} />

      <section aria-labelledby="descent-title" className="stage-descent">
        <p className="font-mono text-xs tracking-widest text-ash-300">{t.atlus.stage.descent}</p>
        <h2 id="descent-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight mt-2">{t.atlus.stage.descentTitle}</h2>
        <div className="mt-16 space-y-24 md:space-y-32">
          {t.about.logEntries.map((entry, index) => (
            <article
              key={entry.title}
              ref={(node) => { panelRefs.current[index] = node; }}
              className={`manga-panel is-${PANEL_LAYERS[index % PANEL_LAYERS.length]} ${index % 2 ? 'is-right' : ''}`}
            >
              <div className="flex items-start justify-between gap-5">
                <span aria-hidden="true" className="font-anton text-6xl leading-none text-ash-600">{String(index + 1).padStart(2, '0')}</span>
                <PanelIllustration index={index} />
              </div>
              <h3 className="font-anton uppercase text-3xl tracking-wide mt-2">{entry.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ash-200">{entry.desc}</p>
              {/* TODO strings are placeholders for facts still to be supplied, so visitors never see them. */}
              {import.meta.env.DEV && <p className="mt-3 font-mono text-xs text-ash-300">{entry.todo}</p>}
            </article>
          ))}
        </div>
      </section>

      <NowSection />

      <section id="arcana" aria-labelledby="works-title" className="stage-works scroll-mt-16">
        <ImpactInk variant={3} />
        <h2 id="works-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight">{t.atlus.stage.works}</h2>
        <ul className="stage-tarot">
          {featuredProjects.map((project, index) => (
            <li key={project.title}>
              <button
                ref={(node) => { slotRefs.current[index] = node; }}
                type="button"
                onClick={(event) => inspectFeatured(project, index, event.currentTarget)}
                aria-label={`${project.title}: ${t.atlus.flip}`}
                className="tarot-slot"
                onMouseEnter={() => sceneRef.current?.setHover(index)}
                onMouseLeave={() => sceneRef.current?.setHover(-1)}
                onFocus={() => sceneRef.current?.setHover(index)}
                onBlur={() => sceneRef.current?.setHover(-1)}
              >
                {webgl ? <span className="sr-only">{project.title}</span> : <img src={project.image} alt={project.title} loading="lazy" className="h-full w-full object-cover grayscale" />}
              </button>
              <p className="mt-9 text-center font-mono text-xs leading-relaxed text-ash-300">{project[language].summary}</p>
            </li>
          ))}
        </ul>
        <ProjectDeck onInspect={openInspect} />
      </section>

      <section id="skill" aria-labelledby="skill-title" className="stage-works scroll-mt-16">
        <ImpactInk variant={4} />
        <p className="font-mono text-xs tracking-widest text-ash-300">03 / {t.atlus.hud.stack}</p>
        <h2 id="skill-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight mt-2">{t.landing.nav.stack}</h2>
        <SkillBoard onCategory={webgl ? (index) => sceneRef.current?.setSkillCategory(index) : undefined} />
        <Link to="/stack" className="stage-more">{t.atlus.boards.fullIndex} →</Link>
      </section>

      <section id="record" aria-labelledby="record-title" className="stage-works scroll-mt-16">
        <div className="record-pin">
          <div className="record-yaw">
            <ImpactInk variant={2} />
            <p className="font-mono text-xs tracking-widest text-ash-300">04 / {t.atlus.hud.career}</p>
            <h2 id="record-title" className="heading-skew font-anton uppercase text-5xl sm:text-7xl tracking-wide leading-tight mt-2">{t.landing.nav.career}</h2>
            <RecordBoard ride onEnter={() => sceneRef.current?.travel()} onRide={(camera) => sceneRef.current?.setRide(camera)} />
            <Link to="/career" className="stage-more">{t.atlus.boards.fullRecord} →</Link>
          </div>
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
      {inspected && <CardInspect card={inspected.card} sourceEl={inspected.sourceEl} onClosed={closeInspect} />}
    </div>
  );
}
