import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/use-language';
import Screen, { SubMenu } from '../components/atlus/Screen';
import ProfilePortrait from '../components/atlus/ProfilePortrait';
import { Icon } from '../components/atlus/glyphs';
import { LEVELS, intro, inventory, isTodo, now, pick, shown, status } from '../data/profile';
import { DEV_HINTS } from '../lib/dev-hints';

// /about (DESIGN.md §18, v7 task 3): Richard as a person, as a status screen. Skills live in
// Descent / Stack. Left the profile portrait, then the sub-menu, then the detail panel.
// Facts come only from data/profile.js; TODO strings show in development only.

function Pips({ level, label }) {
  return (
    <span className="prof-pips" role="img" aria-label={label}>
      {[1, 2, 3, 4].map((n) => <span key={n} className={n <= level ? 'is-on' : ''} />)}
    </span>
  );
}

function StatusPanel({ copy, language }) {
  const rows = [
    { label: copy.name, value: status.name },
    { label: copy.base, value: pick(status.base, language) },
    { label: copy.role, value: pick(status.role, language) },
    ...(status.age ? [{ label: copy.age, value: status.age }] : []),
  ];
  const missingLevels = status.languages.some((entry) => !entry.level);
  return (
    <>
      <h2 className="prof-h">{copy.tabs.status}</h2>
      <dl className="prof-status">
        {rows.map((row) => (
          <div key={row.label} className="scr-stat">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <h3 className="prof-sub">{copy.languages}</h3>
      <ul className="prof-langs">
        {status.languages.map((entry) => {
          const level = LEVELS[entry.level];
          return (
            <li key={entry.id}>
              <span>{pick(entry.name, language)}</span>
              {level && <Pips level={level} label={copy.levels[level]} />}
            </li>
          );
        })}
      </ul>
      {missingLevels && DEV_HINTS && <p className="prof-todo">{pick(status.todoLevels, language)}</p>}
    </>
  );
}

function InventoryPanel({ copy, language, items }) {
  return (
    <>
      <h2 className="prof-h">{copy.inventoryTitle}</h2>
      <ul className="prof-inv">
        {items.map((item) => {
          const name = pick(item.name, language);
          const flavor = pick(item.flavor, language);
          return (
            <li key={item.id} className="prof-item">
              <Icon name={item.icon} className="prof-item-icon" />
              <span className={`prof-item-name ${isTodo(name) ? 'prof-todo' : ''}`}>{name}</span>
              {shown(flavor) && <span className={`prof-item-flavor ${isTodo(flavor) ? 'prof-todo' : ''}`}>{flavor}</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

// NOW (v8): apprenticeship · gym · reading. The details are TODO keys, shown on the dev server only.
function NowPanel({ copy, language }) {
  return (
    <>
      <h2 className="prof-h">{copy.tabs.now}</h2>
      <ul className="prof-now">
        {now.map((item) => {
          const detail = pick(item.detail, language);
          return (
            <li key={item.id}>
              <span className="prof-now-label">{pick(item.label, language)}</span>
              {shown(detail) && <span className={`prof-now-detail ${isTodo(detail) ? 'prof-todo' : ''}`}>{detail}</span>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function About() {
  const { t, language } = useLanguage();
  const copy = t.atlus.about.profile;
  const [active, setActive] = useState(0);

  const items = inventory.filter((item) => shown(pick(item.name, language)));
  const tabs = [
    { id: 'status', label: copy.tabs.status },
    ...(items.length ? [{ id: 'inventory', label: copy.tabs.inventory }] : []),
    { id: 'now', label: copy.tabs.now },
  ];
  const tab = tabs[Math.min(active, tabs.length - 1)].id;
  const introText = pick(intro, language);

  return (
    <Screen id="about" number="01" title={t.landing.nav.about} hud={t.atlus.hud.about} prop="domeCamera">
      <div className="prof-body">
        <div className="prof-intro">
          <p>{introText}</p>
          {DEV_HINTS && <p className="prof-todo">{copy.draft}</p>}
        </div>
        <ProfilePortrait label={copy.portrait} />
        <SubMenu label={t.landing.nav.about} items={tabs} active={active} onSelect={setActive} />
        <section key={tab} aria-live="polite" className="scr-detail prof-detail slash-wipe">
          {tab === 'status' && <StatusPanel copy={copy} language={language} />}
          {tab === 'inventory' && <InventoryPanel copy={copy} language={language} items={items} />}
          {tab === 'now' && <NowPanel copy={copy} language={language} />}
        </section>
      </div>
      <Link to="/stack" className="prof-skills">{copy.skills}</Link>
    </Screen>
  );
}
