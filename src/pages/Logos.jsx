const ExternalLinkIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M1 7L7 1M7 1H2M7 1V6" />
  </svg>
);

const gridCards = [
  { src: '/images/-6.svg', alt: 'Logo -6', link: 'https://geodde.com/', label: 'geodde.com' },
  { src: '/images/-5.svg', alt: 'Logo -5', link: 'https://geodde.com/', label: 'geodde.com' },
  { src: '/images/-4.svg', alt: 'Logo -4', link: 'https://tracksynk.com/', label: 'tracksynk.com' },
  { src: '/images/-3.svg', alt: 'Logo -3', link: 'https://tracksynk.com/', label: 'tracksynk.com' },
  { src: '/images/-2.svg', alt: 'Logo -2', link: 'https://klippr.ai/', label: 'klippr.ai' },
  { src: '/images/-1.svg', alt: 'Logo -1', link: 'https://klippr.ai/', label: 'klippr.ai' },
  { src: '/images/1.svg', alt: 'Logo 1', link: 'https://gogondola.com/', label: 'gogondola.com' },
  { src: '/images/2.svg', alt: 'Logo 2', link: 'https://gogondola.com/', label: 'gogondola.com' },
  { src: '/images/3.svg', alt: 'Logo 3', link: 'https://palomagroup.com/', label: 'palomagroup.com' },
  { src: '/images/4.svg', alt: 'Logo 4', link: 'https://palomagroup.com/', label: 'palomagroup.com' },
  { src: '/images/5.svg', alt: 'Logo 5', link: 'https://www.nextwork.org/', label: 'nextwork.org' },
  { src: '/images/6.svg', alt: 'Logo 6', link: 'https://www.nextwork.org/', label: 'nextwork.org' },
  { src: '/images/27.svg', alt: 'Logo 27', link: 'https://www.yourplanna.com.au/', label: 'yourplanna.com.au' },
  { src: '/images/28.svg', alt: 'Logo 28', link: 'https://www.yourplanna.com.au/', label: 'yourplanna.com.au' },
  { src: '/images/14.svg', alt: 'Logo 14', link: 'https://authsignal.com/', label: 'authsignal.com' },
  { src: '/images/15.svg', alt: 'Logo 15', link: 'https://authsignal.com/', label: 'authsignal.com' },
  { src: '/images/7.svg', alt: 'Logo 7', link: 'https://botallow.com/', label: 'botallow.com' },
  { src: '/images/8.svg', alt: 'Logo 8', link: 'https://botallow.com/', label: 'botallow.com' },
  { src: '/images/17.svg', alt: 'Logo 17', link: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', label: 'bestawards.co.nz' },
  { src: '/images/18.svg', alt: 'Logo 18', link: 'https://bestawards.co.nz/digital/digital-products/paloma/spinaway/', label: 'bestawards.co.nz' },
  { src: '/images/9.svg', alt: 'Logo 9', link: 'https://www.enjoyasipper.com/', label: 'enjoyasipper.com' },
  { src: '/images/10.svg', alt: 'Logo 10', link: 'https://www.enjoyasipper.com/', label: 'enjoyasipper.com' },
  { src: '/images/23.svg', alt: 'Logo 23', link: 'https://www.plerion.com/', label: 'plerion.com' },
  { src: '/images/24.svg', alt: 'Logo 24', link: 'https://www.plerion.com/', label: 'plerion.com' },
  { src: '/images/11.svg', alt: 'Logo 11' },
  { src: '/images/12.svg', alt: 'Logo 12' },
  { src: '/images/13.svg', alt: 'Logo 13' },
  { src: '/images/16.svg', alt: 'Logo 16' },
  { src: '/images/19.svg', alt: 'Logo 19', link: 'https://www.supahuman.com/', label: 'supahuman.com' },
  { src: '/images/20.svg', alt: 'Logo 20' },
  { src: '/images/21.svg', alt: 'Logo 21' },
  { src: '/images/22.svg', alt: 'Logo 22' },
  { src: '/images/25.svg', alt: 'Logo 25' },
  { src: '/images/26.svg', alt: 'Logo 26' },
  { src: '/images/29.svg', alt: 'Logo 29' },
  { src: '/images/30.svg', alt: 'Logo 30' },
  { src: '/images/31.svg', alt: 'Logo 31' },
  { src: '/images/32.svg', alt: 'Logo 32' },
  { src: '/images/33.svg', alt: 'Logo 33' },
  { src: '/images/34.svg', alt: 'Logo 34' },
];

function Logos() {
  return (
    <>
      <div className="grid-container" id="gridContainer">
        {gridCards.map((card, i) => (
          <div className="grid-card" key={i}>
            <img src={card.src} alt={card.alt} />
            {card.link && (
              <a className="card-link" href={card.link} target="_blank" rel="noopener">
                {card.label} <ExternalLinkIcon />
              </a>
            )}
          </div>
        ))}
      </div>
      <nav className="bottom-nav" />
    </>
  );
}

export default Logos;
