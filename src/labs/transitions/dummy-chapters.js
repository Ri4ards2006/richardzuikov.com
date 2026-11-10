export function createChapterA() {
  const container = document.createElement('div');
  container.className = 'chapter-a-root';
  container.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #050505;
    padding: clamp(1rem, 4vw, 3rem);
    box-sizing: border-box;
    transform-origin: center center;
    backface-visibility: hidden;
    will-change: transform, opacity;
  `;

  container.innerHTML = `
    <div style="width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 1.5rem;">
      <!-- Chapter Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #27272a; padding-bottom: 0.75rem;">
        <div>
          <span style="font-family: 'Cinzel', Georgia, serif; font-size: 0.85rem; letter-spacing: 0.25em; color: #ff6a00; text-transform: uppercase;">ACT I // HARDWARE CORE</span>
          <h2 style="margin: 0.25rem 0 0; font-family: 'Anton', Impact, sans-serif; font-size: clamp(2rem, 5vw, 3.8rem); line-height: 0.95; letter-spacing: 0.04em; color: #f4f4f0; text-transform: uppercase;">
            01 &mdash; THE ARSENAL <span style="font-size: 0.45em; color: #71717a; vertical-align: middle; letter-spacing: 0.1em; font-family: sans-serif;">[兵器庫]</span>
          </h2>
        </div>
        <div style="text-align: right; font-family: monospace; font-size: 0.75rem; color: #a1a1aa;">
          <div>REF: SYS_ENG_092</div>
          <div style="color: #ff6a00;">STATUS: ACTIVE RAIL</div>
        </div>
      </div>

      <!-- Manga Panel Grid (The Panel Board) -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; width: 100%;">
        <!-- Panel 1 (Active Focus Panel for Zoom) -->
        <div class="panel-card panel-active" style="background: #121212; border: 2px solid #f4f4f0; padding: 1.25rem; position: relative; overflow: hidden; min-height: 220px; display: flex; flex-direction: column; justify-content: space-between;">
          <div style="position: absolute; top: 0; right: 0; background: #f4f4f0; color: #050505; font-family: 'Anton', Impact, sans-serif; font-size: 0.8rem; padding: 0.2rem 0.6rem; letter-spacing: 0.1em;">
            TARGET [α]
          </div>
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #ff6a00;">MOD_01 // FPGA DEMODULATOR</div>
            <h3 style="margin: 0.4rem 0; font-family: 'Anton', Impact, sans-serif; font-size: 1.5rem; color: #f4f4f0; letter-spacing: 0.05em;">
              LORA-RF PIPELINE
            </h3>
            <p style="margin: 0; font-size: 0.85rem; color: #a1a1aa; line-height: 1.4;">
              Coherent chirp demodulator written in SystemVerilog. Custom sync sequence correlator running at 125 MSPS.
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #3f3f46; padding-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #71717a;">
            <span>CLOCK: 200 MHz</span>
            <span style="color: #f4f4f0;">IO_L04P_0</span>
          </div>
        </div>

        <!-- Panel 2 -->
        <div class="panel-card" style="background: #0d0d0d; border: 1px solid #3f3f46; padding: 1.25rem; position: relative; overflow: hidden; min-height: 220px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #71717a;">MOD_02 // LOW-LEVEL HOST</div>
            <h3 style="margin: 0.4rem 0; font-family: 'Anton', Impact, sans-serif; font-size: 1.5rem; color: #d4d4d8; letter-spacing: 0.05em;">
              ESP32 DMA BRIDGE
            </h3>
            <p style="margin: 0; font-size: 0.85rem; color: #71717a; line-height: 1.4;">
              Zero-copy ring buffer over SPI DMA. Hardware timer-driven sampling engine for high-bandwidth telemetry.
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #27272a; padding-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #52525b;">
            <span>MEM: 520 KB SRAM</span>
            <span>INT_PRIO: 1</span>
          </div>
        </div>

        <!-- Panel 3 -->
        <div class="panel-card" style="background: #0d0d0d; border: 1px solid #3f3f46; padding: 1.25rem; position: relative; overflow: hidden; min-height: 220px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #71717a;">MOD_03 // RF FRONTEND</div>
            <h3 style="margin: 0.4rem 0; font-family: 'Anton', Impact, sans-serif; font-size: 1.5rem; color: #d4d4d8; letter-spacing: 0.05em;">
              VECTOR SWEEPER
            </h3>
            <p style="margin: 0; font-size: 0.85rem; color: #71717a; line-height: 1.4;">
              100 kHz &ndash; 3.0 GHz dual-port reflection analyzer with automated calibration coefficient solver.
            </p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #27272a; padding-top: 0.5rem; font-family: monospace; font-size: 0.7rem; color: #52525b;">
            <span>DYNAMIC RANGE: 85 dB</span>
            <span>IF: 10.7 MHz</span>
          </div>
        </div>
      </div>

      <!-- Footer Rail Indicator -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 0.7rem; color: #52525b;">
        <span>// CHAPTER RAIL: 01 / 04</span>
        <span>SCROLL DOWN TO INITIATE TRANSITION &darr;</span>
      </div>
    </div>
  `;

  return container;
}

export function createChapterB() {
  const container = document.createElement('div');
  container.className = 'chapter-b-root';
  container.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #050505;
    padding: clamp(1rem, 4vw, 3rem);
    box-sizing: border-box;
    transform-origin: center center;
    backface-visibility: hidden;
    will-change: transform, opacity;
  `;

  container.innerHTML = `
    <div style="width: 100%; max-width: 1100px; display: flex; flex-direction: column; gap: 2rem;">
      <!-- Giant Title Slab -->
      <div style="background: #121212; border: 3px solid #f4f4f0; padding: clamp(1.5rem, 5vw, 3.5rem); position: relative; box-shadow: 12px 12px 0px #ff6a00;">
        <div style="position: absolute; top: -14px; left: 24px; background: #ff6a00; color: #050505; font-family: 'Anton', Impact, sans-serif; font-size: 0.85rem; padding: 0.2rem 0.8rem; letter-spacing: 0.15em; text-transform: uppercase;">
          CHAPTER 02 &bull; NEW SECTOR
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <span style="font-family: 'Cinzel', Georgia, serif; font-size: 1rem; letter-spacing: 0.3em; color: #a1a1aa; text-transform: uppercase;">
            SYSTEM COGNITION &amp; EMBEDDED INTELLIGENCE
          </span>
          <h1 style="margin: 0; font-family: 'Anton', Impact, sans-serif; font-size: clamp(2.8rem, 8vw, 6.5rem); line-height: 0.9; letter-spacing: 0.02em; color: #f4f4f0; text-transform: uppercase;">
            NEURAL HORIZON
          </h1>
          <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
            <span style="font-family: sans-serif; font-size: 1.4rem; color: #ff6a00; letter-spacing: 0.2em; font-weight: bold;">[神経回路網]</span>
            <div style="height: 1px; flex: 1; background: #3f3f46;"></div>
            <span style="font-family: monospace; font-size: 0.8rem; color: #71717a;">SECTOR LOCK: 0x7E4</span>
          </div>
        </div>

        <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; border-top: 1px solid #27272a; padding-top: 1.5rem;">
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #ff6a00;">RUNTIME</div>
            <div style="font-family: 'Anton', Impact, sans-serif; font-size: 1.3rem; color: #f4f4f0; margin-top: 0.2rem;">BARE-METAL C++20</div>
            <p style="margin: 0.3rem 0 0; font-size: 0.8rem; color: #a1a1aa;">Deterministic inference engine on Arm Cortex-M7.</p>
          </div>
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #ff6a00;">QUANTIZATION</div>
            <div style="font-family: 'Anton', Impact, sans-serif; font-size: 1.3rem; color: #f4f4f0; margin-top: 0.2rem;">INT8 / TERNARY</div>
            <p style="margin: 0.3rem 0 0; font-size: 0.8rem; color: #a1a1aa;">Direct bitwise systolic array execution.</p>
          </div>
          <div>
            <div style="font-family: monospace; font-size: 0.7rem; color: #ff6a00;">LATENCY</div>
            <div style="font-family: 'Anton', Impact, sans-serif; font-size: 1.3rem; color: #f4f4f0; margin-top: 0.2rem;">&le; 1.42 MS</div>
            <p style="margin: 0.3rem 0 0; font-size: 0.8rem; color: #a1a1aa;">Zero heap allocation during steady-state loop.</p>
          </div>
        </div>
      </div>

      <!-- Navigation & Status Indicator -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 0.75rem; color: #71717a;">
        <span>// CHAPTER 02 LOADED</span>
        <span>SCROLL UP TO REVERSE &uarr;</span>
      </div>
    </div>
  `;

  return container;
}
