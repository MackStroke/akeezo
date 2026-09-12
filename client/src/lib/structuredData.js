import { site, faqs, cities } from './site.js';

/**
 * JSON-LD for the landing page.
 *
 * Rules followed: absolute URLs only, no fabricated values (no aggregateRating
 * or review counts — AKEEZO has no verified reviews yet, and inventing them on
 * a healthcare site would be both a policy violation and a trust problem),
 * optional fields omitted rather than left empty.
 *
 * Validate changes with https://search.google.com/test/rich-results
 */
export function buildStructuredData() {
  const organization = {
    '@type': ['Organization', 'MedicalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/favicon.svg`,
    description: site.description,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    availableLanguage: ['English', 'Hindi', 'Arabic', 'French', 'Swahili', 'Russian'],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.emergencyPhone,
        contactType: 'emergency',
        availableLanguage: ['English', 'Hindi'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
      {
        '@type': 'ContactPoint',
        telephone: site.emergencyPhone,
        email: site.email,
        contactType: 'customer service',
      },
    ],
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { '@id': `${site.url}/#organization` },
    inLanguage: 'en',
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${site.url}/#webpage`,
    url: `${site.url}/`,
    name: `${site.name} — Healthcare Journey Platform`,
    description: site.description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#organization` },
  };

  // The three entry points, described as the services they are.
  const services = {
    '@type': 'ItemList',
    '@id': `${site.url}/#services`,
    name: 'AKEEZO services',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Service',
          name: 'Medical tourism coordination',
          description:
            'Hospital and doctor options, itemised treatment cost estimates, appointment coordination, medical visa documentation support, travel, accommodation and recovery planning for patients travelling to India for treatment.',
          provider: { '@id': `${site.url}/#organization` },
          areaServed: cities.map((name) => ({ '@type': 'City', name })),
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Service',
          name: '24/7 emergency healthcare assistance',
          description:
            'Emergency coordination for patients, families, hotels, airports and corporates — ambulance and emergency medical response, receiving-hospital identification, admission coordination and family updates.',
          provider: { '@id': `${site.url}/#organization` },
        },
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'Service',
          name: 'Home healthcare',
          description:
            'Nurses, caregivers, patient attendants, physiotherapy, doctor home visits, post-operative care, elder care and home diagnostics.',
          provider: { '@id': `${site.url}/#organization` },
        },
      },
    ],
  };

  // Built from the FAQ actually rendered on the page — Google requires the
  // markup to match visible content.
  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${site.url}/#faq`,
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, webPage, services, faqPage],
  };
}
