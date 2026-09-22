import { useState, useEffect } from 'react';
import { MapPin, Globe, Save, Loader2, Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';

export default function LocationsAdminPage() {
  const { token } = useAuth();
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [newCountry, setNewCountry] = useState('');

  useEffect(() => {
    fetchConfig();
  }, [token]);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.data);
        
        // If DB doesn't have cities yet, initialize with default from site.js
        const defaultCities = ['Delhi NCR', 'Mumbai', 'Chennai', 'Hyderabad', 'Bengaluru', 'Kolkata', 'Ahmedabad', 'Kochi', 'Jaipur', 'Chandigarh'];
        setCities(data.data.cities?.length > 0 ? data.data.cities : defaultCities);
        
        const defaultCountries = ['India', 'UAE', 'Kenya', 'Nigeria', 'Bangladesh', 'Oman'];
        setCountries(data.data.countries?.length > 0 ? data.data.countries : defaultCountries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cities, countries })
      });
      
      if (res.ok) {
        setMessage('Locations updated successfully.');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update locations.');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCity = (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    if (!cities.includes(newCity.trim())) {
      setCities([...cities, newCity.trim()]);
    }
    setNewCity('');
  };

  const handleRemoveCity = (cityToRemove) => {
    setCities(cities.filter(c => c !== cityToRemove));
  };

  const handleAddCountry = (e) => {
    e.preventDefault();
    if (!newCountry.trim()) return;
    if (!countries.includes(newCountry.trim())) {
      setCountries([...countries, newCountry.trim()]);
    }
    setNewCountry('');
  };

  const handleRemoveCountry = (countryToRemove) => {
    setCountries(countries.filter(c => c !== countryToRemove));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading locations...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Locations Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the cities and countries that appear in dropdowns across the frontend website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cities */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="size-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Active Cities</h2>
          </div>
          
          <form onSubmit={handleAddCity} className="flex gap-2 mb-4">
            <Input 
              placeholder="e.g. Pune" 
              value={newCity} 
              onChange={(e) => setNewCity(e.target.value)} 
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              <Plus className="size-4 mr-1" /> Add
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {cities.map(city => (
              <span key={city} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {city}
                <button onClick={() => handleRemoveCity(city)} className="hover:bg-slate-200 p-0.5 rounded-full transition-colors">
                  <X className="size-3 text-slate-500" />
                </button>
              </span>
            ))}
            {cities.length === 0 && <span className="text-sm text-slate-400 italic">No cities added.</span>}
          </div>
        </div>

        {/* Countries */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="size-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Active Countries</h2>
          </div>
          
          <form onSubmit={handleAddCountry} className="flex gap-2 mb-4">
            <Input 
              placeholder="e.g. UK" 
              value={newCountry} 
              onChange={(e) => setNewCountry(e.target.value)} 
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              <Plus className="size-4 mr-1" /> Add
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {countries.map(country => (
              <span key={country} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {country}
                <button onClick={() => handleRemoveCountry(country)} className="hover:bg-slate-200 p-0.5 rounded-full transition-colors">
                  <X className="size-3 text-slate-500" />
                </button>
              </span>
            ))}
            {countries.length === 0 && <span className="text-sm text-slate-400 italic">No countries added.</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <Button onClick={handleSave} disabled={isSaving} className="w-32">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : (
            <><Save className="size-4 mr-2" /> Save Changes</>
          )}
        </Button>
        {message && (
          <span className="text-sm font-medium text-emerald-600">{message}</span>
        )}
      </div>
    </div>
  );
}
