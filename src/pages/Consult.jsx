import SEO, {
  getPersonSchema,
  getProfessionalServiceSchema,
  getBreadcrumbSchema,
} from '../components/SEO';

function Consult() {
  return (
    <>
      <SEO
        title="Consulting — Hire Lee Corleison"
        description="Hire Lee Corleison for brand design, product architecture, and full-stack engineering. 20+ years experience as Executive Creative Director at Paloma, ANZ's leading venture studio. Original designer of the early Afterpay app. Based in New Zealand, available for consulting."
        path="/consult"
        structuredData={[
          getPersonSchema(),
          getProfessionalServiceSchema(),
          getBreadcrumbSchema([
            { name: 'Home', url: 'https://leecorleison.com' },
            { name: 'Consult', url: 'https://leecorleison.com/consult' },
          ]),
        ]}
      />
      <section className="consult-container" aria-label="About Lee Corleison and consulting services">
        <div className="consult-bio">
          <h1 className="sr-only">Lee Corleison — Product Architect, Brand Designer, Full-Stack Engineer</h1>
          <p>
            <strong>Lee Corleison</strong> is a product architect who works across brand, product
            design, and full-stack engineering, from identity systems through to production software.
          </p>
          <p>
            Over twenty years he has shaped digital companies across Australasia. As Executive Creative
            Director and shareholder at Paloma, ANZ's leading venture studio, he led brand and product
            design across a venture portfolio now valued north of AUD $500 million, spanning fintech,
            healthtech, proptech, SaaS, and consumer platforms. He was the original product designer of
            the early Afterpay app experience during its rapid growth phase. Earlier work at Carnival
            Labs included mobile products for Air New Zealand, DreamWorks, Kraft Foods, MAC Cosmetics,
            and AB InBev.
          </p>
          <p>
            Lee treats brand as architecture, a structural input that shapes product decisions, not a
            layer applied afterwards. Today he works directly with founders and teams on brand design,
            product architecture, and full-stack development, bringing the same end-to-end thinking to
            client work that built{' '}
            <a
              href="https://tracksynk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="consult-link"
            >
              Tracksynk
            </a>
            ,{' '}
            <a
              href="https://palomagroup.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="consult-link"
            >
              Paloma
            </a>
            {' '}and many others.
          </p>
          <address className="consult-contact">
            <a href="mailto:leecorleison@gmail.com" aria-label="Email Lee Corleison">leecorleison@gmail.com</a>
            <a href="tel:+64273092926" aria-label="Call Lee Corleison">027 309 2926</a>
          </address>
        </div>
        <div className="consult-profile">
          <img src="/profile-compressed.jpg" alt="Lee Corleison — Product Architect and Brand Designer based in New Zealand" width="400" height="400" />
        </div>
      </section>
    </>
  );
}

export default Consult;
