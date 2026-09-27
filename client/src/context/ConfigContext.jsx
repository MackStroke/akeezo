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
    googleSiteVerification: '',
    homeServices: ['Nurse', 'Caregiver / attendant', 'Physiotherapist', 'Doctor home visit', 'Post-operative care', 'Elder care', 'Palliative care', 'Home diagnostics'],
    emergencyPlaceTypes: ['Home', 'Hotel', 'Airport', 'Railway station', 'Office', 'Road / in transit', 'Somewhere else'],
    emergencyProblems: ['Accident', 'Chest pain', 'Difficulty breathing', 'Unconscious', 'Severe bleeding', 'Stroke symptoms', 'Seizure', 'Severe allergic reaction', 'Burn', 'Poisoning', 'Pregnancy-related emergency', 'Fall or injury', 'Fever or illness', 'Other', "I don't know"],
    medicinesContent: { heroTitle: 'Medicines & Supplements', heroSubtitle: 'Upload your prescription or let us know what you need.', banners: [], offers: [] },
    homeContent: { whyUsTitle: 'Why Us', whyUsDescription: 'Akeezo is your trusted home care partner which helps you experience the best medical care in the comfort of your home. We understand you and ensure the highest standard of personalized healthcare at your doorstep.', whyUsCards: [] }
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
            homeServices: data.data.homeServices?.length > 0 ? data.data.homeServices : prev.homeServices,
            emergencyPlaceTypes: data.data.emergencyPlaceTypes?.length > 0 ? data.data.emergencyPlaceTypes : prev.emergencyPlaceTypes,
            emergencyProblems: data.data.emergencyProblems?.length > 0 ? data.data.emergencyProblems : prev.emergencyProblems,
            gtmId: data.data.gtmId || '',
            googleSiteVerification: data.data.googleSiteVerification || '',
            medicinesContent: data.data.medicinesContent || prev.medicinesContent,
            homeContent: data.data.homeContent || prev.homeContent
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
