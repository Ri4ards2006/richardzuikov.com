import React, { useState, useRef, useEffect } from 'react';

function Terminal() {
  const [history, setHistory] = useState([
    { text: 'Richard OS v1.0.0 (Ashen-Kernel)', type: 'system' },
    { text: 'Tippe "help" für eine Liste aller verfügbaren Befehle.', type: 'system' },
    { text: '', type: 'spacer' }
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef(null);

  // Automatisches Scrollen nach unten bei neuer Ausgabe
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const trimmedInput = input.trim().toLowerCase();
      let response = [];

      if (trimmedInput !== '') {
        response.push({ text: `richard@flensburg:~$ ${input}`, type: 'user' });

        switch (trimmedInput) {
          case 'help':
            response.push({ text: 'Verfügbare Befehle: help, lore, skills, clear, neofetch', type: 'output' });
            break;
          case 'lore':
            response.push({ text: 'Richard Zuikov - SL 19 Embedded Developer & Linux Guardian in Flensburg.', type: 'output' });
            break;
          case 'skills':
            response.push({ text: 'C++ · Go · C · Linux · Docker · Microcontroller (ESP32/STM32) · KiCad', type: 'output' });
            break;
          case 'neofetch':
            response.push({ text: '   /\\_/\\      OS: Arch Linux x86_64', type: 'output' });
            response.push({ text: '  ( o.o )     Kernel: 6.8.9-arch1-1', type: 'output' });
            response.push({ text: '   > ^ <      Shell: bash 5.2.26', type: 'output' });
            response.push({ text: '  /     \\     Location: Flensburg, DE', type: 'output' });
            break;
          case 'clear':
            setHistory([]);
            setInput('');
            return;
          default:
            response.push({ text: `Befehl nicht gefunden: ${input}. Versuche "help".`, type: 'error' });
        }
      }

      setHistory([...history, ...response]);
      setInput('');
    }
  };

  return (
    <div className="terminal-window" onClick={() => document.getElementById('term-input').focus()}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="t-btn close"></span>
          <span className="t-btn minimize"></span>
          <span className="t-btn maximize"></span>
        </div>
        <div className="terminal-title">bash - richard@flensburg</div>
      </div>
      <div className="terminal-body">
        {history.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}
        <div className="terminal-input-row">
          <span className="terminal-prompt">richard@flensburg:~$</span>
          <input
            id="term-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}

export default Terminal;