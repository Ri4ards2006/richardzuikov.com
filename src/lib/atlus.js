// Menu entries on "/". `screen` marks entries that open a full-screen route.
export const menuItems = [
  { id: 'about', number: '01', path: '/about', screen: true },
  { id: 'work', number: '02', path: '/work', screen: true },
  { id: 'stack', number: '03', path: '/stack', screen: true },
  { id: 'career', number: '04', path: '/career', screen: true },
  { id: 'contact', number: '05', path: '/contact', screen: false },
];

export const CONTACT_PATH = '/contact';

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// Menu entries that land on a section of "/" instead of opening a screen.
export const scrollTargets = { about: 'about', work: 'arcana', stack: 'skill', contact: 'bonfire' };

// The bonfire only rests at the very end of the camera rail; its section top is still mid-zoom.
export function landOnSection(id, behavior = 'smooth') {
  if (id === 'bonfire') {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior });
}

const atlusPaths = new Set(['/', ...menuItems.filter((item) => item.screen).map((item) => item.path)]);

export const isAtlusPath = (pathname) => atlusPaths.has(pathname);

// Atlus screens are always dark, except the contact screen, which follows the theme.
export const isForcedDark = (pathname, theme) => isAtlusPath(pathname) && (pathname !== CONTACT_PATH || theme === 'dark');

const STORAGE_KEY = 'atlus-active-item';
let activeMenuId = null;

export function getActiveMenuId() {
  if (activeMenuId) return activeMenuId;
  try {
    return sessionStorage.getItem(STORAGE_KEY) || menuItems[0].id;
  } catch {
    return menuItems[0].id;
  }
}

export function setActiveMenuId(id) {
  activeMenuId = id;
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Keeps working for this page load through the module variable.
  }
}
