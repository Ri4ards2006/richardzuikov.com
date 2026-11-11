// /about status screen (DESIGN.md §18, v7 task 3). Source: Richard's ABOUT block (design/ABOUT.md).
// Nothing here is invented. A string starting with "TODO" is shown in development only and
// hidden in production; a section whose entries are all TODO disappears from the sub-menu there.
import { nowEntries } from './now';
import { DEV_HINTS } from '../lib/dev-hints';

export const isTodo = (text) => typeof text === 'string' && text.startsWith('TODO');
export const shown = (text) => Boolean(text) && (!isTodo(text) || DEV_HINTS);
export const pick = (value, language) => (value && typeof value === 'object' ? value[language] ?? value.en : value);

// Draft built from the facts in the ABOUT block and the published apprenticeship entry.
// For Richard's review (WORKLOG, 2026-11-10). Max. 90 words per language.
export const intro = {
  de: 'Ich bin Richard, Azubi zum IT-Systemelektroniker bei R2P in Flensburg, fertig 2027. Im Außendienst verlege ich Netzwerke und nehme Kamerasysteme beim Kunden in Betrieb. Zu Hause steht mein Home-Lab, und an eigenen Platinen sitze ich auch. Hier geht es nicht um Skills, sondern darum, wer ich daneben bin.',
  en: "I'm Richard, training as an IT systems electronics technician at R2P in Flensburg until 2027. In the field I lay networks and commission camera systems at customer sites. At home there is my home lab, and I build my own boards too. This screen is not about skills but about who I am besides them.",
};

// Level pips: 4 native, 3 fluent, 2 good, 1 basic, null = not given (TODO).
export const LEVELS = { native: 4, fluent: 3, good: 2, basic: 1 };

export const status = {
  name: 'Richard Zuikov',
  base: { de: 'Flensburg, DE', en: 'Flensburg, DE' },
  role: {
    de: 'IT-Systemelektroniker in Ausbildung, bis 2027',
    en: 'IT systems electronics technician in training, until 2027',
  },
  // Not in the ABOUT block, so it is not shown.
  age: null,
  languages: [
    { id: 'de', name: { de: 'Deutsch', en: 'German' }, level: null },
    { id: 'en', name: { de: 'Englisch', en: 'English' }, level: null },
    { id: 'lv', name: { de: 'Lettisch', en: 'Latvian' }, level: null },
    { id: 'ru', name: { de: 'Russisch', en: 'Russian' }, level: null },
  ],
  todoLevels: { de: 'TODO: Sprachniveaus (Muttersprache / fließend / gut / Grundkenntnisse) von Richard.', en: 'TODO: language levels (native / fluent / good / basic) from Richard.' },
};

// Monday first. Each day: one short line of Richard's typical week.
const DAY_NAMES = {
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};
const WEEK_TODO = { de: 'TODO: typischer Tag von Richard', en: "TODO: Richard's typical day" };
export const week = DAY_NAMES.de.map((_, index) => ({
  day: { de: DAY_NAMES.de[index], en: DAY_NAMES.en[index] },
  text: WEEK_TODO,
}));

// Item tiles. icon: a key of PROFILE_ICONS (generic line icons, our own).
export const inventory = [
  { id: 'powerlifting', icon: 'barbell', name: { de: 'Powerlifting', en: 'Powerlifting' }, flavor: { de: 'TODO: eine trockene Zeile von Richard', en: 'TODO: one dry line from Richard' } },
  { id: 'homelab', icon: 'rack', name: { de: 'Home-Lab', en: 'Home lab' }, flavor: { de: 'TODO: eine trockene Zeile von Richard', en: 'TODO: one dry line from Richard' } },
  { id: 'more', icon: 'slot', name: { de: 'TODO: weitere Hobbys / Interessen', en: 'TODO: more hobbies / interests' }, flavor: { de: 'TODO: je eine trockene Zeile', en: 'TODO: one dry line each' } },
];

// "Building" reuses the published NOW entries (data/now.js); learning and reading are Richard's.
export const now = {
  building: nowEntries.filter((entry) => entry.title).map((entry) => entry.title),
  learning: { de: 'TODO: was Richard gerade lernt', en: 'TODO: what Richard is learning right now' },
  reading: { de: 'TODO: was Richard gerade liest', en: 'TODO: what Richard is reading right now' },
};
