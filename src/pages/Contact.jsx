import React from 'react';

function Contact() {
  return (
    <main className="page-main contact-main">
      <div className="page-header">
        <h1 className="page-title">Contact</h1>
      </div>
      
      <div className="contact-layout">
        {/* Linke Seite: Big Typography */}
        <div className="contact-left">
          <h2 className="contact-big">
            Let's work<br />
            <em>together.</em>
          </h2>
          <p className="contact-sub">
            Open for projects, repairs, and interesting conversations about hardware, software, and everything in between.
          </p>
          <a href="mailto:richardzuikov@gmail.com" className="contact-email-link">
            richardzuikov@gmail.com
          </a>
        </div>

        {/* Rechte Seite: Info-Blöcke */}
        <div className="contact-right">
          <div className="contact-info-block">
            <span className="info-label">Location</span>
            <span className="info-value">Flensburg, Germany</span>
          </div>
          
          <div className="contact-info-block">
            <span className="info-label">Email</span>
            <a href="mailto:richardzuikov@gmail.com" className="info-value link">
              richardzuikov@gmail.com
            </a>
          </div>
          
          <div className="contact-info-block">
            <span className="info-label">Phone</span>
            <a href="tel:" className="info-value link">
              +49 (Pls Contact me)
            </a>
          </div>
          
          <div className="contact-info-block">
            <span className="info-label">GitHub</span>
            <a href="https://github.com/Ri4ards2006" className="info-value link" target="_blank" rel="noreferrer">
              Ri4ards2006
            </a>
          </div>
          
          <div className="contact-info-block">
            <span className="info-label">LinkedIn</span>
            <a href="https://www.linkedin.com/in/richard-zuikov-526745343" className="info-value link" target="_blank" rel="noreferrer">
              Richard Zuikov
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;