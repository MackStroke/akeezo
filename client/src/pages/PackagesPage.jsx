import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { EnquiryDialog } from '../components/EnquiryDialog';

export default function PackagesPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState(null);
  const [inquiryPackage, setInquiryPackage] = useState(null);

  useEffect(() => {
    fetch('/api/packages')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setPackages(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load packages:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO 
        title="Healthcare Packages & Plans" 
        description="Affordable care at your doorstep. Choose a healthcare plan that suits your needs." 
      />
      <SiteHeader />
      <div className="bg-slate-50/50 min-h-screen pb-24">
        {/* Header Section */}
        <section className="pt-24 pb-12 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Healthcare Packages & Plans
            </h1>
            <p className="text-lg text-slate-600">
              Affordable Care at Your Doorstep
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Annually</span>
              <span className="inline-block bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Save More
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="px-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No packages currently available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
              {packages.map((pkg) => (
                <div 
                  key={pkg._id} 
                  className={`relative rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl overflow-hidden border ${pkg.isRecommended ? 'border-primary ring-1 ring-primary' : 'border-slate-200'}`}
                >
                  {pkg.isRecommended && (
                    <div className="absolute top-0 inset-x-0">
                      <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1 uppercase tracking-wider">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className={`p-8 ${pkg.isRecommended ? 'pt-10' : ''}`} style={{ backgroundColor: pkg.lightColor || '#f8fafc' }}>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold" style={{ color: pkg.color || '#0f172a' }}>{pkg.title}</h3>
                      <p className="text-sm text-slate-600 font-medium">{pkg.tagline}</p>
                    </div>

                    <div className="mt-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isAnnual ? 'annual' : 'monthly'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-baseline gap-1"
                        >
                          <span className="text-4xl font-bold text-slate-900">
                            ₹{isAnnual ? pkg.yearlyPrice.toLocaleString() : pkg.monthlyPrice.toLocaleString()}
                          </span>
                          <span className="text-slate-500 font-medium">/{isAnnual ? 'yr' : 'mo'}</span>
                        </motion.div>
                      </AnimatePresence>
                      
                      {isAnnual && pkg.yearlyDiscount > 0 && (
                        <p className="text-sm text-green-600 font-semibold mt-2">
                          Save ₹{pkg.yearlyDiscount.toLocaleString()} per year
                        </p>
                      )}
                      
                      <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 bg-white space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Top Benefits</h4>
                      <ul className="space-y-3">
                        {pkg.keyFeatures?.map((feature, i) => (
                          <li key={i} className="flex gap-3 text-sm text-slate-700">
                            <Check className="size-5 text-primary shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <Button 
                        onClick={() => setInquiryPackage(pkg)}
                        className="w-full text-base py-6" 
                        style={{ backgroundColor: pkg.color }}
                      >
                        Choose {pkg.title}
                      </Button>
                      
                      {pkg.allServices?.length > 0 && (
                        <div className="mt-4 text-center">
                          <button 
                            onClick={() => setSelectedServices({ title: pkg.title, services: pkg.allServices, color: pkg.color })}
                            className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 mx-auto"
                          >
                            <Info className="size-4" />
                            View Full Service List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Comprehensive Comparison Table */}
        {!loading && packages.length > 0 && (
          <section className="px-4 max-w-7xl mx-auto mt-24 mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Compare Plans in Detail</h2>
              <p className="text-lg text-slate-600">See exactly what's included in each package to make the right choice.</p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[800px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 font-bold text-slate-900 w-1/3">Service & Feature</th>
                    {packages.map(pkg => (
                      <th key={pkg._id} className="px-6 py-5 font-bold text-center w-1/5" style={{ color: pkg.color || '#0f172a' }}>
                        <div className="text-lg">{pkg.title}</div>
                        <div className="text-slate-500 font-medium text-xs mt-1">
                          ?{isAnnual ? pkg.yearlyPrice.toLocaleString() : pkg.monthlyPrice.toLocaleString()} / {isAnnual ? 'yr' : 'mo'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from(new Set(packages.flatMap(p => p.allServices?.map(s => s.serviceName) || []))).map((serviceName, idx) => {
                    const description = packages.map(p => p.allServices?.find(s => s.serviceName === serviceName)?.description).find(Boolean);
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{serviceName}</p>
                          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
                        </td>
                        {packages.map(pkg => {
                          const svc = pkg.allServices?.find(s => s.serviceName === serviceName);
                          return (
                            <td key={pkg._id} className="px-6 py-4 text-center align-middle">
                              {svc ? (
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                  {svc.included ? (
                                    <div className="size-6 rounded-full bg-green-100 flex items-center justify-center">
                                      <Check className="size-4 text-green-700" />
                                    </div>
                                  ) : (
                                    <span className="text-slate-300 font-bold text-lg">-</span>
                                  )}
                                  {svc.additionalCharges && (
                                    <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full text-center leading-tight">
                                      {svc.additionalCharges}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-300 font-bold text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Detailed Services Modal */}
        <Dialog open={!!selectedServices} onOpenChange={() => setSelectedServices(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl" style={{ color: selectedServices?.color }}>
                {selectedServices?.title} - Service Details
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
                <div className="col-span-6">Service</div>
                <div className="col-span-3 text-center">Status</div>
                <div className="col-span-3 text-right">Charges</div>
              </div>
              <div className="divide-y divide-slate-100">
                {selectedServices?.services.map((svc, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 py-4 items-center">
                    <div className="col-span-6 space-y-1">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{svc.serviceName}</p>
                      {svc.description && <p className="text-xs text-slate-500">{svc.description}</p>}
                    </div>
                    <div className="col-span-3 text-center">
                      {svc.included ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                          <Check className="size-3" /> Included
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Extra</span>
                      )}
                    </div>
                    <div className="col-span-3 text-right text-xs text-slate-600 font-medium">
                      {svc.additionalCharges || (svc.included ? 'Free' : 'Varies')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <EnquiryDialog 
        open={!!inquiryPackage} 
        onOpenChange={(open) => !open && setInquiryPackage(null)}
        payload={{
          intent: 'healthcare_package',
          treatment: inquiryPackage?.title,
          context: `Interested in ${inquiryPackage?.title} package.\nPayment Preference: ${isAnnual ? 'Annually' : 'Monthly'}\nExpected Cost: ₹${isAnnual ? inquiryPackage?.yearlyPrice : inquiryPackage?.monthlyPrice}`,
        }}
        customSuccessMessage={`Thank you for your interest in the ${inquiryPackage?.title} package. Our team will contact you shortly to confirm your subscription.`}
      />

      <SiteFooter />
    </>
  );
}
