import { useConfig } from '../context/ConfigContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Stethoscope, HeartPulse, ShieldCheck, HeartHandshake, Smartphone, FlaskConical, CheckCircle2 } from 'lucide-react';

export function WhyUs() {
  const { config } = useConfig();
  const { whyUsTitle, whyUsDescription, whyUsCards } = config?.homeContent || {};

  if (!whyUsCards || whyUsCards.length === 0) return null;

  const Icons = [
    Stethoscope,
    HeartPulse,
    ShieldCheck,
    HeartHandshake,
    Smartphone,
    FlaskConical
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
  };

  return (
    <section id="why-us" className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      {/* Soft glowing ambient backgrounds */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-mint/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />

      <div className="relative mx-auto max-w-[76rem] px-4 sm:px-6 lg:px-8">
        
        {/* Separated Header Section for better flow when adding cards */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 mb-4"
          >
            {whyUsTitle}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium"
          >
            {whyUsDescription}
          </motion.p>
        </div>

        {/* Dynamic Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {whyUsCards.map((card, index) => (
            <motion.div 
              key={card.id || index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-6 rounded-[1.25rem] bg-white border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-mint/10 hover:border-mint/30 transition-all duration-300 flex flex-col items-start gap-4 overflow-hidden"
            >
              {/* Subtle accent line on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mint/40 to-mint opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="absolute inset-0 bg-mint/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative size-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs text-mint flex items-center justify-center transition-all duration-300 group-hover:bg-mint group-hover:text-white group-hover:rotate-3 group-hover:shadow-md">
                  {(() => {
                    const Icon = Icons[index % Icons.length] || CheckCircle2;
                    return <Icon className="size-7" strokeWidth={1.5} />;
                  })()}
                </div>
              </div>
              
              <div className="space-y-2 relative z-10">
                {card.title && (
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-mint transition-colors duration-300">
                    {card.title}
                  </h3>
                )}
                <p className={cn("font-medium leading-relaxed", card.title ? "text-slate-600" : "text-slate-800 text-base")}>
                  {card.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}
