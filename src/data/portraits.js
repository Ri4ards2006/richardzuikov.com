import silhouette from '../assets/portraits/silhouette.svg';
import profileSilhouette from '../assets/portraits/profile-silhouette.svg';
import frontSilhouette from '../assets/portraits/front-silhouette.svg';

const files = import.meta.glob('../assets/portraits/*.webp', { eager: true, query: '?url', import: 'default' });

export const menuIds = ['about', 'work', 'stack', 'career', 'contact'];

const portraitPair = (id, placeholder = silhouette) => {
  const large = files[`../assets/portraits/${id}-1400.webp`];
  const small = files[`../assets/portraits/${id}-700.webp`];
  if (large && small) return { large, small, isPlaceholder: false };
  return { large: placeholder, small: placeholder, isPlaceholder: true };
};

// Menu id -> { large, small, isPlaceholder }. Missing photos use a silhouette.
// `stage` looks into the camera, `about` is the side profile.
export const portraits = {
  ...Object.fromEntries(menuIds.map((id) => [id, portraitPair(id)])),
  stage: portraitPair('stage', frontSilhouette),
  about: portraitPair('about', profileSilhouette),
};
