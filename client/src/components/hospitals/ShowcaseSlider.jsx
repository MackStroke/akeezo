import { Link } from 'react-router-dom';

export function ShowcaseSlider({ title, items = [], rounded = 'rounded-[4px]' }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12 mt-12 md:mb-16 md:mt-16">
      <div className="flex justify-between items-center relative mb-6">
        <h2 className="text-[20px] md:text-[24px] font-bold text-ink-strong">{title}</h2>
      </div>
      <div className="relative w-full">
        <ul 
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory m-0 p-0" 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map(item => (
            <li key={item.id} className="snap-start shrink-0 list-none m-0 p-0">
              <div className={`relative block w-[200px] h-[200px] md:w-[240px] md:h-[240px] ${rounded} overflow-hidden group`}>
                <Link to={item.link} className="block w-full h-full relative">
                  <div className="absolute inset-0 bg-sunk">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Dark gradient overlay at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300" />
                  
                  <span className="absolute bottom-4 left-4 pr-4">
                    <h4 className="text-white font-bold text-[16px] md:text-[18px] leading-tight line-clamp-2 shadow-sm drop-shadow-md">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-white/90 text-[13px] mt-1 line-clamp-1 drop-shadow">
                        {item.subtitle}
                      </p>
                    )}
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
