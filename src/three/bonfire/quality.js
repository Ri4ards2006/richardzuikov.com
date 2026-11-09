// Same breakpoint as the stage. Below it the fire is reduced (DESIGN.md §8).
export function bonfireQuality() {
  const small = window.innerWidth < 768;
  return {
    small,
    radial: small ? 12 : 22,
    stoneDetail: small ? 1 : 2,
    ringStones: small ? 13 : 20,
    strayStones: small ? 3 : 8,
    pcbs: small ? 8 : 18,
    atlas: small ? 256 : 512,
    logs: small ? 3 : 5,
    octaves: small ? 2 : 3,
    sparks: small ? 14 : 44,
    smoke: small ? 1 : 2,
    glow: !small,
    floorSegments: small ? 20 : 44,
  };
}
