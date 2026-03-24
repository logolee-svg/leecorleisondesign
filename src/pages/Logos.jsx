import SEO, {
  getBreadcrumbSchema,
  getPortfolioCollectionSchema,
} from '../components/SEO';

const ExternalLinkIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <path d="M1 7L7 1M7 1H2M7 1V6" />
  </svg>
);

const gridCards = [
  { src: '/images/-6.svg', alt: 'Geodde logo mark', link: 'https://geodde.com/', label: 'geodde.com' },
  { src: '/images/-5.svg', alt: 'Geodde logo wordmark', link: 'https://geodde.com/', label: 'geodde.com' },
  { src: '/images/-4.svg', alt: 'Tracksynk logo mark', link: 'https://tracksynk.com/', label: 'tracksynk.com' },
  { src: '/images/-3.svg', alt: 'Tracksynk logo wordmark', link: 'https://tracksynk.com/', label: 'tracksynk.com' },
  { src: '/images/-2.svg', alt: 'Klippr logo mark', link: 'https://klippr.ai/', label: 'klippr.ai' },
  { src: '/images/-1.svg', alt: 'Klippr logo wordmark', link: 'https://klippr.ai/', label: 'klippr.ai' },
  { src: '/images/1.svg', alt: 'Gondola logo mark', link: 'https://gogondola.com/', label: 'gogondola.com' },
  { src: '/images/2.svg', alt: 'Gondola logo wordmark', link: 'https://gogondola.com/', label: 'gogondola.com' },
  { src: '/images/3.svg', alt: 'Paloma logo mark', link: 'https://palomagroup.com/', label: 'palomagroup.com' },
  { src: '/images/4.svg', alt: 'Paloma logo wordmark', link: 'https://palomagroup.com/', label: 'palomagroup.com' },
  { src: '/images/5.svg', alt: 'Nextwork logo mark', link: 'https://www.nextwork.org/', label: 'nextwork.org' },
  { src: '/images/6.svg', alt: 'Nextwork logo wordmark', link: 'https://www.nextwork.org/', label: 'nextwork.org' },
  { src: '/images/27.svg', alt: 'Planna logo mark', link: 'https://www.yourplanna.com.au/', label: 'yourplanna.com.au' },
  { src: '/images/28.svg', alt: 'Planna logo wordmark', link: 'https://www.yourplanna.com.au/', label: 'yourplanna.com.au' },
  { src: '/images/14.svg', alt: 'Authsignal logo mark', link: 'https://authsignal.com/', label: 'authsignal.com' },
  { src: '/images/15.svg', alt: 'Authsignal logo wordmark', link: 'https://authsignal.com/', label: 'authsignal.com' },
  { src: '/images/7.svg', alt: 'Botallow logo mark', link: 'https://botallow.com/', label: 'botallow.com' },
  { src: '/images/8.svg', alt: 'Botallow logo wordmark', link: 'https://botallow.com/', label: 'botallow.com' },
  { src: '/images/17.svg', alt: 'Spinaway logo mark', link: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', label: 'bestawards.co.nz' },
  { src: '/images/18.svg', alt: 'Spinaway logo wordmark', link: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', label: 'bestawards.co.nz' },
  { src: '/images/9.svg', alt: 'Enjoy a Sipper logo mark', link: 'https://www.enjoyasipper.com/', label: 'enjoyasipper.com' },
  { src: '/images/10.svg', alt: 'Enjoy a Sipper logo wordmark', link: 'https://www.enjoyasipper.com/', label: 'enjoyasipper.com' },
  { src: '/images/23.svg', alt: 'Plerion logo mark', link: 'https://www.plerion.com/', label: 'plerion.com' },
  { src: '/images/24.svg', alt: 'Plerion logo wordmark', link: 'https://www.plerion.com/', label: 'plerion.com' },
  { src: '/images/11.svg', alt: 'Brand logo design' },
  { src: '/images/12.svg', alt: 'Brand logo design' },
  { src: '/images/13.svg', alt: 'Brand logo design' },
  { src: '/images/16.svg', alt: 'Brand logo design' },
  { src: '/images/19.svg', alt: 'Supahuman logo', link: 'https://www.supahuman.com/', label: 'supahuman.com' },
  { src: '/images/20.svg', alt: 'Brand logo design' },
  { src: '/images/21.svg', alt: 'Brand logo design' },
  { src: '/images/22.svg', alt: 'Brand logo design' },
  { src: '/images/25.svg', alt: 'Brand logo design' },
  { src: '/images/26.svg', alt: 'Brand logo design' },
  { src: '/images/29.svg', alt: 'Brand logo design' },
  { src: '/images/30.svg', alt: 'Brand logo design' },
  { src: '/images/31.svg', alt: 'Brand logo design' },
  { src: '/images/32.svg', alt: 'Brand logo design' },
  { src: '/images/33.svg', alt: 'Brand logo design' },
  { src: '/images/34.svg', alt: 'Brand logo design' },
];

const brandWorks = [
  { name: 'Geodde', url: 'https://geodde.com/' },
  { name: 'Tracksynk', url: 'https://tracksynk.com/' },
  { name: 'Klippr', url: 'https://klippr.ai/' },
  { name: 'Gondola', url: 'https://gogondola.com/' },
  { name: 'Paloma', url: 'https://palomagroup.com/' },
  { name: 'Nextwork', url: 'https://www.nextwork.org/' },
  { name: 'Planna', url: 'https://www.yourplanna.com.au/' },
  { name: 'Authsignal', url: 'https://authsignal.com/' },
  { name: 'Botallow', url: 'https://botallow.com/' },
  { name: 'Spinaway', url: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/' },
  { name: 'Enjoy a Sipper', url: 'https://www.enjoyasipper.com/' },
  { name: 'Plerion', url: 'https://www.plerion.com/' },
  { name: 'Supahuman', url: 'https://www.supahuman.com/' },
];

function Logos() {
  return (
    <>
      <SEO
        title="Brand Design Portfolio"
        description="Brand identity, logo design, and visual identity systems by Lee Corleison. Logos and brand systems for Geodde, Tracksynk, Klippr, Gondola, Paloma, Authsignal, and more across fintech, SaaS, and consumer platforms."
        path="/brand"
        structuredData={[
          getBreadcrumbSchema([
            { name: 'Home', url: 'https://leecorleison.com' },
            { name: 'Brand', url: 'https://leecorleison.com/brand' },
          ]),
          getPortfolioCollectionSchema({
            name: 'Brand',
            description:
              'Brand identity and logo design portfolio by Lee Corleison, featuring work for venture-backed startups and established companies across Australasia.',
            works: brandWorks,
          }),
        ]}
      />
      <section className="grid-container" id="gridContainer" aria-label="Brand design portfolio">
        <h1 className="sr-only">Brand Design Portfolio — Logo and Identity Systems by Lee Corleison</h1>
        {gridCards.map((card, i) => (
          <article className="grid-card" key={i}>
            <img src={card.src} alt={card.alt} loading={i < 8 ? 'eager' : 'lazy'} />
            {card.link && (
              <a className="card-link" href={card.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${card.label}`}>
                {card.label} <ExternalLinkIcon />
              </a>
            )}
          </article>
        ))}
      </section>
      <nav className="bottom-nav" aria-label="Brand page navigation" />
    </>
  );
}

export default Logos;
