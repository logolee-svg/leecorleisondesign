import { Link } from 'react-router-dom';
import OrbitImages from '../components/OrbitImages';

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
    <div className="hero-container" id="heroContainer">
      <div className="hero-links">
        <Link to="/brand" className="hero-link">
          <span className="hero-link-text">Brand.</span>
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
        <Link to="/product" className="hero-link">
          <span className="hero-link-text">Product.</span>
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
        <Link to="/consult" className="hero-link">
          <span className="hero-link-text">Consult.</span>
          <div className="hero-link-preview" />
        </Link>
      </div>
      <p className="hero-intro">Product architect from brand to full stack engineer.</p>
    </div>
  );
}

export default Home;
