import React from 'react';
import { Fragrance, Product } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FragrancesPageProps {
  fragrances: Fragrance[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (path: string) => void;
  onOpenEnquiry: (subject?: string) => void;
}

export const FragrancesPage: React.FC<FragrancesPageProps> = ({
  fragrances,
  products,
  onSelectProduct,
  onNavigate,
  onOpenEnquiry
}) => {
  return (
    <div className="space-y-24 md:space-y-36 pb-24 text-left">
      {/* Header Banner */}
      <section className="bg-[#1C1B1A] text-[#FDFBF7] py-20 md:py-28 border-b border-[#2D2A26]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#DFC27D] font-medium block">
            Olfactory Artistry
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-white">
            The Signature Fragrances
          </h1>
          <p className="text-sm md:text-base text-[#EAE3D2] font-light max-w-2xl mx-auto leading-relaxed">
            Each fragrance is an olfactory landscape formulated with rare botanicals and essential extracts, designed to evolve gracefully through hours of gentle diffusion.
          </p>
        </div>
      </section>

      {/* Fragrance Deep Dives */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-28 md:space-y-36">
        {fragrances.map((frag, index) => {
          const isEven = index % 2 === 0;
          // Find products available in this fragrance
          const matchingProducts = products.filter((p) =>
            p.fragrances?.some((f) => f.toLowerCase().includes(frag.name.toLowerCase()))
          );

          return (
            <section
              key={frag.id}
              id={frag.slug}
              className="scroll-mt-28 border-b border-[#EAE3D2] pb-24 last:border-b-0"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Visual Image Card */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="relative aspect-4/3 bg-[#F5EFEB] overflow-hidden shadow-xl border border-[#EAE3D2]">
                    <img
                      src={frag.image}
                      alt={frag.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[#1C1B1A]/80 backdrop-blur-xs text-[#DFC27D] text-[10px] tracking-[0.24em] uppercase px-3 py-1 font-light">
                      Fragrance No. 0{index + 1}
                    </div>
                  </div>
                </div>

                {/* Fragrance Prose & Notes */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
                      {frag.subTitle}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1C1B1A]">
                      {frag.name}
                    </h2>
                    <p className="font-serif italic text-lg sm:text-xl text-[#8A7E72]">
                      "{frag.tagline}"
                    </p>
                  </div>

                  <p className="text-sm text-[#4A4744] font-light leading-relaxed">
                    {frag.description}
                  </p>

                  {/* Notes Card */}
                  <div className="p-6 bg-[#F5EFEB] border border-[#EAE3D2] space-y-3">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#1C1B1A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C29B38]" />
                      <span>Olfactory Architecture & Pyramid</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                      {frag.notes.top && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Top Notes
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.top}
                          </span>
                        </div>
                      )}

                      {frag.notes.heart && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Heart Notes
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.heart}
                          </span>
                        </div>
                      )}

                      {frag.notes.base && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Base Notes
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.base}
                          </span>
                        </div>
                      )}

                      {frag.notes.floral && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Floral Profile
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.floral}
                          </span>
                        </div>
                      )}

                      {frag.notes.woody && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Woody Profile
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.woody}
                          </span>
                        </div>
                      )}

                      {frag.notes.overall && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                            Overall Mood
                          </span>
                          <span className="text-[#1C1B1A] font-medium block">
                            {frag.notes.overall}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matching Products available in this fragrance */}
                  {matchingProducts.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] uppercase tracking-[0.18em] text-[#8A7E72] font-medium block">
                        Vessels Available in {frag.name}:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchingProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onSelectProduct(p)}
                            className="px-3 py-1.5 bg-[#FDFBF7] hover:bg-[#1C1B1A] text-[#1C1B1A] hover:text-[#FDFBF7] text-xs border border-[#EAE3D2] transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{p.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenEnquiry(`Consultation for ${frag.name} fragrance`)}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1C1B1A] hover:text-[#C29B38] border-b border-[#1C1B1A] pb-1 cursor-pointer"
                    >
                      <span>Request Sample Curation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
