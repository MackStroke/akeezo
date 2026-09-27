import { useState } from 'react';
import {
  Activity,
  Baby,
  Bone,
  Brain,
  ClipboardList,
  Globe2,
  HeartPulse,
  Ribbon,
  Smile,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

import { RecommendationModal } from '@/components/RecommendationModal';
import { useConfig } from '@/context/ConfigContext';

/**
 * MMT's category tiles: a dense grid of icon + label, each one a filter into
 * the search above rather than a separate page.
 */
const ICONS = {
  cardiac: HeartPulse,
  oncology: Ribbon,
  orthopaedics: Bone,
  neurology: Brain,
  transplant: Activity,
  fertility: Baby,
  'second-opinion': ClipboardList,
  dental: Smile,
  cosmetic: Sparkles,
  diagnosis: Stethoscope,
};

const CITY_DATA = [
  {
    name: 'Delhi NCR',
    state: 'Delhi / Haryana / UP',
    tag: 'Cardiac, Cancer & Transplants',
    image: '/images/cities/delhi.jpg',
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    tag: 'Advanced Surgery & Ortho',
    image: '/images/cities/mumbai.jpg',
  },
  {
    name: 'Bengaluru',
    state: 'Karnataka',
    tag: 'Oncology & Bone Marrow',
    image: '/images/cities/bangalore.jpg',
  },
  {
    name: 'Hyderabad',
    state: 'Telangana',
    tag: 'Robotics & Liver Transplants',
    image: '/images/cities/hyderabad.jpg',
  },
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    tag: 'Multi-organ & Heart Hub',
    image: '/images/cities/chennai.jpg',
  },
  {
    name: 'Kolkata',
    state: 'West Bengal',
    tag: 'Super Speciality & Cardio',
    image: '/images/cities/kolkata.jpg',
  },
  {
    name: 'Kochi',
    state: 'Kerala',
    tag: 'Ayurveda & Rehabilitation',
    image: '/images/cities/kochi.jpg',
  },
  {
    name: 'Goa',
    state: 'Goa',
    tag: 'Wellness & Preventive Care',
    image: '/images/cities/goa.jpg',
  },
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    tag: 'Heritage & Specialty Care',
    image: '/images/cities/jaipur.jpg',
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    tag: 'General & Pediatric Care',
    image: '/images/cities/pune.jpg',
  },
];

export function Treatments() {
  const { config } = useConfig();
  const treatments = config?.planTreatments || [];
  const [modalOpen, setModalOpen] = useState(false);
  const [recommendType, setRecommendType] = useState('city');

  const handleOpenRecommendation = (type) => {
    setRecommendType(type);
    setModalOpen(true);
  };

  return (
    <section id="locations" aria-labelledby="locations-heading" className="bg-sunk py-14 font-sans">
      <div className="mx-auto max-w-[76rem] px-4">
        <h2 id="locations-heading" className="text-xl font-black text-ink-strong sm:text-2xl">Where Would You Like to Be Treated?</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Select a medical hub city in India. We match you with leading accredited hospitals, top specialists, and full travel coordination.
        </p>
        <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {CITY_DATA.map((c) => (
              <li key={c.name} className="h-full">
                <a
                  href="#top"
                  className="group flex flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-rule bg-card transition-all duration-200 hover:-translate-y-1 hover:border-mint/50 hover:shadow-widget active:scale-[0.99] touch-manipulation h-full focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none"
                >
                  {/* Real City Image Banner */}
                  <div className="relative h-28 sm:h-32 w-full overflow-hidden border-b border-rule/60 bg-muted">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="size-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md px-2 sm:px-2.5 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold text-white border border-white/20 shadow-xs">
                      {c.state}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
                    <h4 className="text-sm sm:text-base font-black text-ink-strong group-hover:text-mint transition-colors leading-tight">
                      {c.name}
                    </h4>
                  </div>
                </a>
              </li>
            ))}

            {/* Special Recommendation Card - Recommend a City */}
            <li className="h-full col-span-2 sm:col-span-1">
              <button
                type="button"
                onClick={() => handleOpenRecommendation('city')}
                className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-mint/40 bg-mint/10 text-left transition-all duration-200 hover:-translate-y-1 hover:border-mint hover:bg-mint/20 hover:shadow-widget active:scale-[0.99] touch-manipulation focus-visible:ring-2 focus-visible:ring-mint focus-visible:outline-none cursor-pointer"
              >
                <div className="relative h-28 sm:h-32 w-full flex items-center justify-center p-2.5 sm:p-3 border-b border-mint/20 bg-gradient-to-br from-mint/20 via-mint/5 to-transparent overflow-hidden">
                  <Sparkles className="size-10 sm:size-12 text-mint animate-pulse" />
                  <span className="absolute top-2 right-2 rounded-full bg-mint/15 px-2 sm:px-2.5 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold text-mint border border-mint/30">
                    Smart Matching
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
                  <h4 className="text-sm sm:text-base font-black text-mint leading-tight">
                    Recommend a City
                  </h4>
                </div>
              </button>
            </li>

            {/* Special Recommendation Card - Recommend a Country */}
            <li className="h-full col-span-2 sm:col-span-1">
              <button
                type="button"
                onClick={() => handleOpenRecommendation('country')}
                className="group flex h-full w-full flex-col justify-between overflow-hidden rounded-[var(--radius)] border border-primary/40 bg-primary/10 text-left transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:bg-primary/20 hover:shadow-widget-orange active:scale-[0.99] touch-manipulation focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
              >
                <div className="relative h-28 sm:h-32 w-full flex items-center justify-center p-2.5 sm:p-3 border-b border-primary/20 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent overflow-hidden">
                  <Globe2 className="size-10 sm:size-12 text-primary animate-pulse" />
                  <span className="absolute top-2 right-2 rounded-full bg-primary/15 px-2 sm:px-2.5 py-0.5 text-[0.62rem] sm:text-[0.68rem] font-bold text-primary border border-primary/30">
                    Global Expansion
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-center">
                  <h4 className="text-sm sm:text-base font-black text-primary leading-tight">
                    Recommend a Country
                  </h4>
                </div>
              </button>
            </li>
          </ul>
      </div>

      <RecommendationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialType={recommendType}
      />
    </section>
  );
}
