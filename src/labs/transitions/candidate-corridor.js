export class CandidateCorridor {
  constructor(container, chapterA, chapterB) {
    this.container = container;
    this.chapterA = chapterA;
    this.chapterB = chapterB;

    this.container.style.perspective = '1200px';
    this.container.style.transformStyle = 'preserve-3d';

    // Fog overlay
    this.fogOverlay = document.createElement('div');
    this.fogOverlay.className = 'corridor-fog';
    this.fogOverlay.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      background: radial-gradient(circle at 50% 50%, rgba(5,5,5,0.2) 20%, rgba(5,5,5,0.95) 85%);
      opacity: 0;
      transition: opacity 0.1s linear;
    `;
    this.container.appendChild(this.fogOverlay);
  }

  resize() {}

  render(progress, isReducedMotion) {
    if (isReducedMotion) {
      const active = progress >= 0.5;
      this.chapterA.style.transform = 'none';
      this.chapterA.style.opacity = active ? '0' : '1';
      this.chapterA.style.pointerEvents = active ? 'none' : 'auto';

      this.chapterB.style.transform = 'none';
      this.chapterB.style.opacity = active ? '1' : '0';
      this.chapterB.style.pointerEvents = active ? 'auto' : 'none';
      this.fogOverlay.style.opacity = '0';
      return;
    }

    // Fog peaks in the mid-transition corridor
    const fogOpacity = Math.sin(progress * Math.PI) * 0.85;
    this.fogOverlay.style.opacity = fogOpacity.toFixed(3);

    // Chapter A: tilts back -45deg on X, slides back into -Z
    const aTiltX = -progress * 45; // deg
    const aDistZ = -progress * 1400; // px
    const aOpacity = Math.max(0, 1 - progress * 1.5);

    this.chapterA.style.transformOrigin = '50% 100%';
    this.chapterA.style.transform = `translateZ(${aDistZ.toFixed(1)}px) rotateX(${aTiltX.toFixed(1)}deg)`;
    this.chapterA.style.opacity = aOpacity.toFixed(3);
    this.chapterA.style.pointerEvents = progress > 0.4 ? 'none' : 'auto';

    // Chapter B: rises from foreground (+Z and +Y), tilts from +45deg to 0deg
    const bTiltX = (1 - progress) * 45; // deg
    const bDistZ = (1 - progress) * -800; // px
    const bDistY = (1 - progress) * 90; // vh
    const bOpacity = Math.min(1, Math.max(0, (progress - 0.2) * 1.3));

    this.chapterB.style.transformOrigin = '50% 0%';
    this.chapterB.style.transform = `translateY(${bDistY.toFixed(1)}vh) translateZ(${bDistZ.toFixed(1)}px) rotateX(${bTiltX.toFixed(1)}deg)`;
    this.chapterB.style.opacity = bOpacity.toFixed(3);
    this.chapterB.style.pointerEvents = progress > 0.6 ? 'auto' : 'none';
  }

  destroy() {
    this.container.style.perspective = 'none';
    this.container.style.transformStyle = 'flat';
    if (this.fogOverlay && this.fogOverlay.parentNode) {
      this.fogOverlay.parentNode.removeChild(this.fogOverlay);
    }
  }
}
