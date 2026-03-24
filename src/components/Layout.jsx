import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ContactOverlay from './ContactOverlay';

function Layout() {
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();

  const handleContactToggle = () => {
    setContactOpen((prev) => !prev);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setContactOpen(false);
    navigate('/');
  };

  return (
    <div className="frame">
      <header>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="/" className="lcd-logo-link" onClick={handleLogoClick} aria-label="Lee Corleison Design — Home">
            <img className="lcd-logo" src="/images/lcdlogo.svg" alt="Lee Corleison Design Logo" width="40" height="40" />
          </a>
          <a href="/" className="lcd-typography" onClick={handleLogoClick} aria-label="Lee Corleison Design — Home">
            Lee Corleison<br />Design
          </a>
          <div className="lcd-nav-right">
            <button
              className="contact-btn"
              onClick={handleContactToggle}
              aria-expanded={contactOpen}
              aria-label={contactOpen ? 'Close contact panel' : 'Open contact panel'}
            >
              {contactOpen ? 'Close' : 'Contact me'}
            </button>
          </div>
        </nav>
      </header>
      <main>
        {contactOpen ? <ContactOverlay /> : <Outlet />}
      </main>
    </div>
  );
}

export default Layout;
