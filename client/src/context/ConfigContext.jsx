import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cities as defaultCities } from '../lib/site';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    maintenancePages: [],
    cities: defaultCities,
    countries: ['India', 'UAE', 'Kenya', 'Nigeria', 'Bangladesh', 'Oman'],
    gtmId: '',
    googleSiteVerification: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.data) {
          setConfig(prev => ({
            ...prev,
            maintenancePages: data.data.maintenancePages || [],
            cities: data.data.cities?.length > 0 ? data.data.cities : prev.cities,
            countries: data.data.countries?.length > 0 ? data.data.countries : prev.countries,
            gtmId: data.data.gtmId || '',
            googleSiteVerification: data.data.googleSiteVerification || ''
          }));
        }
      })
      .catch(err => console.error('Failed to fetch site config', err))
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

  return (
    <ConfigContext.Provider value={{ config, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
