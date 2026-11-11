/* global __DEV_HINTS__ */
// True on the Vite dev server only (vite.config.js `define`), never in any build: gates every TODO /
// DRAFT hint line, so placeholders for facts Richard still has to supply never reach visitors.
export const DEV_HINTS = typeof __DEV_HINTS__ !== 'undefined' && __DEV_HINTS__ === true;
