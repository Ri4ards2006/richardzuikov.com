// Menu entries on "/". `screen` marks entries that open a full-screen route.
export const menuItems = [
  { id: 'about', number: '01', path: '/about', screen: true },
  { id: 'work', number: '02', path: '/work', screen: true },
  { id: 'stack', number: '03', path: '/stack', screen: true },
  { id: 'career', number: '04', path: '/career', screen: true },
  { id: 'contact', number: '05', path: '/contact', screen: false },
];

const atlusPaths = new Set(['/', ...menuItems.filter((item) => item.screen).map((item) => item.path)]);

export const isAtlusPath = (pathname) => atlusPaths.has(pathname);

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
