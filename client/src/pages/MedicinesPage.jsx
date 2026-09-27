import { useState, useRef } from 'react';
import { Pill, Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { submitLead } from '../lib/api';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { FloatingActions } from '../components/FloatingActions';
import SEO from '../components/SEO';
import { MedicinesResultDialog } from '../components/MedicinesResultDialog';
const COUNTRIES = ['India', 'UAE', 'USA'];

const STATES = {
  'India': ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 
'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 
'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'],
  'UAE': ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
  'USA': ['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'],
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { useConfig } from '../context/ConfigContext';

export default function MedicinesPage() {
  const { config } = useConfig();
  const medicinesContent = config?.medicinesContent || { heroTitle: 'Medicines & Supplements', heroSubtitle: 'Upload your prescription or let us know what you need.', banners: [], offers: [] };
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: 'India',
    state: '',
    needType: 'Medicine',
    consent: false,
    message: ''
  });

  const [file, setFile] = useState(null);
  const [fileBase64, setFileBase64] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be under 5MB");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;

    setIsSubmitting(true);
    try {
      const data = await submitLead({
        intent: 'medicines',
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        state: formData.state,
        treatment: formData.needType,
        message: [
          `Need: ${formData.needType}`,
          `Location: ${formData.state}, ${formData.country}`,
          formData.message ? `Additional Notes: ${formData.message}` : ''
        ].filter(Boolean).join('\n'),
        consent: formData.consent,
        prescriptionFileName: file ? file.name : undefined,
        prescriptionBase64: fileBase64 || undefined
      });
      setResult({ success: true, data });
      // Reset form
      setFormData({
        name: '',
        phone: '',
        country: 'India',
        state: '',
        needType: 'Medicine',
        consent: false,
        message: ''
      });
      removeFile();
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Order Medicines & Supplements | AKEEZO" 
        description="Upload your prescription and get medicines or health supplements delivered directly to you with AKEEZO's trusted healthcare network."
      />
      
      <div className="relative min-h-screen flex flex-col bg-slate-50">
        <SiteHeader />

        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-4">
                <Pill className="size-8" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                {medicinesContent.heroTitle}
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                {medicinesContent.heroSubtitle}
              </p>
            </div>

            {/* Dynamic Banners */}
            {medicinesContent.banners?.filter(b => b.active).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {medicinesContent.banners.filter(b => b.active).map(banner => (
                  banner.link ? (
                    <a key={banner.id} href={banner.link} className="block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-auto object-cover" />
                    </a>
                  ) : (
                    <div key={banner.id} className="overflow-hidden rounded-2xl shadow-sm">
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-auto object-cover" />
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Dynamic Offers */}
            {medicinesContent.offers?.filter(o => o.active).length > 0 && (
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                {medicinesContent.offers.filter(o => o.active).map(offer => (
                  <div key={offer.id} className="bg-mint/10 border border-mint/20 rounded-xl p-4 max-w-sm flex-1 min-w-[280px]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-mint-strong">{offer.title}</h4>
                      {offer.code && (
                        <span className="bg-mint text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                          {offer.code}
                        </span>
                      )}
                    </div>
                    {offer.description && (
                      <p className="text-sm text-slate-600">{offer.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                
                {/* Left Side: Info & Steps */}
                <div className="lg:col-span-2 bg-slate-900 p-8 text-white flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                      <CheckCircle2 className="text-primary size-5" />
                      How it works
                    </h3>
                    
                    <ul className="space-y-6">
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                          <h4 className="font-bold text-slate-100">Upload Prescription</h4>
                          <p className="text-sm text-slate-400 mt-1">Share a clear photo or PDF of your valid medical prescription.</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                          <h4 className="font-bold text-slate-100">We Review</h4>
                          <p className="text-sm text-slate-400 mt-1">Our healthcare executive will review and check availability.</p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                          <h4 className="font-bold text-slate-100">Confirm & Deliver</h4>
                          <p className="text-sm text-slate-400 mt-1">We'll call you to confirm the order and arrange a fast delivery to your address.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-12 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-mint shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Valid prescription is mandatory for scheduled drugs. Over-the-counter supplements do not require a prescription.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-3 p-8 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 border-b pb-2">1. Your Details</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            required 
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Mobile Number *</Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            required 
                            placeholder="+91 9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Select 
                            value={formData.country} 
                            onValueChange={(val) => setFormData({...formData, country: val, state: ''})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>State / Region *</Label>
                          <Select 
                            value={formData.state} 
                            onValueChange={(val) => setFormData({...formData, state: val})}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                            <SelectContent>
                              {(STATES[formData.country] || []).map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-bold text-slate-900 border-b pb-2">2. Order Details</h3>
                      
                      <div className="space-y-2">
                        <Label>What do you need? *</Label>
                        <Select 
                          value={formData.needType} 
                          onValueChange={(val) => setFormData({...formData, needType: val})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Medicine">Prescription Medicine</SelectItem>
                            <SelectItem value="Supplements">Health Supplements</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 pt-2">
                        <Label>Upload Prescription (Optional for supplements)</Label>
                        
                        {!file ? (
                          <div 
                            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <input 
                              type="file" 
                              className="hidden" 
                              ref={fileInputRef}
                              accept="image/jpeg,image/png,image/webp,application/pdf"
                              onChange={handleFileChange}
                            />
                            <div className="flex justify-center mb-3">
                              <div className="p-3 bg-primary/10 text-primary rounded-full">
                                <Upload className="size-6" />
                              </div>
                            </div>
                            <p className="text-sm font-bold text-slate-700 mb-1">Click to upload prescription</p>
                            <p className="text-xs text-slate-500">JPG, PNG, PDF up to 5MB</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <FileText className="size-8 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="text-slate-500 hover:text-red-500"
                              onClick={removeFile}
                            >
                              <X className="size-5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Any specific notes or medicine names?</Label>
                        <textarea
                          id="message"
                          rows={3}
                          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="E.g. Need 2 strips of Paracetamol 500mg"
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t space-y-6">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          id="consent" 
                          checked={formData.consent}
                          onCheckedChange={(checked) => setFormData({...formData, consent: checked})}
                          className="mt-1"
                        />
                        <Label htmlFor="consent" className="text-sm font-normal text-slate-600 leading-relaxed">
                          I consent to AKEEZO contacting me regarding this medicine request and I confirm that any prescription uploaded is valid and for my personal use or for a family member. *
                        </Label>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base font-bold uppercase tracking-wider cta-gradient text-white shadow-lg"
                        disabled={!formData.consent || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 size-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Request'
                        )}
                      </Button>
                    </div>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </main>

        <SiteFooter />
        <FloatingActions />
      </div>

      <MedicinesResultDialog
        open={Boolean(result)}
        onOpenChange={(open) => !open && setResult(null)}
        result={result?.success ? result.data : null}
        error={result?.error}
      />
    </>
  );
}
