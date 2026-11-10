export class PerfMonitor {
  constructor() {
    this.fps = 60;
    this.frameTime = 16.6;
    this.lastTime = performance.now();
    this.frames = 0;
    this.accumTime = 0;
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    this.frameTime = Number(delta.toFixed(1));
    this.frames++;
    this.accumTime += delta;

    if (this.accumTime >= 500) {
      this.fps = Math.round((this.frames * 1000) / this.accumTime);
      this.frames = 0;
      this.accumTime = 0;
    }

    return {
      fps: this.fps,
      frameTime: this.frameTime,
    };
  }
}
