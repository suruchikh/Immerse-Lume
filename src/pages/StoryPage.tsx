import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

interface StoryPageProps {
  onNavigate: (path: string) => void;
  onOpenEnquiry: () => void;
}

export const StoryPage: React.FC<StoryPageProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <div className="space-y-24 md:space-y-36 pb-24 text-left">
      {/* Editorial Header */}
      <section className="bg-[#F5EFEB] border-b border-[#EAE3D2] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C29B38] font-medium block">
            Brand Story & Lineage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#1C1B1A] leading-tight">
            The Art of Living in the Moment
          </h1>
          <p className="text-sm md:text-base text-[#5C5854] font-light max-w-2xl mx-auto leading-relaxed">
            Elevating everyday spaces into sanctuaries of calm, memory, and presence.
          </p>
        </div>
      </section>

      {/* Philosophy Main Article */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#8A7E72] font-medium block">
              Core Belief
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1B1A]">
              Fragrance as an Everyday Ritual
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-[#4A4744] font-light leading-relaxed">
              <p>
                At <strong>Immerse Lume</strong>, we believe that fragrance has the power to transform a space, evoke emotions and turn everyday rituals into cherished experiences.
              </p>
              <p>
                Inspired by the beauty of nature, the warmth of meaningful moments and the timeless appeal of elegant design, we create scented candles that bring together captivating fragrances and beautiful glass vessels.
              </p>
              <p className="italic font-serif text-lg text-[#1C1B1A] pt-2">
                "Our philosophy is simple: create fragrances that inspire you to pause, breathe and immerse yourself in the present."
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-3/4 bg-[#EAE3D2] overflow-hidden shadow-xl border border-[#EAE3D2]">
              <img
                src="/assets/images/hero_luxury_candle_interior_1793372721571.jpg"
                alt="Immerse Lume Atmosphere"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* The Three Pillars of Craft */}
        <div className="pt-16 border-t border-[#EAE3D2] space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C29B38] font-medium block">
              Our Principles
            </span>
            <h3 className="font-serif text-3xl font-medium text-[#1C1B1A]">
              Crafted with Intention
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#F5EFEB] border border-[#EAE3D2] space-y-4">
              <Flame className="w-6 h-6 text-[#C29B38]" />
              <h4 className="font-serif text-xl font-medium text-[#1C1B1A]">
                Pure Natural Soy Wax
              </h4>
              <p className="text-xs text-[#5C5854] font-light leading-relaxed">
                We formulate exclusively with sustainable natural soy wax and lead-free cotton wicks, ensuring a non-toxic, slow, even burn with zero petroleum derivatives.
              </p>
            </div>

            <div className="p-8 bg-[#F5EFEB] border border-[#EAE3D2] space-y-4">
              <Sparkles className="w-6 h-6 text-[#C29B38]" />
              <h4 className="font-serif text-xl font-medium text-[#1C1B1A]">
                Sensory Composition
              </h4>
              <p className="text-xs text-[#5C5854] font-light leading-relaxed">
                From golden saffron and creamy sandalwood to dewy Arabian jasmine and sun-cured vanilla, each fragrance formula is developed to unveil nuanced layers over hours of burning.
              </p>
            </div>

            <div className="p-8 bg-[#F5EFEB] border border-[#EAE3D2] space-y-4">
              <div className="w-6 h-6 text-[#C29B38] font-serif font-bold text-lg">
                ◈
              </div>
              <h4 className="font-serif text-xl font-medium text-[#1C1B1A]">
                Enduring Vessels
              </h4>
              <p className="text-xs text-[#5C5854] font-light leading-relaxed">
                Designed to be admired during and after candle life. Heavy glass screw jars, fluted lines, hammered metal bowls, and embossed mandala tins become keepsake decorative objects.
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Image Banner */}
        <div className="relative aspect-21/9 w-full bg-[#1C1B1A] overflow-hidden shadow-xl">
          <img
            src="/assets/images/hero_luxury_candle_interior_1793372721571.jpg"
            alt="Immerse Lume Interior"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="max-w-xl space-y-4">
              <h3 className="font-serif text-2xl md:text-3xl font-light text-white italic">
                "Fragrance is the quietest architecture of any room."
              </h3>
              <p className="text-xs uppercase tracking-[0.24em] text-[#DFC27D]">
                Hand-poured in India
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center pt-8 space-y-6">
          <h3 className="font-serif text-3xl font-medium text-[#1C1B1A]">
            Experience the Fragrances
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onNavigate('/collections')}
              className="px-8 py-3.5 bg-[#1C1B1A] text-[#FDFBF7] hover:bg-[#323827] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              Explore Catalogue
            </button>
            <button
              onClick={onOpenEnquiry}
              className="px-8 py-3.5 border border-[#1C1B1A] text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-[#FDFBF7] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              Concierge Enquiry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
