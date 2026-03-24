import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Lee Corleison Design';
const BASE_URL = 'https://leecorleison.com';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.png`;
const DEFAULT_DESCRIPTION =
  'Lee Corleison is a product architect working across brand design, product architecture, and full-stack engineering. Executive Creative Director at Paloma, ANZ\'s leading venture studio. Based in New Zealand.';

function setMetaTag(attribute, value, content) {
  let el = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute.replace(/^property$/, 'property').replace(/^name$/, 'name'), value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeJsonLd() {
  const existing = document.querySelectorAll('script[data-seo-jsonld]');
  existing.forEach((el) => el.remove());
}

function addJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-jsonld', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default function SEO({ title, description, path, type = 'website', structuredData }) {
  const location = useLocation();
  const currentPath = path || location.pathname;
  const fullUrl = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `Lee Corleison — Product Architect | Brand to Full Stack`;
  const pageDescription = description || DEFAULT_DESCRIPTION;

  useEffect(() => {
    // Title
    document.title = pageTitle;

    // Standard meta
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'author', 'Lee Corleison');
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Open Graph
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:url', fullUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', DEFAULT_IMAGE);
    setMetaTag('property', 'og:image:alt', 'Lee Corleison Design logo');
    setMetaTag('property', 'og:locale', 'en_NZ');

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', DEFAULT_IMAGE);
    setMetaTag('name', 'twitter:image:alt', 'Lee Corleison Design logo');

    // Canonical
    setLinkTag('canonical', fullUrl);

    // Structured Data
    removeJsonLd();
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        structuredData.forEach((data) => addJsonLd(data));
      } else {
        addJsonLd(structuredData);
      }
    }

    // Cleanup on unmount
    return () => {
      removeJsonLd();
    };
  }, [pageTitle, pageDescription, fullUrl, type, structuredData]);

  return null;
}

// ── Structured Data Generators ──────────────────────────────────────

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lee Corleison',
    url: BASE_URL,
    image: `${BASE_URL}/profile-compressed.jpg`,
    jobTitle: 'Executive Creative Director',
    description:
      'Product architect working across brand design, product architecture, and full-stack engineering. 20+ years experience shaping digital companies across Australasia.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NZ',
    },
    email: 'leecorleison@gmail.com',
    telephone: '+64273092926',
    sameAs: ['https://www.linkedin.com/in/lee-corleison-22bb8b106'],
    worksFor: {
      '@type': 'Organization',
      name: 'Paloma',
      url: 'https://palomagroup.com/',
      description: "ANZ's leading venture studio",
    },
    knowsAbout: [
      'Brand Design',
      'Product Architecture',
      'Full-Stack Engineering',
      'Identity Systems',
      'Digital Product Design',
      'Venture Studio',
      'UI/UX Design',
    ],
  };
}

export function getProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Lee Corleison Design',
    url: BASE_URL,
    image: DEFAULT_IMAGE,
    description:
      'Brand design, product architecture, and full-stack engineering services by Lee Corleison.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NZ',
    },
    founder: {
      '@type': 'Person',
      name: 'Lee Corleison',
    },
    areaServed: ['New Zealand', 'Australia', 'Australasia'],
    serviceType: [
      'Brand Design',
      'Product Architecture',
      'Full-Stack Engineering',
      'Identity Systems',
      'UI/UX Design',
      'Digital Product Development',
    ],
    priceRange: '$$$$',
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: 'Lee Corleison',
    },
  };
}

export function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getCreativeWorkSchema({ name, description, url, keywords }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    url,
    creator: {
      '@type': 'Person',
      name: 'Lee Corleison',
    },
    keywords,
  };
}

export function getPortfolioCollectionSchema({ name, description, works }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${BASE_URL}/${name.toLowerCase()}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: works.map((work, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: work.name,
          url: work.url,
          creator: {
            '@type': 'Person',
            name: 'Lee Corleison',
          },
        },
      })),
    },
  };
}
