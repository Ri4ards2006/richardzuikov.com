import React from 'react';

function Dev() {
  return (
    <main className="page-main">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Dev Log & Systems</h1>
        <p className="page-subtitle">
          Building things at the intersection of software, silicon, and solder.
        </p>
      </div>

      {/* Engineering Focus Matrix */}
      <section className="about-section" style={{ marginBottom: '3rem' }}>
        <h2 className="about-section-title">⚙️ Engineering Focus</h2>
        <div style={{ 
          fontFamily: 'monospace', 
          whiteSpace: 'pre-wrap', 
          backgroundColor: 'var(--bg-card, #161b22)', 
          padding: '1.5rem', 
          borderRadius: '4px', 
          border: '1px solid var(--border)',
          color: '#00979D',
          lineHeight: '1.4',
          fontSize: '0.85rem',
          overflowX: 'auto'
        }}>
{`┌─────────────────────────────────────────────────────────────────┐
│  EMBEDDED SYSTEMS     │  FPGA / VHDL          │  REVERSE ENG.   │
│  Arduino · ESP32      │  Digital Logic Design │  Binary Analysis │
│  STM32 · AVR · MCU    │  Hardware Description │  Firmware RE    │
├─────────────────────────────────────────────────────────────────┤
│  IoT & PROTOCOLS      │  ELECTRICAL ENG.      │  SYSTEMS & INFRA │
│  MQTT · I²C · SPI     │  PCB · Oscilloscope   │  Linux · Docker  │
│  UART · CAN · RF      │  Soldering · EE Theory│  Proxmox · Nets  │
└─────────────────────────────────────────────────────────────────┘`}
        </div>
      </section>

      {/* Infrastructure & Repositories Board */}
      <section className="about-section" style={{ marginBottom: '3rem' }}>
        <h2 className="about-section-title">🚀 Engineering Roadmap & Active Repos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            fontFamily: 'var(--font-sans)', 
            fontSize: '0.9rem',
            marginTop: '1rem' 
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>Project / Repository</th>
                <th style={{ padding: '0.75rem' }}>Core Tech</th>
                <th style={{ padding: '0.75rem' }}>Domain</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <a href="https://github.com/Ri4ards2006/Traffic-Light" target="_blank" rel="noreferrer" style={{ color: '#00979D', fontWeight: 'bold', textDecoration: 'none' }}>
                    Traffic-Light
                  </a>
                </td>
                <td style={{ padding: '0.75rem' }}><code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>C</code> · <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>Arduino</code></td>
                <td style={{ padding: '0.75rem' }}>Embedded</td>
                <td style={{ padding: '0.75rem', color: '#238636' }}>✅ Done</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <a href="https://github.com/Ri4ards2006/Weather_Station2.0" target="_blank" rel="noreferrer" style={{ color: '#00979D', fontWeight: 'bold', textDecoration: 'none' }}>
                    WeatherStation 2.0
                  </a>
                </td>
                <td style={{ padding: '0.75rem' }}><code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>C++</code> · <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>IoT</code></td>
                <td style={{ padding: '0.75rem' }}>IoT / Sensors</td>
                <td style={{ padding: '0.75rem', color: '#1f6feb' }}>🔄 Active</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}>
                  <a href="https://github.com/Ri4ards2006/GO-CORE-LAB" target="_blank" rel="noreferrer" style={{ color: '#00979D', fontWeight: 'bold', textDecoration: 'none' }}>
                    GO-CORE-LAB
                  </a>
                </td>
                <td style={{ padding: '0.75rem' }}><code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>Go</code> · <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>Binaries</code></td>
                <td style={{ padding: '0.75rem' }}>Systems / RE</td>
                <td style={{ padding: '0.75rem', color: '#8b949e' }}>🔍 Researching</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}><strong>ETech-Signal-Plot-Lab</strong></td>
                <td style={{ padding: '0.75rem' }}><code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>Python</code> · <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>Flask</code></td>
                <td style={{ padding: '0.75rem' }}>Signal Processing</td>
                <td style={{ padding: '0.75rem', color: '#238636' }}>✅ Maintained</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}><strong>LoRA-RF-Demod-Lab</strong></td>
                <td style={{ padding: '0.75rem' }}><code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>FPGA</code> · <code style={{ background: '#21262d', padding: '2px 6px', borderRadius: '3px' }}>RF</code></td>
                <td style={{ padding: '0.75rem' }}>Digital Logic</td>
                <td style={{ padding: '0.75rem', color: '#d29922' }}>💡 Planned</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* GitHub Realtime Analytics Row */}
      <section className="about-section">
        <h2 className="about-section-title">📊 Forge Status & Metrics</h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '15px', 
          justifyContent: 'space-between',
          marginTop: '1rem'
        }}>
          <img 
            src="https://github-readme-stats.vercel.app/api?username=Ri4ards2006&show_icons=true&theme=dark&bg_color=0d1117&border_color=00979D&icon_color=00979D&title_color=00979D" 
            alt="GitHub Stats" 
            style={{ width: '49%', minWidth: '280px', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
          <img 
            src="https://github-readme-stats.vercel.app/api/top-langs/?username=Ri4ards2006&layout=compact&theme=dark&bg_color=0d1117&border_color=00979D&title_color=00979D" 
            alt="Top Languages" 
            style={{ width: '49%', minWidth: '280px', borderRadius: '4px', border: '1px solid var(--border)' }}
          />
        </div>
      </section>
    </main>
  );
}

export default Dev;