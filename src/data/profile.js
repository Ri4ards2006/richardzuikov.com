// /about status screen (DESIGN.md §18, v7 task 3). Source: Richard's ABOUT block (design/ABOUT.md).
// Nothing here is invented. A string starting with "TODO" is shown in development only and
// hidden in production; a section whose entries are all TODO disappears from the sub-menu there.
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

// Item tiles = Richard's hobbies (v8, 2026-11-11). icon: a key of ICONS (generic line icons, our own).
// The same list feeds "WHAT I'M INTO" in the home page's Who Am I box (names only).
const FLAVOR_TODO = { de: 'TODO: eine trockene Zeile von Richard', en: 'TODO: one dry line from Richard' };
export const inventory = [
  { id: 'powerlifting', icon: 'barbell', name: { de: 'Powerlifting', en: 'Powerlifting' }, flavor: FLAVOR_TODO },
  { id: 'homelab', icon: 'rack', name: { de: 'Home-Lab', en: 'Home lab' }, flavor: FLAVOR_TODO },
  { id: 'reading', icon: 'book', name: { de: 'Lesen', en: 'Reading' }, flavor: FLAVOR_TODO },
  { id: 'coding', icon: 'code', name: { de: 'Coding', en: 'Coding' }, flavor: FLAVOR_TODO },
  { id: 'outside', icon: 'outside', name: { de: 'Draußen', en: 'Outside' }, flavor: FLAVOR_TODO },
];

// NOW (v8): what takes Richard's time right now. Labels are his; the details are TODO keys.
const DETAIL_TODO = (what) => ({ de: `TODO: Details von Richard (${what.de})`, en: `TODO: details from Richard (${what.en})` });
const NOW_ITEMS = [
  { id: 'apprenticeship', label: { de: 'Ausbildung IT-Systemelektroniker', en: 'Apprenticeship: IT systems electronics technician' } },
  { id: 'gym', label: { de: 'Gym (Powerlifting)', en: 'Gym (powerlifting)' } },
  { id: 'reading', label: { de: 'Lesen', en: 'Reading' } },
];
export const now = NOW_ITEMS.map((item) => ({ ...item, detail: DETAIL_TODO(item.label) }));
