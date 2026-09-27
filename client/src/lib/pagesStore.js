const PAGES_STORAGE_KEY = 'akeezo_pages';

export const DEFAULT_PAGES = [
  {
    id: 'page_about',
    title: 'About Akeezo',
    slug: 'about',
    content: `## Who We Are

Akeezo is a leading healthcare facilitator connecting patients from around the globe with top-tier hospitals and expert doctors. Our mission is to provide seamless, end-to-end medical journeys that prioritize patient care, transparency, and clinical excellence.

### Our Mission
To democratize access to world-class healthcare by breaking down geographical and logistical barriers for patients seeking advanced medical treatments.

### Our Services
- **Hospital Discovery:** Access to a curated network of JCI and NABH accredited hospitals.
- **Doctor Consultations:** Connect with leading specialists across cardiology, oncology, orthopedics, and more.
- **Medical Visa Assistance:** Comprehensive support for international travel and documentation.
- **24/7 Support:** Dedicated care coordinators available around the clock.

At Akeezo, your health is our priority. Let us guide you on your journey to recovery.
`,
    seoDescription: 'Learn more about Akeezo, your trusted healthcare facilitator for medical tourism and patient care.',
    status: 'Published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'page_contact',
    title: 'Contact Us',
    slug: 'contact',
    content: `## Get In Touch

Our dedicated Care Team is available 24/7 to assist you with any medical inquiries, hospital coordination, or emergency support.

### Emergency Contact
For immediate medical assistance, please contact our 24/7 Emergency Dispatch:
**Phone:** +91 999 999 9999

### General Inquiries
For general questions about our services, medical packages, or to schedule a consultation:
**Email:** care@akeezo.com
**Phone:** +91 888 888 8888

### Corporate Office
Akeezo Healthcare Headquarters
123 Health Avenue, Medical District
New Delhi, India 110001

We aim to respond to all non-emergency inquiries within 2 hours.
`,
    seoDescription: 'Contact Akeezo for medical inquiries, hospital coordination, and emergency support.',
    status: 'Published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function getStoredPages() {
  try {
    const raw = localStorage.getItem(PAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(DEFAULT_PAGES));
      return DEFAULT_PAGES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing pages from localStorage', err);
    return DEFAULT_PAGES;
  }
}

export function getPageBySlug(slug) {
  const pages = getStoredPages();
  return pages.find((p) => p.slug === slug);
}

export function savePage(page) {
  const pages = getStoredPages();
  const index = pages.findIndex((p) => p.id === page.id);
  
  if (index >= 0) {
    pages[index] = { ...pages[index], ...page, updatedAt: new Date().toISOString() };
  } else {
    pages.unshift({
      ...page,
      id: `page_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
  return pages;
}

export function deletePage(id) {
  const pages = getStoredPages().filter((p) => p.id !== id);
  localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
  return pages;
}

export function togglePageStatus(id) {
  const pages = getStoredPages();
  const page = pages.find((p) => p.id === id);
  if (page) {
    page.status = page.status === 'Published' ? 'Draft' : 'Published';
    page.updatedAt = new Date().toISOString();
    localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages));
  }
  return pages;
}
