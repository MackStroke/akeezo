import { useState } from 'react';
import { Camera, X, Grid2X2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function ImageGallery({ images = [], hospitalName = 'Hospital' }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[288px] md:h-[350px] bg-secondary flex items-center justify-center rounded-2xl">
        <div className="flex flex-col items-center text-muted-foreground opacity-50">
          <Camera className="w-12 h-12 mb-2" />
          <span>No images available</span>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const imageCount = images.length;

  return (
    <>
      <div className="relative w-full h-[288px] md:h-[350px] rounded-2xl overflow-hidden group/gallery">
        
        {/* If only 1 image */}
        {imageCount === 1 && (
          <div className="w-full h-full cursor-pointer relative overflow-hidden group/main" onClick={() => openLightbox(0)}>
            <img src={images[0].url} alt={images[0].alt || hospitalName} className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors" />
          </div>
        )}

        {/* If 2 images */}
        {imageCount === 2 && (
          <div className="flex w-full h-full gap-2">
            <div className="w-1/2 h-full cursor-pointer relative overflow-hidden group/main" onClick={() => openLightbox(0)}>
              <img src={images[0].url} alt={images[0].alt || hospitalName} className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors" />
            </div>
            <div className="w-1/2 h-full cursor-pointer relative overflow-hidden group/thumb" onClick={() => openLightbox(1)}>
              <img src={images[1].url} alt={images[1].alt || hospitalName} className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors" />
            </div>
          </div>
        )}

        {/* 3+ images, use the Agoda-style mosaic */}
        {imageCount >= 3 && (
          <div className="flex w-full h-full gap-2">
            {/* Left large image (takes 50% width on md+, full width on mobile unless hidden) */}
            <div className="w-full md:w-1/2 h-full cursor-pointer relative overflow-hidden group/main" onClick={() => openLightbox(0)}>
              <img src={images[0].url} alt={images[0].alt || hospitalName} className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover/main:bg-black/10 transition-colors" />
            </div>

            {/* Right side grid */}
            <div className="hidden md:grid w-1/2 h-full gap-2 grid-cols-2 grid-rows-2">
              {images.slice(1, 5).map((img, idx) => {
                const actualIndex = idx + 1;
                const isLastInGrid = idx === 3 || (imageCount < 5 && idx === imageCount - 2);
                const hasMore = imageCount > 5 && isLastInGrid;
                
                return (
                  <div key={actualIndex} className={`relative w-full h-full cursor-pointer overflow-hidden group/thumb ${imageCount === 3 && idx === 1 ? 'col-span-2' : ''} ${imageCount === 4 && idx === 2 ? 'col-span-2' : ''}`} onClick={() => openLightbox(actualIndex)}>
                    <img src={img.url} alt={img.alt || `${hospitalName} view ${actualIndex}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700" />
                    
                    {!hasMore && (
                      <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/10 transition-colors" />
                    )}

                    {hasMore && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white hover:bg-black/60 transition-colors backdrop-blur-[2px]">
                        <span className="font-semibold text-lg">+{imageCount - 5}</span>
                        <span className="text-sm font-medium">photos</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* See all photos button */}
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute bottom-4 right-4 bg-white/95 text-black shadow-md font-semibold hover:bg-white border-0 opacity-0 group-hover/gallery:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(0);
          }}
        >
          <Grid2X2 className="w-4 h-4 mr-2" />
          See all photos
        </Button>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 bg-black/95 border-none flex flex-col justify-center overflow-hidden [&>button]:hidden">
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50 rounded-full"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden">
            <img 
              src={images[activeIndex]?.url} 
              alt={images[activeIndex]?.alt || 'Hospital view'} 
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="h-24 bg-black/50 p-4 flex gap-2 overflow-x-auto snap-x">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md snap-center transition-all ${
                  idx === activeIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-black opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}
