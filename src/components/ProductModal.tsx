import React, { useState, useEffect } from 'react';
import { Product, Fragrance } from '../types';
import { X, Clock, Flame, ShieldCheck, MapPin, Sparkles, Send } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  fragrancesList: Fragrance[];
  onClose: () => void;
  onOpenEnquiry: (productName: string) => void;
  onSelectRelated?: (product: Product) => void;
  allProducts?: Product[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  fragrancesList,
  onClose,
  onOpenEnquiry,
  onSelectRelated,
  allProducts = []
}) => {
  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFragrance, setSelectedFragrance] = useState<string>(
    product.fragrances?.[0] || ''
  );
  const [selectedColour, setSelectedColour] = useState<string>(
    product.colours?.[0] || ''
  );

  useEffect(() => {
    setSelectedImageIndex(0);
    setSelectedFragrance(product.fragrances?.[0] || '');
    setSelectedColour(product.colours?.[0] || '');
  }, [product]);

  // Lock body scroll when modal is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const images = product.images?.length > 0
    ? product.images
    : ['/assets/images/product_atelier_screw_jar_1793372739090.jpg'];

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const activeFragranceDetails = fragrancesList.find(
    (f) => f.name.toLowerCase() === selectedFragrance.toLowerCase()
  );

  const handleEnquireAction = () => {
    onClose();
    onOpenEnquiry(`${product.name} (${selectedFragrance ? `Fragrance: ${selectedFragrance}` : ''})`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6">
      <div className="relative w-full max-w-5xl bg-[#FDFBF7] shadow-2xl border-0 sm:border border-[#EAE3D2] h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Sticky Mobile/Desktop Header with Close Button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#EAE3D2] bg-[#FDFBF7] shrink-0 z-20">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#8A7E72] font-medium truncate pr-2">
            <span>{product.category}</span>
            {product.weight && <span> · {product.weight}</span>}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#1C1B1A] hover:text-[#C29B38] transition-colors rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close product modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Visual Gallery */}
            <div className="lg:col-span-6 p-4 sm:p-6 md:p-8 bg-[#F5EFEB] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE3D2]">
              <div className="space-y-4">
                {/* Main Featured Image */}
                <div className="aspect-4/3 w-full bg-[#EAE3D2]/40 overflow-hidden shadow-xs relative">
                  <img
                    src={images[selectedImageIndex] || images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  {product.burnTime && (
                    <div className="absolute bottom-3 left-3 bg-[#1C1B1A]/85 text-[#FDFBF7] text-[10px] tracking-widest uppercase px-2.5 py-1 font-light flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#C29B38]" />
                      <span>{product.burnTime}</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative w-16 sm:w-20 h-14 sm:h-16 shrink-0 border-2 overflow-hidden cursor-pointer transition-all ${
                          selectedImageIndex === idx
                            ? 'border-[#C29B38] opacity-100'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#EAE3D2] text-[11px] text-[#5C5854]">
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                  <span className="truncate">{product.waxType || 'Natural Soy Wax'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                  <span>Single Cotton Wick</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                  <span>Origin: {product.countryOfOrigin || 'India'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C29B38] shrink-0" />
                  <span>Artisanal Vessel</span>
                </div>
              </div>
            </div>

            {/* Right Column: Information & Enquiry */}
            <div className="lg:col-span-6 p-5 sm:p-6 md:p-8 space-y-6 flex flex-col justify-between text-left">
              <div className="space-y-6">
                {/* Header Title */}
                <div className="space-y-1.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1B1A] leading-snug">
                    {product.name}
                  </h2>
                  <p className="text-xs text-[#5C5854] font-light italic">
                    {product.vessel}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#4A4744] font-light leading-relaxed">
                  {product.fullDescription || product.shortDescription}
                </p>

                {/* Available Fragrances Selector */}
                {product.fragrances?.length > 0 && (
                  <div className="space-y-2.5">
                    <label className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] block">
                      Available Signature Fragrances: <span className="font-semibold text-[#C29B38]">{selectedFragrance}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.fragrances.map((frag) => (
                        <button
                          key={frag}
                          onClick={() => setSelectedFragrance(frag)}
                          className={`px-3 py-2 text-xs transition-colors cursor-pointer border min-h-[38px] flex items-center ${
                            selectedFragrance === frag
                              ? 'bg-[#1C1B1A] text-[#FDFBF7] border-[#1C1B1A]'
                              : 'bg-white text-[#5C5854] border-[#EAE3D2] hover:border-[#1C1B1A]'
                          }`}
                        >
                          {frag}
                        </button>
                      ))}
                    </div>

                    {/* Active fragrance notes snippet */}
                    {activeFragranceDetails && (
                      <div className="bg-[#F5EFEB] p-3 text-[11px] text-[#5C5854] space-y-1 rounded-xs border border-[#EAE3D2]">
                        <p className="font-medium text-[#1C1B1A] italic">
                          "{activeFragranceDetails.tagline}"
                        </p>
                        {activeFragranceDetails.notes?.top && (
                          <div><strong className="text-[#1C1B1A]">Top:</strong> {activeFragranceDetails.notes.top}</div>
                        )}
                        {activeFragranceDetails.notes?.heart && (
                          <div><strong className="text-[#1C1B1A]">Heart:</strong> {activeFragranceDetails.notes.heart}</div>
                        )}
                        {activeFragranceDetails.notes?.base && (
                          <div><strong className="text-[#1C1B1A]">Base:</strong> {activeFragranceDetails.notes.base}</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Available Colours */}
                {product.colours?.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] block">
                      Vessel Palette: <span className="font-semibold text-[#8A7E72]">{selectedColour}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.colours.map((col) => (
                        <button
                          key={col}
                          onClick={() => setSelectedColour(col)}
                          className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer min-h-[36px] flex items-center ${
                            selectedColour === col
                              ? 'border-[#1C1B1A] bg-[#1C1B1A] text-white'
                              : 'border-[#EAE3D2] bg-white text-[#5C5854] hover:border-[#8A7E72]'
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Table */}
                <div className="border-t border-[#EAE3D2] pt-4 space-y-2.5">
                  <h4 className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#1C1B1A]">
                    Vessel & Pour Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div className="text-[#8A7E72]">Wax Formulation:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.waxType || 'Natural soy wax'}</div>

                    <div className="text-[#8A7E72]">Net Weight:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.weight}</div>

                    <div className="text-[#8A7E72]">Vessel Format:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.vessel}</div>

                    <div className="text-[#8A7E72]">Wick Architecture:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.wicks} Pure Cotton Wick</div>

                    {product.burnTime && (
                      <>
                        <div className="text-[#8A7E72]">Burn Longevity:</div>
                        <div className="text-[#1C1B1A] font-medium">{product.burnTime}</div>
                      </>
                    )}

                    <div className="text-[#8A7E72]">Environment:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.usage || 'Indoor use'}</div>

                    <div className="text-[#8A7E72]">Country of Origin:</div>
                    <div className="text-[#1C1B1A] font-medium">{product.countryOfOrigin || 'India'}</div>
                  </div>
                </div>

                {/* Care instructions */}
                {product.careInstructions && product.careInstructions.length > 0 && (
                  <div className="border-t border-[#EAE3D2] pt-4 space-y-2">
                    <h4 className="text-[11px] uppercase tracking-[0.18em] font-medium text-[#1C1B1A]">
                      Ritual Care Instructions
                    </h4>
                    <ul className="text-xs text-[#5C5854] space-y-1 list-disc list-inside font-light">
                      {product.careInstructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-[#EAE3D2] space-y-2">
                <button
                  onClick={handleEnquireAction}
                  className="w-full min-h-[48px] py-3.5 bg-[#1C1B1A] hover:bg-[#323827] text-[#FDFBF7] uppercase tracking-[0.2em] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:bg-[#323827]"
                >
                  <Send className="w-3.5 h-3.5 text-[#DFC27D]" />
                  <span>Enquire With Concierge</span>
                </button>
                <p className="text-[11px] text-center text-[#8A7E72]">
                  Bespoke corporate, wedding, and residential private enquiries welcome.
                </p>
              </div>
            </div>
          </div>

          {/* Related Products strip */}
          {relatedProducts.length > 0 && onSelectRelated && (
            <div className="p-4 sm:p-6 md:p-8 bg-[#FDFBF7] border-t border-[#EAE3D2] text-left">
              <h4 className="text-xs uppercase tracking-[0.2em] font-medium text-[#8A7E72] mb-3">
                Complementary Vessels in {product.category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelated(rel)}
                    className="flex items-center gap-3 p-2.5 bg-[#F5EFEB] hover:bg-[#EAE3D2]/50 transition-colors text-left border border-[#EAE3D2] min-h-[52px]"
                  >
                    <img
                      src={rel.images?.[0] || '/assets/images/product_atelier_screw_jar_1793372739090.jpg'}
                      alt={rel.name}
                      className="w-12 h-12 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#1C1B1A] truncate">{rel.name}</p>
                      <p className="text-[10px] text-[#8A7E72]">{rel.weight}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
