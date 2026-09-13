import { useState, useEffect } from 'react';

const STORAGE_KEY = 'akeezo_social_settings';

export const DEFAULT_SOCIAL_LINKS = [
  {
    id: 'facebook',
    name: 'Facebook',
    enabled: true,
    url: 'https://facebook.com/akeezohealth',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    enabled: true,
    url: 'https://instagram.com/akeezohealth',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    enabled: true,
    url: 'https://x.com/akeezohealth',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    enabled: true,
    url: 'https://linkedin.com/company/akeezo',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    enabled: true,
    url: 'https://youtube.com/@akeezohealth',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    enabled: true,
    url: 'https://wa.me/918287639443?text=Hello%20AKEEZO',
  },
];

export function getSocialLinks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load social links from localStorage', err);
  }
  return DEFAULT_SOCIAL_LINKS;
}

export function saveSocialLinks(links) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new Event('akeezo_social_updated'));
  } catch (err) {
    console.error('Failed to save social links', err);
  }
}

export function useSocialLinks() {
  const [links, setLinks] = useState(getSocialLinks);

  useEffect(() => {
    const handleUpdate = () => {
      setLinks(getSocialLinks());
    };

    window.addEventListener('akeezo_social_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('akeezo_social_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return links;
}
