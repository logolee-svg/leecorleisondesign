import { useState } from 'react';
import SplitText from '../components/SplitText';
import SEO, {
  getBreadcrumbSchema,
  getPortfolioCollectionSchema,
} from '../components/SEO';

const ArrowIcon = () => (
  <svg className="product-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M1 13L13 1M13 1H4M13 1V10" />
  </svg>
);

const products = [
  { name: 'Tracksynk', href: 'https://tracksynk.com/', preview: '/images/previews/tracksynk.png', logo: '/images/-3.svg', description: 'Brand Design | Product Design | Strategy | Full Stack Engineering' },
  { name: 'Geodde', href: 'https://geodde.com/', preview: '/images/previews/geodde.png', logo: '/images/-5.svg', description: 'Brand Strategy | Brand Design' },
  { name: 'Klippr', href: 'https://klippr.ai/', preview: '/images/previews/klippr.png', logo: '/images/-1.svg', description: 'Brand Strategy | Brand Design | Web Design | Web Development' },
  { name: 'Gondola', href: 'https://gogondola.com/', preview: '/images/previews/gogondola.png', logo: '/images/2.svg', description: 'Brand Strategy | Brand Design | Website Development Strategy' },
  { name: 'Paloma', href: 'https://palomagroup.com/', preview: '/images/previews/palomagroup.png', logo: '/images/4.svg', description: 'Brand Design | Brand Strategy | Web Strategy | Website Development' },
  { name: 'Planna', href: 'https://www.yourplanna.com.au/', preview: '/images/previews/yourplanna.png', logo: '/images/28.svg', description: 'Brand Strategy | Brand Design | Web Design' },
  { name: 'Authsignal', href: 'https://authsignal.com/', preview: '/images/previews/authsignal.png', logo: '/images/15.svg', description: 'Brand Design | Product Design | Strategy' },
  { name: 'Botallow', href: 'https://botallow.com/', preview: '/images/previews/botallow.png', logo: '/images/8.svg', description: 'Brand Design | Product Design' },
  { name: 'Spinaway', href: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', preview: '/images/previews/spinaway.png', logo: '/images/18.svg', description: 'Brand Design | Product Design' },
  { name: 'Enjoy a Sipper', href: 'https://www.enjoyasipper.com/', preview: '/images/previews/enjoyasipper.png', logo: '/images/10.svg', description: 'Brand Design | Product Design' },
];

function ProductItem({ product, children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="product-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <a href={product.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${product.name} product`}>
        <span className="product-name">{product.name}</span>
        {product.description && (
          <span className="product-description">
            {hovered ? (
              <SplitText
                text={product.description}
                className="product-description-text"
                tag="span"
                delay={40}
                duration={0.4}
                startDelay={0}
                splitType="words"
                from={{ opacity: 0, y: 8 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
              />
            ) : null}
          </span>
        )}
        {children}
      </a>
    </li>
  );
}

function Product() {
  return (
    <>
      <SEO
        title="Product Architecture Portfolio"
        description="Digital product architecture and full-stack engineering by Lee Corleison. Products designed and built for venture-backed startups including Tracksynk, Geodde, Klippr, Gondola, Paloma, Authsignal, and more."
        path="/product"
        structuredData={[
          getBreadcrumbSchema([
            { name: 'Home', url: 'https://leecorleison.com' },
            { name: 'Product', url: 'https://leecorleison.com/product' },
          ]),
          getPortfolioCollectionSchema({
            name: 'Product',
            description:
              'Product architecture portfolio by Lee Corleison. Digital products designed and engineered across fintech, healthtech, proptech, SaaS, and consumer platforms.',
            works: products.map((p) => ({ name: p.name, url: p.href })),
          }),
        ]}
      />
      <section className="product-container" aria-label="Product architecture portfolio">
        <h1 className="sr-only">Product Architecture Portfolio — Digital Products by Lee Corleison</h1>
        <ul className="product-list" role="list">
          {products.map((product, i) => (
            <ProductItem key={i} product={product}>
                <ArrowIcon />
                <div className="product-preview" aria-hidden="true">
                  <img src={product.preview} alt={`${product.name} product screenshot`} loading="lazy" />
                </div>
            </ProductItem>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Product;
