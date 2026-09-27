import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShieldCheck, 
  Globe, 
  Users, 
  Award, 
  Activity, 
  ChevronRight,
  Stethoscope,
  Building2,
  Headset,
  Wallet,
  Plane,
  Pill,
  TestTube,
  Microscope,
  Cross,
  Syringe,
  BedDouble,
  HeartHandshake,
  MapPin,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { IconBrandLinkedin, IconBrandTwitter } from '@tabler/icons-react';
import SEO from '../components/SEO';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

const STATS = [
  { id: 1, value: '1000+', label: 'Patients Assisted', icon: Users },
  { id: 2, value: '50+', label: 'Accredited Hospitals', icon: Building2 },
  { id: 3, value: '25+', label: 'Specialties', icon: Stethoscope },
  { id: 4, value: '24/7', label: 'Support & Care', icon: Heart },
];

const VALUES = [
  {
    id: 'v1',
    title: 'Patient First',
    description: 'Every decision we make is centered around the well-being and comfort of our patients. Your health is our highest priority.',
    icon: Heart,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    id: 'v2',
    title: 'Transparency',
    description: 'We believe in clear communication. From treatment costs to medical procedures, we ensure you have all the information.',
    icon: ShieldCheck,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    id: 'v3',
    title: 'Excellence',
    description: 'We partner exclusively with JCI and NABH accredited hospitals to guarantee world-class medical outcomes.',
    icon: Award,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    id: 'v4',
    title: 'Accessibility',
    description: 'Breaking down geographical and logistical barriers so that quality healthcare is accessible to everyone, anywhere.',
    icon: Globe,
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
];

const SERVICES = [
  { id: 1, title: 'Doctor Consultations', description: 'Specialist & General', icon: Stethoscope },
  { id: 2, title: 'Treatment & Surgery', description: 'Hospitals, treatments, surgeries, rehabilitation', icon: BedDouble },
  { id: 3, title: 'Affordable Healthcare', description: 'Discounted prices & suitable options across India - treated under your budget', icon: Wallet },
  { id: 4, title: 'Home Healthcare', description: 'Nursing, on-call nurses, attendants, caregivers', icon: HeartHandshake },
  { id: 5, title: 'Diagnostics & Lab', description: 'Lab tests, home sample collection, diagnostic coordination', icon: Microscope },
  { id: 6, title: 'Medicines', description: 'Coordination & delivery', icon: Pill },
  { id: 7, title: 'Medical Equipment', description: 'DVT mattresses & essential equipment', icon: Activity },
  { id: 8, title: 'Rehab & Physiotherapy', description: 'Physiotherapy, rehab support, post-discharge care', icon: Users },
  { id: 9, title: 'Dialysis Care at Home', description: 'ICU at home, post-operative care, dedicated staff & vendors', icon: Syringe },
  { id: 10, title: 'Complete Support', description: 'One point of contact from consultation to recovery. Under one roof.', icon: ShieldCheck },
  { id: 11, title: 'Medical Tourism', description: 'Treatment & surgery support for patients worldwide', icon: Plane }
];

const NETWORK_STATS = [
  { label: 'Partner Hospital Networks', sub: 'Across India & Worldwide', value: '3', icon: Building2 },
  { label: 'Cities on the Map', sub: 'In India & Abroad', value: '36', icon: MapPin },
  { label: 'Centres Across Networks', sub: 'With trusted partners', value: '83', icon: Cross },
  { label: 'Akeezo Care Line', sub: 'Always here for you', value: '24x7', icon: PhoneCall }
];

const NETWORK_PARTNERS = [
  { name: 'ASG Eye Hospitals', region: 'North, East & Central India', centres: 38, cities: 20 },
  { name: 'Vasan Eye Care', region: 'South & East India', centres: 33, cities: 14 },
  { name: 'Sharp Sight Eye Hospitals', region: 'Delhi NCR, Jammu & Srinagar', centres: 12, cities: 7 }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SEO 
        title="About Us | Akeezo" 
        description="Learn about Akeezo's mission to democratize healthcare. We connect patients globally with world-class hospitals and top medical professionals." 
      />
      <SiteHeader />

      <main className="flex-1 pb-10">
        {/* Hero Section */}
        <section className="relative bg-transparent pt-16 pb-24 sm:pt-20 sm:pb-32 overflow-hidden text-ink-strong">
          <div className="relative mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
                  <span className="flex size-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Trusted by 1000+ Patients Globally
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black tracking-tight mb-6 leading-[1.1] text-balance">
                  Democratizing Access to{' '}
                  <span className="text-primary">
                    World-Class Healthcare
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mb-10">
                  We bridge the gap between patients and top-tier medical facilities globally. No one should be deprived of healthcare because of budget constraints, financial limitations, or lack of access.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <div className="size-10 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center p-1 z-30">
                        <img className="w-full h-full object-contain" src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://apollohospitals.com&size=128" alt="Apollo Hospitals" />
                      </div>
                      <div className="size-10 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center p-1 z-20">
                        <img className="w-full h-full object-contain" src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fortishealthcare.com&size=128" alt="Fortis Healthcare" />
                      </div>
                      <div className="size-10 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center p-1 z-10">
                        <img className="w-full h-full object-contain" src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://medanta.org&size=128" alt="Medanta" />
                      </div>
                      <div className="size-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-xs font-bold text-white shadow-sm z-0">
                        50+
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-ink-strong">Top Hospitals</p>
                      <p className="text-muted-foreground font-medium">in our network</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-5 relative hidden md:block"
              >
                <div className="relative z-10 rounded-[2rem] overflow-hidden border border-rule shadow-2xl aspect-[4/5] max-w-md mx-auto">
                  <img 
                    src="/images/medical_tourism_plan.webp" 
                    alt="Akeezo Healthcare Network"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                  
                  {/* Floating glass card inside image */}
                  <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <Globe className="size-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">Global Network</p>
                      <p className="text-xs text-white/90 font-medium mt-0.5">Connecting you to excellence</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative -mt-10 md:-mt-16 z-10 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {STATS.map((stat) => (
              <motion.div 
                key={stat.id} 
                variants={fadeIn}
                className="bg-card border border-rule rounded-2xl p-6 shadow-card flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <stat.icon className="size-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-ink-strong mb-1">{stat.value}</h3>
                <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 sm:py-20 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-black text-ink-strong tracking-tight">
                Our Mission
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed font-medium">
                To provide seamless, end-to-end medical journeys that prioritize patient care, transparency, and clinical excellence. We handle the logistics so you can focus on healing.
              </p>
              <div className="pt-6 grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Accredited Network", desc: "Curated JCI & NABH hospitals.", icon: ShieldCheck },
                  { title: "24/7 Support", desc: "Dedicated care coordinators.", icon: Headset },
                  { title: "Financial Clarity", desc: "Transparent cost estimates.", icon: Wallet },
                  { title: "Travel & Stay", desc: "Support for visas & lodging.", icon: Plane }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-rule shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                    <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary border border-primary/10">
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-strong leading-tight">{item.title}</h4>
                      <p className="text-sm font-medium text-muted-foreground mt-1 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl"
            >
              <img 
                src="/images/hero section.webp" 
                alt="Akeezo Medical Support" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1551076805-e18690c5e53b?q=80&w=1200&auto=format&fit=crop';
                }}
              />
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-white">
                  <p className="font-serif italic font-bold text-lg md:text-xl">
                    "Health is not just a destination, it's a journey we take together."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-16 sm:py-20 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[0.7rem] font-black uppercase tracking-widest text-primary mb-4 inline-block">
              Comprehensive Care
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink-strong tracking-tight mb-4">
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Akeezo is your trusted healthcare partner, connecting you to the right treatment, the best hospitals and expert care — across the world.
            </p>
          </div>

          <motion.div 
            className="grid lg:grid-cols-3 gap-8 lg:gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-10">
              {SERVICES.map((service) => (
                <motion.div key={service.id} variants={fadeIn} className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <service.icon className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-strong mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeIn} className="space-y-8">
              <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                <Globe className="size-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-ink-strong mb-3">We Help All Patients</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Whether you're international or Indian, Akeezo finds the right treatment or surgery within your budget and coordinates everything — including visas and arrangements — till you fly back home.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2rem] p-8 border border-rule">
                <h3 className="text-xl font-bold text-ink-strong mb-4">Why Choose Akeezo?</h3>
                <ul className="space-y-3">
                  {[
                    "Trusted hospital partners",
                    "Expert healthcare professionals",
                    "End-to-end coordination",
                    "Personalized care",
                    "Support, every step of the way"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                      <CheckCircle2 className="size-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-rule">
          <div className="mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-mono text-[0.7rem] font-black uppercase tracking-widest text-primary mb-4 inline-block">
                What Guides Us
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-ink-strong tracking-tight mb-4">
                Our Core Values
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                These principles guide every interaction, decision, and partnership we make at Akeezo.
              </p>
            </div>

            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {VALUES.map((val) => (
                <motion.div
                  key={val.id}
                  variants={fadeIn}
                  whileHover={{ y: -8 }}
                  className="bg-card rounded-[1.5rem] p-8 shadow-sm border border-rule relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-primary/30"
                >
                  <div className={`absolute -right-6 -top-6 size-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 ${val.bg.replace('/10', '')}`} />
                  
                  <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 ${val.bg} ${val.color}`}>
                    <val.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-black text-ink-strong mb-3">{val.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                    {val.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* Global Network */}
        <section className="py-16 sm:py-20 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[0.7rem] font-black uppercase tracking-widest text-primary mb-4 inline-block">
              Everywhere You Need Us
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink-strong tracking-tight mb-4">
              Our Global & Indian Network
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              World-class hospitals. Trusted partners. Care, wherever you are.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {NETWORK_STATS.map((stat, idx) => (
              <motion.div key={idx} variants={fadeIn} className="bg-white border border-rule rounded-2xl p-6 shadow-sm text-center">
                <div className="size-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <stat.icon className="size-6" />
                </div>
                <h3 className="text-3xl font-black text-ink-strong mb-1">{stat.value}</h3>
                <p className="font-bold text-ink-strong text-sm mb-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {NETWORK_PARTNERS.map((partner, idx) => (
              <motion.div key={idx} variants={fadeIn} className="bg-slate-50 dark:bg-slate-900/40 border border-rule rounded-2xl p-6">
                <h4 className="font-bold text-ink-strong mb-2 flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  {partner.name}
                </h4>
                <p className="text-sm text-muted-foreground font-medium mb-4">{partner.region}</p>
                <div className="flex divide-x divide-rule border-t border-rule pt-4">
                  <div className="flex-1 text-center">
                    <p className="text-xl font-black text-ink-strong">{partner.centres}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Centres</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xl font-black text-ink-strong">{partner.cities}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Cities</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-16 mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-navy rounded-[2rem] p-10 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                  />
            
            <div className="relative z-10 max-w-2xl mx-auto text-white">
              <h2 className="text-3xl md:text-5xl font-black mb-6 text-white">Ready to Start Your Journey?</h2>
              <p className="text-lg md:text-xl text-white/80 mb-10 font-medium">
                Our care team is standing by to help you find the right hospital, doctor, and treatment plan tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                >
                  Plan Your Journey
                  <ChevronRight className="size-4" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/20 active:scale-95 border border-white/20"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
