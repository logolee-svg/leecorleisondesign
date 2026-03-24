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
  { name: 'Tracksynk', href: 'https://tracksynk.com/', preview: '/images/previews/tracksynk.png' },
  { name: 'Geodde', href: 'https://geodde.com/', preview: '/images/previews/geodde.png' },
  { name: 'Klippr', href: 'https://klippr.ai/', preview: '/images/previews/klippr.png' },
  { name: 'Gondola', href: 'https://gogondola.com/', preview: '/images/previews/gogondola.png' },
  { name: 'Paloma', href: 'https://palomagroup.com/', preview: '/images/previews/palomagroup.png' },
  { name: 'Planna', href: 'https://www.yourplanna.com.au/', preview: '/images/previews/yourplanna.png' },
  { name: 'Authsignal', href: 'https://authsignal.com/', preview: '/images/previews/authsignal.png' },
  { name: 'Botallow', href: 'https://botallow.com/', preview: '/images/previews/botallow.png' },
  { name: 'Spinaway', href: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', preview: '/images/previews/spinaway.png' },
  { name: 'Enjoy a Sipper', href: 'https://www.enjoyasipper.com/', preview: '/images/previews/enjoyasipper.png' },
];

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
            <li className="product-item" key={i}>
              <a href={product.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${product.name} product`}>
                <span className="product-name">{product.name}</span>
                <ArrowIcon />
                <div className="product-preview" aria-hidden="true">
                  <img src={product.preview} alt={`${product.name} product screenshot`} loading="lazy" />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Product;
