export class CandidateInk {
  constructor(container, chapterA, chapterB) {
    this.container = container;
    this.chapterA = chapterA;
    this.chapterB = chapterB;

    // Ink Canvas for high-performance organic sweep and wipe
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ink-dive-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 25;
    `;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.resize();
    this.generateBrushBlobs();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  generateBrushBlobs() {
    this.blobs = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.blobs.push({
        relX: (i / count), // ordered left to right sweep
        y: Math.random() * this.height,
        radius: 120 + Math.random() * 240,
        speedX: 0.8 + Math.random() * 0.4,
        skewY: (Math.random() - 0.5) * 0.4,
      });
    }
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
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    const cx = this.width / 2;
    const cy = this.height / 2;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (progress <= 0.5) {
      // Phase 1 (0 -> 0.5): Ink sweeps from left to right wiping Chapter A
      const sweepProgress = progress * 2.0; // 0 to 1
      this.chapterA.style.opacity = (1 - sweepProgress * 0.9).toFixed(3);
      this.chapterA.style.transform = `scale(${1 - sweepProgress * 0.05})`;
      this.chapterA.style.pointerEvents = sweepProgress > 0.8 ? 'none' : 'auto';

      this.chapterB.style.opacity = '0';
      this.chapterB.style.pointerEvents = 'none';

      // Draw sweeping ink strokes
      this.ctx.fillStyle = '#050505';

      // Solid trailing curtain
      const leadX = sweepProgress * (this.width + 400) - 200;
      if (leadX > 0) {
        this.ctx.fillRect(0, 0, Math.min(this.width, leadX - 100), this.height);
      }

      // Organic splashing brush blobs on the front
      for (const blob of this.blobs) {
        const bx = (blob.relX * (this.width + 300) - 150) * sweepProgress * 1.5;
        if (bx > -200 && bx < this.width + 200) {
          this.ctx.beginPath();
          this.ctx.ellipse(bx, blob.y, blob.radius * sweepProgress, blob.radius * (0.6 + blob.skewY), 0.1, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    } else {
      // Phase 2 (0.5 -> 1.0): Ink curtain opens up from center / wipes off to right
      const revealProgress = (progress - 0.5) * 2.0; // 0 to 1
      this.chapterA.style.opacity = '0';
      this.chapterA.style.pointerEvents = 'none';

      this.chapterB.style.opacity = Math.min(1, revealProgress * 1.4).toFixed(3);
      this.chapterB.style.transform = `scale(${0.96 + revealProgress * 0.04})`;
      this.chapterB.style.pointerEvents = revealProgress > 0.2 ? 'auto' : 'none';

      // Reverse ink wipe: curtain moves off screen to right or opens up
      this.ctx.fillStyle = '#050505';
      const wipeStartX = revealProgress * (this.width + 300);
      if (wipeStartX < this.width) {
        this.ctx.fillRect(wipeStartX, 0, this.width - wipeStartX, this.height);

        // Trailing brush edge on the curtain
        for (const blob of this.blobs) {
          const bx = wipeStartX + (blob.relX * 250);
          this.ctx.beginPath();
          this.ctx.ellipse(bx, blob.y, blob.radius * (1 - revealProgress * 0.4), blob.radius * 0.7, 0, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
