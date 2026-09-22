import { useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';

export default function SEOManager() {
  const { config, isLoading } = useConfig();

  useEffect(() => {
    if (isLoading) return;

    // 1. Google Site Verification Meta Tag
    if (config.googleSiteVerification) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        document.head.appendChild(meta);
      }
      meta.content = config.googleSiteVerification;
    }

    // 2. Google Tag Manager (GTM) Script
    if (config.gtmId) {
      const gtmScriptId = 'gtm-script';
      if (!document.getElementById(gtmScriptId)) {
        const script = document.createElement('script');
        script.id = gtmScriptId;
        script.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${config.gtmId}');
        `;
        document.head.insertBefore(script, document.head.firstChild);

        // Add GTM noscript iframe to body
        const noscriptId = 'gtm-noscript';
        if (!document.getElementById(noscriptId)) {
          const noscript = document.createElement('noscript');
          noscript.id = noscriptId;
          const iframe = document.createElement('iframe');
          iframe.src = `https://www.googletagmanager.com/ns.html?id=${config.gtmId}`;
          iframe.height = "0";
          iframe.width = "0";
          iframe.style.display = "none";
          iframe.style.visibility = "hidden";
          noscript.appendChild(iframe);
          document.body.insertBefore(noscript, document.body.firstChild);
        }
      }
    }

  }, [config, isLoading]);

  return null; // This component doesn't render anything visible
}
