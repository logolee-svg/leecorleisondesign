import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import ContactOverlay from './ContactOverlay';

function Layout() {
  const [contactOpen, setContactOpen] = useState(false);

  const handleContactToggle = () => {
    setContactOpen((prev) => !prev);
  };

  return (
    <div className="frame">
      <nav className="top-nav">
        <Link to="/" className="lcd-logo-link">
          <img className="lcd-logo" src="/images/lcdlogo.svg" alt="Lee Corleison Design Logo" />
        </Link>
        <Link to="/" className="lcd-typography">
          Lee Corleison<br />Design
        </Link>
        <div className="lcd-nav-right">
          <button className="contact-btn" onClick={handleContactToggle}>
            {contactOpen ? 'Close' : 'Contact me'}
          </button>
        </div>
      </nav>
      {contactOpen ? <ContactOverlay /> : <Outlet />}
    </div>
  );
}

export default Layout;
