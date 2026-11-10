export class CandidateRoll {
  constructor(container, chapterA, chapterB) {
    this.container = container;
    this.chapterA = chapterA;
    this.chapterB = chapterB;

    // Create Speedlines Canvas
    this.speedlinesCanvas = document.createElement('canvas');
    this.speedlinesCanvas.className = 'speedlines-burst';
    this.speedlinesCanvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 15;
      opacity: 0;
      mix-blend-mode: screen;
    `;
    this.container.appendChild(this.speedlinesCanvas);
    this.ctx = this.speedlinesCanvas.getContext('2d');

    this.resize();
    this.seedSpeedlines();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.speedlinesCanvas.width = this.width;
    this.speedlinesCanvas.height = this.height;
  }

  seedSpeedlines() {
    this.lines = [];
    const count = 70;
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const dist = 100 + Math.random() * Math.max(this.width, this.height);
      const length = 200 + Math.random() * 400;
      const width = 1 + Math.random() * 3.5;
      this.lines.push({ angle, dist, length, width });
    }
  }

  drawSpeedlines(opacity) {
    if (opacity <= 0.01) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    const cx = this.width / 2;
    const cy = this.height / 2;
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = '#f4f4f0';

    for (const line of this.lines) {
      this.ctx.lineWidth = line.width;
      this.ctx.globalAlpha = opacity * (0.3 + Math.random() * 0.7);
      this.ctx.beginPath();
      const x1 = cx + Math.cos(line.angle) * line.dist;
      const y1 = cy + Math.sin(line.angle) * line.dist;
      const x2 = cx + Math.cos(line.angle) * (line.dist + line.length);
      const y2 = cy + Math.sin(line.angle) * (line.dist + line.length);
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
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
      this.drawSpeedlines(0);
      return;
    }

    // Normalized roll: 0 to 90 degrees
    const rollAngle = progress * 90;
    const scale = 1 + progress * 0.35;

    // Speedlines active between 0.3 and 0.7
    let speedlineOpacity = 0;
    if (progress >= 0.3 && progress <= 0.7) {
      speedlineOpacity = Math.sin(((progress - 0.3) / 0.4) * Math.PI);
    }
    this.drawSpeedlines(speedlineOpacity);

    // Chapter A flies camera-left while rolling
    const aX = -progress * 130; // percentage
    const aOpacity = Math.max(0, 1 - progress * 1.5);
    this.chapterA.style.transform = `scale(${scale}) rotateZ(${rollAngle}deg) translateX(${aX}vw)`;
    this.chapterA.style.opacity = aOpacity.toFixed(3);
    this.chapterA.style.pointerEvents = progress > 0.4 ? 'none' : 'auto';

    // Chapter B enters vertically (starts rotated -90° relative to stage roll, coming in along y axis)
    const bY = (1 - progress) * 140; // percentage
    const bOpacity = Math.min(1, Math.max(0, (progress - 0.25) * 1.6));
    this.chapterB.style.transform = `scale(${scale}) rotateZ(${rollAngle - 90}deg) translateY(${bY}vh)`;
    this.chapterB.style.opacity = bOpacity.toFixed(3);
    this.chapterB.style.pointerEvents = progress > 0.6 ? 'auto' : 'none';
  }

  destroy() {
    if (this.speedlinesCanvas && this.speedlinesCanvas.parentNode) {
      this.speedlinesCanvas.parentNode.removeChild(this.speedlinesCanvas);
    }
  }
}
