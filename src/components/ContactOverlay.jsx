import SplitText from './SplitText';

function ContactOverlay() {
  return (
    <div className="hero-container">
      <div className="hero-links">
        <a href="mailto:leecorleison@gmail.com" className="hero-link">
          <SplitText
            text="leecorleison@gmail.com"
            className="hero-link-text"
            tag="span"
            delay={30}
            duration={0.8}
            startDelay={0}
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />
        </a>
        <a href="tel:+64273092926" className="hero-link">
          <SplitText
            text="027 309 2926"
            className="hero-link-text"
            tag="span"
            delay={30}
            duration={0.8}
            startDelay={0.5}
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />
        </a>
        <a href="https://www.linkedin.com/in/lee-corleison-22bb8b106" target="_blank" rel="noopener" className="hero-link">
          <SplitText
            text="LinkedIn"
            className="hero-link-text"
            tag="span"
            delay={30}
            duration={0.8}
            startDelay={1}
            splitType="chars"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="left"
          />
        </a>
      </div>
    </div>
  );
}

export default ContactOverlay;
