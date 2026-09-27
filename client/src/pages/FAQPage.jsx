import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { HelpCircle } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { fetchFaqs } from '../lib/api';

const DEFAULT_GENERAL_FAQS = [
  {
    question: "How does Akeezo help patients?",
    answer: "Akeezo is an end-to-end healthcare journey platform. We help you discover the right doctors and hospitals, book appointments, arrange medical visas for international travel, and provide ongoing care coordination through your entire treatment journey."
  },
  {
    question: "Is Akeezo free for patients?",
    answer: "Yes! Creating an account, browsing hospitals, and using our basic care coordination services are completely free. You only pay for the actual medical treatments, premium concierge services, or specific care packages you opt into."
  },
  {
    question: "Do you offer emergency assistance?",
    answer: "Yes, we provide 24/7 emergency assistance, including ambulance dispatch and urgent hospital admission coordination. However, for severe life-threatening emergencies, we always recommend calling your local emergency number first."
  },
  {
    question: "Can I get a second medical opinion through Akeezo?",
    answer: "Absolutely. You can upload your medical reports securely on our platform, and our care team will connect you with top specialists from around the world to provide a comprehensive second opinion."
  }
];

const DEFAULT_PARTNER_FAQS = [
  {
    question: "How do I list my hospital on Akeezo?",
    answer: "You can apply by filling out the 'List your Hospital' form on the Join as Partner page. Our onboarding team will review your JCI/NABH accreditations and get back to you within 48 hours to initiate the contract and integration process."
  },
  {
    question: "What are the requirements for doctors to join the panel?",
    answer: "Doctors must have valid medical licenses, a minimum of 5 years of specialized experience post-graduation, and must be affiliated with an accredited hospital or clinic. We also require a brief interview with our medical board."
  },
  {
    question: "How does the patient referral process work?",
    answer: "Once onboarded, your profile or hospital is listed in our directory. When a patient selects you or our care team matches a patient's case with your specialty, you will receive an enquiry containing the patient's medical history and scans."
  },
  {
    question: "Is there a fee to join the Akeezo network?",
    answer: "There is no upfront joining fee for hospitals or doctors. Akeezo operates on a transparent service-fee model based on successful patient consultations and treatments facilitated through our platform."
  }
];

export default function FAQPage() {
  const [faqsByCategory, setFaqsByCategory] = useState({
    'General & Patient FAQs': DEFAULT_GENERAL_FAQS,
    'Partner Help Center': DEFAULT_PARTNER_FAQS
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    async function loadFaqs() {
      try {
        const data = await fetchFaqs();
        if (data && data.length > 0) {
          const grouped = {};
          data.forEach(faq => {
            const cat = faq.category || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(faq);
          });
          setFaqsByCategory(grouped);
        }
      } catch (err) {
        console.error('Failed to load FAQs:', err);
      }
    }
    
    loadFaqs();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO title="Help Center & FAQs | Akeezo" description="Frequently asked questions and support for Akeezo patients and partner hospitals." />

      <SiteHeader />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="bg-navy py-16 md:py-20 text-white">
          <div className="mx-auto max-w-[76rem] px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 ring-1 ring-white/20">
              <HelpCircle className="size-8 text-sky" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              How can we help you?
            </h1>
            <p className="text-sky/90 max-w-2xl mx-auto text-lg">
              Find answers to common questions about using Akeezo, coordinating your care, or partnering with our healthcare network.
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="mx-auto max-w-4xl px-4 mt-[-2rem] relative z-10">
          
          {Object.entries(faqsByCategory).map(([category, faqs], index) => (
            <div key={category} className={`bg-white rounded-2xl shadow-xl border border-black/5 p-6 md:p-10 ${index !== Object.keys(faqsByCategory).length - 1 ? 'mb-12' : ''}`} id={category.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-2xl font-bold text-ink-strong mb-6 flex items-center gap-3">
                {category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={`${category}-${i}`} value={`${category}-${i}`} className="border-b border-black/5">
                    <AccordionTrigger className="text-left font-semibold text-ink hover:text-primary py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* Contact Support CTA */}
          <div className="mt-12 text-center bg-slate-50 border border-black/10 rounded-2xl p-8">
            <h3 className="font-bold text-xl mb-2 text-ink-strong">Still need help?</h3>
            <p className="text-muted-foreground mb-6">Our 24/7 care team and partner support are ready to assist you.</p>
            <a href="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Contact Support
            </a>
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
