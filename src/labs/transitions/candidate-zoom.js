export class CandidateZoom {
  constructor(container, chapterA, chapterB) {
    this.container = container;
    this.chapterA = chapterA;
    this.chapterB = chapterB;
    this.activeCard = this.chapterA.querySelector('.panel-active');
  }

  resize() {
    // No canvas needed, purely CSS 3D matrix transform
  }

  render(progress, isReducedMotion) {
    if (isReducedMotion) {
      const active = progress >= 0.5;
      this.chapterA.style.transform = 'none';
      this.chapterA.style.opacity = active ? '0' : '1';
      this.chapterA.style.pointerEvents = active ? 'none' : 'auto';

      this.chapterB.style.transform = 'none';
      this.chapterB.style.opacity = active ? '1' : '0';
      this.chapterB.style.pointerEvents = active ? 'auto' : 'none';
      return;
    }

    // Zoom phase: Chapter A scales up to +800% (9x total)
    // Easing: quadratic acceleration
    const zoomScale = 1 + Math.pow(progress, 1.8) * 8.0;
    const aOpacity = Math.max(0, 1 - Math.pow(progress * 1.5, 2));

    this.chapterA.style.transformOrigin = '35% 45%'; // Focuses on the active target panel
    this.chapterA.style.transform = `scale(${zoomScale.toFixed(3)})`;
    this.chapterA.style.opacity = aOpacity.toFixed(3);
    this.chapterA.style.pointerEvents = progress > 0.3 ? 'none' : 'auto';

    // Chapter B fades in from centre
    // Starts appearing at progress >= 0.45
    let bProgress = Math.max(0, (progress - 0.45) / 0.55);
    // Smooth ease out
    const bScale = 0.5 + Math.sin(bProgress * Math.PI * 0.5) * 0.5;
    const bOpacity = Math.min(1, Math.pow(bProgress, 1.4));

    this.chapterB.style.transformOrigin = 'center center';
    this.chapterB.style.transform = `scale(${bScale.toFixed(3)})`;
    this.chapterB.style.opacity = bOpacity.toFixed(3);
    this.chapterB.style.pointerEvents = progress > 0.6 ? 'auto' : 'none';
  }

  destroy() {
    this.chapterA.style.transform = 'none';
    this.chapterA.style.opacity = '1';
    this.chapterB.style.transform = 'none';
    this.chapterB.style.opacity = '1';
  }
}
