import React from 'react';
import { Product, Collection, Fragrance, PageSection, GlobalSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Sparkles, ArrowRight, ShieldCheck, Flame, HeartHandshake, Gift, Compass } from 'lucide-react';

interface HomePageProps {
  products: Product[];
  collections: Collection[];
  fragrances: Fragrance[];
  sections: PageSection[];
  settings: GlobalSettings;
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenEnquiry: (subject?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  collections,
  fragrances,
  sections,
  settings,
  onNavigate,
  onSelectProduct,
  onOpenEnquiry
}) => {
  // Find hero section from dynamic sections or fallback to defaults
  const heroSection = sections.find((s) => s.sectionKey === 'hero') || {
    title: 'The Art of Living in the Moment',
    content: 'Discover the art of fragrance, thoughtfully crafted to transform everyday spaces into extraordinary experiences.',
    mediaUrl: '/assets/images/hero_luxury_candle_interior_1793372721571.jpg',
    buttonText: 'Explore Collections',
    buttonLink: '/collections',
    secondaryButtonText: 'Discover Our Story',
    secondaryButtonLink: '/story'
  };

  const philosophySection = sections.find((s) => s.sectionKey === 'philosophy') || {
    title: 'Our Philosophy',
    content: 'At Immerse Lume, we believe that fragrance has the power to transform a space, evoke emotions and turn everyday rituals into cherished experiences. Inspired by the beauty of nature, the warmth of meaningful moments and the timeless appeal of elegant design, we create scented candles that bring together captivating fragrances and beautiful glass vessels.',
    secondaryContent: 'Our philosophy is simple: create fragrances that inspire you to pause, breathe and immerse yourself in the present.'
  };

  const lifestyleSection = sections.find((s) => s.sectionKey === 'lifestyle') || {
    title: 'Create Moments Worth Remembering',
    content: 'Whether welcoming guests into your home, winding down at twilight, or gifting someone an unforgettable gesture of affection, Immerse Lume creates an atmospheric sanctuary of warmth and tranquility.'
  };

  const statementSection = sections.find((s) => s.sectionKey === 'statement') || {
    title: 'Immerse Yourself in the Extraordinary.',
    content: 'Handcrafted natural soy wax candles and botanical diffusers created with quiet sophistication and artistic purpose.'
  };

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

  // Normalize image url
  const heroMedia = (heroSection.mediaUrl || '/assets/images/hero_luxury_candle_interior_1793372721571.jpg')
    .replace('/src/assets/images/', '/assets/images/');

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-36 pb-20">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center bg-[#1C1B1A] text-[#FDFBF7] overflow-hidden">
        {/* Background Image with cinematic luxury scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroMedia}
            alt="Immerse Lume Luxury Atmosphere"
            className="w-full h-full object-cover object-center opacity-70 scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A] via-[#1C1B1A]/45 to-[#1C1B1A]/35" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 py-14 sm:py-20">
          <div className="space-y-2.5 sm:space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#DFC27D] font-medium block">
              {settings.tagline || 'Elevate Every Moment.'}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.12] max-w-3xl mx-auto [text-wrap:balance]">
              {heroSection.title}
            </h1>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-[#EAE3D2] font-light max-w-2xl mx-auto leading-relaxed tracking-wide [text-wrap:balance] px-2">
            {heroSection.content}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigate(heroSection.buttonLink || '/collections')}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 min-h-[48px] bg-[#FDFBF7] text-[#1C1B1A] hover:bg-[#DFC27D] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer shadow-md flex items-center justify-center active:bg-[#DFC27D]"
            >
              {heroSection.buttonText || 'Explore Collections'}
            </button>
            <button
              onClick={() => onNavigate(heroSection.secondaryButtonLink || '/story')}
              className="w-full sm:w-auto px-7 py-3.5 sm:py-4 min-h-[48px] border border-[#FDFBF7]/60 text-[#FDFBF7] hover:bg-[#FDFBF7]/10 transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center"
            >
              {heroSection.secondaryButtonText || 'Discover Our Story'}
            </button>
          </div>
        </div>

        {/* Ambient bottom indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-[#EAE3D2]/70 flex items-center gap-2 whitespace-nowrap px-4 text-center">
          <span>Artisanal Soy Wax & Glass Vessels</span>
        </div>
      </section>

      {/* 2. BRAND PHILOSOPHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
                Brand Philosophy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-[#1C1B1A] leading-tight">
                {philosophySection.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-[#4A4744] font-light leading-relaxed">
              {philosophySection.content}
            </p>

            {philosophySection.secondaryContent && (
              <blockquote className="border-l-2 border-[#C29B38] pl-4 italic text-xs sm:text-sm text-[#1C1B1A] font-serif py-1">
                "{philosophySection.secondaryContent}"
              </blockquote>
            )}

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/story')}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#1C1B1A] hover:text-[#C29B38] transition-colors border-b border-[#1C1B1A] pb-1 cursor-pointer min-h-[36px]"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              <div className="aspect-16/10 bg-[#F5EFEB] overflow-hidden shadow-lg border border-[#EAE3D2]">
                <img
                  src="/assets/images/product_atelier_screw_jar_1793372739090.jpg"
                  alt="Immerse Lume Handcrafted Candle Vessel"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-6 -left-6 bg-[#FDFBF7] border border-[#EAE3D2] p-5 shadow-lg max-w-xs text-left">
                <p className="text-[11px] text-[#8A7E72] uppercase tracking-[0.18em]">
                  Handcrafted In India
                </p>
                <p className="font-serif text-sm font-medium text-[#1C1B1A] mt-1">
                  Pure soy wax poured into custom artisanal glass and metal vessels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-14">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
            Curated Expressions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-[#1C1B1A]">
            The Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5854] font-light">
            Explore our distinct categories of scented candles, slow diffusers, and luxury gifting boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => onNavigate(`/collections?category=${encodeURIComponent(col.name)}`)}
              className="group relative bg-[#F5EFEB] border border-[#EAE3D2] overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-4/3 w-full bg-[#EAE3D2]/50 overflow-hidden">
                <img
                  src={col.image?.replace('/src/assets/images/', '/assets/images/') || '/assets/images/product_atelier_screw_jar_1793372739090.jpg'}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6 space-y-2 text-left bg-[#FDFBF7]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A7E72] block">
                  {col.parentCategory}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1B1A] group-hover:text-[#C29B38] transition-colors">
                  {col.name}
                </h3>
                <p className="text-xs text-[#5C5854] font-light line-clamp-2">
                  {col.description}
                </p>
                <div className="pt-2 sm:pt-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] group-hover:text-[#C29B38] transition-colors min-h-[36px]">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SIGNATURE FRAGRANCES SHOWCASE */}
      <section className="bg-[#1C1B1A] text-[#FDFBF7] py-16 sm:py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-10 sm:space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#2E2C29]">
            <div className="space-y-2 text-left">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#DFC27D] font-medium block">
                Sensory Palette
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-normal text-white">
                Four Signature Fragrances
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/fragrances')}
              className="text-xs uppercase tracking-[0.2em] text-[#DFC27D] hover:text-white transition-colors flex items-center gap-2 cursor-pointer pb-1 self-start sm:self-auto min-h-[36px]"
            >
              <span>Explore All Notes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fragrances.map((frag) => (
              <div
                key={frag.id}
                onClick={() => onNavigate(`/fragrances#${frag.slug}`)}
                className="group bg-[#242220] border border-[#33302C] p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:border-[#DFC27D]/60 hover:-translate-y-1 cursor-pointer text-left"
              >
                <div className="aspect-square w-full bg-[#1C1B1A] overflow-hidden relative">
                  <img
                    src={frag.image?.replace('/src/assets/images/', '/assets/images/')}
                    alt={frag.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 text-[10px] uppercase tracking-[0.2em] text-[#DFC27D]">
                    {frag.subTitle}
                  </span>
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="font-serif text-xl sm:text-2xl font-medium text-white group-hover:text-[#DFC27D] transition-colors">
                    {frag.name}
                  </h3>
                  <p className="text-xs text-[#DFC27D]/90 italic font-light">
                    "{frag.tagline}"
                  </p>
                  <p className="text-xs text-[#8A7E72] font-light line-clamp-3 leading-relaxed pt-1">
                    {frag.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#33302C] text-[11px] text-[#A69B8F] flex items-center justify-between min-h-[36px]">
                  <span className="uppercase tracking-wider">Discover Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DFC27D] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS CATALOGUE (NO CART, NO PRICING) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12 pb-4 border-b border-[#EAE3D2]">
          <div className="space-y-2 text-left">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-[#1C1B1A]">
              Selected Vessels
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/collections')}
            className="text-xs uppercase tracking-[0.2em] text-[#1C1B1A] hover:text-[#C29B38] transition-colors flex items-center gap-2 cursor-pointer pb-1 self-start sm:self-auto font-medium min-h-[36px]"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 6. LIFESTYLE EDITORIAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-[#F5EFEB] border border-[#EAE3D2] p-6 sm:p-12 lg:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#C29B38] font-medium block">
                Atmosphere & Living
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-[#1C1B1A] leading-tight">
                {lifestyleSection.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4744] font-light leading-relaxed">
                {lifestyleSection.content}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/fragrances')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#1C1B1A] text-[#FDFBF7] hover:bg-[#323827] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center"
                >
                  Explore Scent Pairings
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-4/3 bg-[#EAE3D2] overflow-hidden shadow-md">
                <img
                  src="/assets/images/hero_luxury_candle_interior_1793372721571.jpg"
                  alt="Luxury Candle Interior Atmosphere"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY IMMERSE LUME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-left">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3 mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
            Craftsmanship & Intention
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-medium text-[#1C1B1A]">
            Why Immerse Lume
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5854] font-light">
            Every creation is grounded in natural ingredients, artisanal vessels, and purposeful fragrance formulation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#EAE3D2] space-y-3">
            <Flame className="w-6 h-6 text-[#C29B38]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">
              Natural Soy Wax
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Clean-burning natural soy wax poured by hand to ensure minimal soot and an even, serene flame.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#EAE3D2] space-y-3">
            <Sparkles className="w-6 h-6 text-[#C29B38]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">
              Thoughtfully Crafted
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Botanical and fine fragrance oils carefully blended to create complex, lingering olfactory profiles.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#EAE3D2] space-y-3">
            <Compass className="w-6 h-6 text-[#C29B38]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">
              Elegant Vessels
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Heavy tactile glass jars with screw lids, fluted lines, hammered metal urlis, and embossed mandala tins.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#EAE3D2] space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#C29B38]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">
              Meaningful Moments
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Created to inspire you to pause, breathe, reflect, and immerse yourself in the present ritual.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-[#FDFBF7] border border-[#EAE3D2] space-y-3 sm:col-span-2 lg:col-span-1">
            <Gift className="w-6 h-6 text-[#C29B38]" />
            <h3 className="font-serif text-lg font-medium text-[#1C1B1A]">
              Perfect for Gifting
            </h3>
            <p className="text-xs text-[#5C5854] font-light leading-relaxed">
              Luxe rigid presentation boxes, satin ribbons, and bespoke gift tags curated for milestones.
            </p>
          </div>
        </div>
      </section>

      {/* 8. GIFTING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="bg-[#1C1B1A] text-[#FDFBF7] p-6 sm:p-12 lg:p-20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-left">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.26em] text-[#DFC27D] font-medium block">
                Bespoke Offerings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-normal text-white leading-tight">
                An Expression of Thoughtful Generosity
              </h2>
              <p className="text-xs sm:text-sm text-[#EAE3D2] font-light leading-relaxed">
                Whether celebrating wedding celebrations, corporate milestones, or intimate personal occasions, Immerse Lume gift sets arrive in exquisite rigid keepsake boxes with gold foil detailing and handwritten message options.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => onNavigate('/gifting')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] bg-[#FDFBF7] text-[#1C1B1A] hover:bg-[#DFC27D] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center"
                >
                  Explore Gift Sets
                </button>
                <button
                  onClick={() => onOpenEnquiry('Bespoke Gifting Concierge Consultation')}
                  className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] border border-[#FDFBF7]/60 text-white hover:bg-white/10 transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer flex items-center justify-center"
                >
                  Concierge Gifting Enquiry
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="aspect-4/3 bg-[#2E2C29] overflow-hidden shadow-2xl border border-[#3E3A36]">
                <img
                  src="/assets/images/collection_gift_sets_1793372756741.jpg"
                  alt="Immerse Lume Luxury Gift Box"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL BRAND STATEMENT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6 pt-6 sm:pt-10">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C29B38] font-medium block">
          Immerse Lume
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#1C1B1A]">
          {statementSection.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#5C5854] font-light max-w-xl mx-auto px-2">
          {statementSection.content}
        </p>
        <div className="pt-2 sm:pt-4">
          <button
            onClick={() => onNavigate('/contact')}
            className="w-full sm:w-auto px-8 py-4 min-h-[48px] bg-[#1C1B1A] text-[#FDFBF7] hover:bg-[#323827] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer"
          >
            Connect With Concierge
          </button>
        </div>
      </section>
    </div>
  );
};
