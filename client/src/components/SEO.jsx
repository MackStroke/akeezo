import { useEffect } from 'react';

const DEFAULT_TITLE = "AKEEZO — Healthcare Journey Platform | Medical Tourism & Emergency Care in India";
const DEFAULT_DESCRIPTION = "Tell AKEEZO what you need and we plan the healthcare journey — hospital and doctor options, treatment cost estimates, travel and visa support, 24/7 emergency assistance and home healthcare across India.";
const DEFAULT_OG_IMAGE = "https://www.akeezo.com/images/medical_tourism_plan.webp";
const SITE_URL = "https://www.akeezo.com";

function setMetaTag(selector, attribute, attributeValue, content) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel, href) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    // Title
    const fullTitle = title ? `${title} | AKEEZO` : DEFAULT_TITLE;
    document.title = fullTitle;

    // Meta Description
    const metaDescription = description || DEFAULT_DESCRIPTION;
    setMetaTag('meta[name="description"]', 'name', 'description', metaDescription);

    // Robots Meta Tag
    const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsContent);

    // Canonical URL
    const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`) : SITE_URL;
    setLinkTag('canonical', canonicalUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', metaDescription);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage || DEFAULT_OG_IMAGE);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'AKEEZO');

    // Twitter Card
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', metaDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage || DEFAULT_OG_IMAGE);

    // JSON-LD Schema Markup
    let scriptElement = document.getElementById('akeezo-jsonld');
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'akeezo-jsonld';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd, null, 2);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Clean up JSON-LD on unmount if appropriate
    };
  }, [title, description, canonical, ogImage, ogType, noindex, jsonLd]);

  return null;
}
