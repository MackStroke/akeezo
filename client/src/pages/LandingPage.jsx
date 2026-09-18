import { useState } from 'react';
import SEO from '@/components/SEO';
import { LocaleProvider } from '@/context/LocaleContext';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FloatingActions } from '@/components/FloatingActions';
import { EnquiryDialog } from '@/components/EnquiryDialog';
import { EmergencyResultDialog } from '@/components/EmergencyResultDialog';
import { Hero } from '@/sections/Hero';
import { JourneySlider } from '@/sections/JourneySlider';
import { EntryPoints } from '@/sections/EntryPoints';
import { Journey } from '@/sections/Journey';
import { Treatments } from '@/sections/Treatments';
import { CostEstimate } from '@/sections/CostEstimate';
import { Emergency } from '@/sections/Emergency';
import { HomeCare } from '@/sections/HomeCare';
import { Continuum } from '@/sections/Continuum';
import { Partners } from '@/sections/Partners';
import { Faq } from '@/sections/Faq';
import { submitEmergency } from '@/lib/api';

const landingPageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MedicalOrganization',
      '@id': 'https://www.akeezo.com/#organization',
      name: 'AKEEZO Healthcare Journey Platform',
      url: 'https://www.akeezo.com',
      logo: 'https://www.akeezo.com/images/logo-light.svg',
      description:
        'End-to-end healthcare journey coordination in India: medical tourism, 24/7 emergency dispatch, doctor consultations, and home healthcare.',
      telephone: '+91-82876-39443',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New Delhi',
        addressCountry: 'IN',
      },
      medicalSpecialty: [
        'Cardiovascular',
        'Oncology',
        'Orthopedics',
        'Neurology',
        'EmergencyMedicalServices',
        'HomeHealthcare',
      ],
      availableService: [
        {
          '@type': 'MedicalProcedure',
          name: 'Medical Tourism & Surgery Planning',
          description:
            'Cross-border treatment planning, accredited hospital selection, cost estimation, and travel visa assistance.',
        },
        {
          '@type': 'EmergencyService',
          name: '24/7 Emergency Ambulance Dispatch',
          description:
            'Instant dispatch of BLS/ALS ambulances and ICU bed reservation across top Indian metro hospitals.',
        },
        {
          '@type': 'MedicalTherapy',
          name: 'Home Healthcare & Post-Op Care',
          description:
            'ICU-at-home setup, certified nursing care, doctor home visits, and post-operative recovery.',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.akeezo.com/#website',
      url: 'https://www.akeezo.com',
      name: 'AKEEZO',
      publisher: {
        '@id': 'https://www.akeezo.com/#organization',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.akeezo.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does AKEEZO help international patients with medical treatment in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AKEEZO coordinates your complete medical journey in India — including hospital selection, doctor opinions, transparent cost estimates, medical visa support, airport transfers, language translators, and stay arrangement.',
          },
        },
        {
          '@type': 'Question',
          name: 'How fast is AKEEZO 24/7 emergency care dispatch?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our emergency response team acts within minutes, dispatching equipped BLS/ALS ambulances and reserving trauma beds at partner accredited hospitals.',
          },
        },
        {
          '@type': 'Question',
          name: 'What services are available under AKEEZO Home Healthcare?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'AKEEZO provides certified ICU-at-home setups, skilled nursing care, home physiotherapy, doctor home visits, and medical equipment rental across major Indian cities.',
          },
        },
      ],
    },
  ],
};


const URGENCY_LABELS = {
  within_48h: 'Within 24–48 hours',
  within_1_week: 'Within a week',
  within_1_month: 'Within a month',
  later: 'Planning for later',
  not_sure: 'Timing not decided',
};

const BUDGET_LABELS = {
  under_1l: 'Budget under ₹1 lakh',
  '1_3l': 'Budget ₹1–3 lakh',
  '3_5l': 'Budget ₹3–5 lakh',
  '5_10l': 'Budget ₹5–10 lakh',
  '10_20l': 'Budget ₹10–20 lakh',
  '20_50l': 'Budget ₹20–50 lakh',
  '50l_plus': 'Budget ₹50 lakh+',
  not_sure: 'Budget not decided',
};

const PREFERENCE_LABELS = {
  best_value: 'Prefers best value',
  best_medical: 'Prefers best medical option',
  fastest: 'Prefers fastest treatment',
  accredited: 'Accredited hospitals only',
  premium: 'Prefers premium experience',
};

const JOURNEY_LABELS = {
  treatment: 'Treatment or surgery',
  second_opinion: 'Second opinion',
  consultation: 'Specialist consultation',
  diagnosis: 'Diagnosis / health check',
};

export default function LandingPage() {
  const [enquiry, setEnquiry] = useState(null);
  const [emergency, setEmergency] = useState(null);

  /**
   * The widget gathers what the patient needs; the dialog then collects who
   * they are plus explicit consent before anything is sent. Health details
   * must not leave the browser on a search-button press alone.
   */
  const handlePlan = (form, journeyType) => {
    setEnquiry({
      intent: 'medical_tourism',
      treatment: form.treatment,
      preferredCity: form.preferredCity === 'recommend' ? undefined : form.preferredCity,
      urgency: form.urgency,
      summary: [
        JOURNEY_LABELS[journeyType],
        form.treatment,
        form.preferredCity === 'recommend' ? 'City: recommend for me' : form.preferredCity,
        URGENCY_LABELS[form.urgency],
        BUDGET_LABELS[form.budget],
        PREFERENCE_LABELS[form.preference],
      ].filter(Boolean),
      // Widget answers travel to the coordinator as context on the enquiry.
      context: [
        `Request type: ${JOURNEY_LABELS[journeyType] ?? journeyType}`,
        form.treatment ? `Treatment: ${form.treatment}` : null,
        `Budget: ${BUDGET_LABELS[form.budget] ?? form.budget}`,
        `Priority: ${PREFERENCE_LABELS[form.preference] ?? form.preference}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  };

  const handleHome = (form) => {
    setEnquiry({
      intent: 'home_healthcare',
      treatment: form.service,
      phone: form.phone,
      summary: [form.service, form.locationLabel, 'Home healthcare'].filter(Boolean),
      context: [
        `Service needed: ${form.service}`,
        form.locationLabel ? `Location: ${form.locationLabel}` : null,
        `Duration: ${form.duration}`,
      ]
        .filter(Boolean)
        .join('\n'),
    });
  };

  /**
   * Emergency submits straight through — no confirmation step, no consent
   * gate. Someone reporting a collapse is not going to read a checkbox, and a
   * delayed emergency request is worse than an imperfect one.
   */
  const handleEmergency = async (form) => {
    setEmergency({ pending: true });
    try {
      const data = await submitEmergency({
        location: { label: form.locationLabel || undefined, placeType: form.placeType },
        problem: form.problem,
        helpNeeded: ['not_sure'],
        requesterName: form.requesterName,
        requesterPhone: form.requesterPhone,
      });
      setEmergency({ result: data });
    } catch (err) {
      setEmergency({ error: err.message });
    }
  };

  return (
    <LocaleProvider>
      <SEO jsonLd={landingPageJsonLd} />
      <div className="relative min-h-screen overflow-x-clip">
        {/* Ahead of the header, so keyboard users can bypass the nav. */}
        <a
          className="visually-hidden focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-100 focus-visible:rounded-md focus-visible:bg-card focus-visible:px-4 focus-visible:py-2 focus-visible:font-bold focus-visible:shadow-widget"
          href="#content"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="content" tabIndex={-1}>
          <Hero onPlan={handlePlan} onEmergency={handleEmergency} onHome={handleHome} />
          <JourneySlider />
          <EntryPoints />
          <Journey />
          <Treatments />
          <CostEstimate />
          <Emergency />
          <HomeCare />
          <Continuum />
          <Partners />
          <Faq />
        </main>

        <SiteFooter />
        <FloatingActions />
      </div>

      <EnquiryDialog
        open={Boolean(enquiry)}
        onOpenChange={(open) => !open && setEnquiry(null)}
        payload={enquiry}
      />

      <EmergencyResultDialog
        open={Boolean(emergency) && !emergency.pending}
        onOpenChange={(open) => !open && setEmergency(null)}
        result={emergency?.result}
        error={emergency?.error}
      />
    </LocaleProvider>
  );
}
