import { Link } from 'react-router-dom';
import OrbitImages from '../components/OrbitImages';
import SplitText from '../components/SplitText';
import SEO, {
  getPersonSchema,
  getProfessionalServiceSchema,
  getWebSiteSchema,
} from '../components/SEO';

const orbitLogos = [
  '/images/1.svg',
  '/images/3.svg',
  '/images/5.svg',
  '/images/7.svg',
  '/images/9.svg',
  '/images/14.svg',
  '/images/17.svg',
  '/images/19.svg',
  '/images/23.svg',
  '/images/27.svg',
  '/images/-1.svg',
  '/images/-4.svg',
];

const orbitScreenshots = [
  '/images/previews/tracksynk.png',
  '/images/previews/palomagroup.png',
  '/images/previews/geodde.png',
  '/images/previews/botallow.png',
  '/images/previews/yourplanna.png',
  '/images/previews/authsignal.png',
];

function Home() {
  return (
    <>
      <SEO
        path="/"
        description="Lee Corleison is a product architect working across brand design, product architecture, and full-stack engineering. Executive Creative Director at Paloma, ANZ's leading venture studio. Based in New Zealand."
        structuredData={[
          getPersonSchema(),
          getProfessionalServiceSchema(),
          getWebSiteSchema(),
        ]}
      />
      <div className="hero-container" id="heroContainer" role="main">
        <nav className="hero-links" aria-label="Portfolio sections">
          <Link to="/brand" className="hero-link" aria-label="View brand design portfolio">
            <SplitText
              text="Brand."
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
            <div className="hero-link-preview" aria-hidden="true">
              <OrbitImages
                images={orbitLogos}
                shape="ellipse"
                radiusX={500}
                radiusY={180}
                baseWidth={1200}
                duration={30}
                itemSize={55}
                rotation={-6}
                responsive={true}
              />
            </div>
          </Link>
          <Link to="/product" className="hero-link" aria-label="View product architecture portfolio">
            <SplitText
              text="Product."
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
            <div className="hero-link-preview" aria-hidden="true">
              <OrbitImages
                images={orbitScreenshots}
                shape="ellipse"
                radiusX={500}
                radiusY={180}
                baseWidth={1200}
                duration={30}
                itemSize={240}
                rotation={-6}
                responsive={true}
              />
            </div>
          </Link>
          <Link to="/consult" className="hero-link" aria-label="Learn about consulting services and availability">
            <SplitText
              text="Consult."
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
            <div className="hero-link-preview" />
          </Link>
        </nav>
        <SplitText
          text="Product architect from brand to full stack engineer."
          className="hero-intro"
          tag="p"
          delay={20}
          duration={0.6}
          startDelay={1.5}
          splitType="words"
          from={{ opacity: 0, y: 15 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="left"
        />
      </div>
    </>
  );
}

export default Home;
