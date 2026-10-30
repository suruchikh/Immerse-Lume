import React from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Gift, HeartHandshake, CheckCircle2, Send } from 'lucide-react';

interface GiftingPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (subject?: string) => void;
}

export const GiftingPage: React.FC<GiftingPageProps> = ({
  products,
  onSelectProduct,
  onOpenEnquiry
}) => {
  const giftingProducts = products.filter((p) => p.category === 'Gift Sets');

  return (
    <div className="space-y-24 md:space-y-36 pb-24 text-left">
      {/* Header Banner */}
      <section className="bg-[#F5EFEB] border-b border-[#EAE3D2] py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C29B38] font-medium block">
            The Gifting Atelier
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#1C1B1A]">
            Curated Expressions of Generosity
          </h1>
          <p className="text-sm md:text-base text-[#5C5854] font-light max-w-2xl mx-auto leading-relaxed">
            Thoughtfully packaged in heavy rigid gift boxes adorned with hot-stamped gold foil and silk grosgrain ribbon. Crafted to make every occasion memorable.
          </p>
        </div>
      </section>

      {/* Hero Gifting Presentation */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
              The Presentation Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-[#1C1B1A] leading-tight">
              Unboxing the Art of Presence
            </h2>
            <p className="text-sm text-[#4A4744] font-light leading-relaxed">
              Every Immerse Lume gift set is designed as a sensory ceremony. Beyond the fragrance itself, the tactile feel of custom paper stock, the gleam of embossed metallic accents, and the ritual of lighting the candle create an indelible memory.
            </p>

            <div className="space-y-3 pt-2 text-xs text-[#5C5854]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C29B38]" />
                <span>Custom gold foil embossing with brand crest or client initials</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C29B38]" />
                <span>Curated duets or complete signature fragrance quartets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C29B38]" />
                <span>Bespoke handwritten calligraphy notes on weighted ivory card</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => onOpenEnquiry('Bespoke Gifting Box Consultation')}
                className="px-8 py-3.5 bg-[#1C1B1A] text-[#FDFBF7] hover:bg-[#323827] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 text-[#DFC27D]" />
                <span>Enquire For Gifting</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 bg-[#EAE3D2] overflow-hidden shadow-xl border border-[#EAE3D2]">
              <img
                src="/assets/images/collection_gift_sets_1793372756741.jpg"
                alt="Luxury Presentation Gifting Box"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gifting Products */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
            Curated Ensembles
          </span>
          <h3 className="font-serif text-3xl font-medium text-[#1C1B1A]">
            Signature Gifting Sets
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftingProducts.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
          ))}
          {products.slice(0, 2).map((p) => (
            <ProductCard key={`alt-${p.id}`} product={p} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* Corporate & Celebrations Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 md:p-12 bg-[#F5EFEB] border border-[#EAE3D2] space-y-4">
            <HeartHandshake className="w-8 h-8 text-[#C29B38]" />
            <h3 className="font-serif text-2xl font-medium text-[#1C1B1A]">
              Corporate & Executive Tributes
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Express gratitude to esteemed partners, clients, and senior leaders with custom-curated fragrance suites. We accommodate volume corporate requisitions with customized insignia ribbons, personalized booklets, and direct concierge delivery across India.
            </p>
            <button
              onClick={() => onOpenEnquiry('Corporate Executive Gifting Enquiry')}
              className="text-xs uppercase tracking-[0.16em] text-[#1C1B1A] font-medium hover:text-[#C29B38] transition-colors border-b border-[#1C1B1A] pb-1 cursor-pointer pt-2 inline-block"
            >
              Request Corporate Brochure
            </button>
          </div>

          <div className="p-8 md:p-12 bg-[#F5EFEB] border border-[#EAE3D2] space-y-4">
            <Gift className="w-8 h-8 text-[#C29B38]" />
            <h3 className="font-serif text-2xl font-medium text-[#1C1B1A]">
              Weddings & Landmark Celebrations
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Commemorate your most cherished milestones with unforgettable fragrant favours. From intimate wedding hampers to grand celebratory favors in our Lustre Bowl Urlis and Mandala Tins, we tailor fragrance accords and packaging to harmonize with your celebrations.
            </p>
            <button
              onClick={() => onOpenEnquiry('Wedding & Milestone Celebrations Enquiry')}
              className="text-xs uppercase tracking-[0.16em] text-[#1C1B1A] font-medium hover:text-[#C29B38] transition-colors border-b border-[#1C1B1A] pb-1 cursor-pointer pt-2 inline-block"
            >
              Plan Celebration Favours
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
