const ArrowIcon = () => (
  <svg className="product-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <div className="product-container">
      <ul className="product-list">
        {products.map((product, i) => (
          <li className="product-item" key={i}>
            <a href={product.href} target="_blank" rel="noopener">
              <span className="product-name">{product.name}</span>
              <ArrowIcon />
              <div className="product-preview">
                <img src={product.preview} alt={`${product.name} preview`} loading="lazy" />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Product;
