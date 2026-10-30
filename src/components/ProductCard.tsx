import React from 'react';
import { Product } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const rawImage = product.images?.[0] || '/assets/images/product_atelier_screw_jar_1793372739090.jpg';
  // Normalize path for both Vite dev and production build
  const primaryImage = rawImage.replace('/src/assets/images/', '/assets/images/');

  return (
    <div
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-[#FDFBF7] border border-[#EAE3D2] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden text-left"
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-[#F5EFEB] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        {product.burnTime && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-[#1C1B1A]/85 backdrop-blur-xs text-[#EAE3D2] text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 sm:py-1 font-light">
            {product.burnTime}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          {/* Category & Vessel metadata */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-[#8A7E72] tracking-[0.16em] uppercase">
            <span>{product.category}</span>
            {product.weight && (
              <>
                <span>·</span>
                <span>{product.weight}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-medium text-[#1C1B1A] group-hover:text-[#C29B38] transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#5C5854] line-clamp-2 font-light leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Available Fragrances and Specs summary */}
        <div className="pt-2 border-t border-[#EAE3D2]/60 space-y-2.5 sm:space-y-3">
          {product.fragrances?.length > 0 && (
            <div className="text-[10px] sm:text-[11px] text-[#8A7E72] flex items-center gap-1.5 truncate">
              <Sparkles className="w-3 h-3 text-[#C29B38] shrink-0" />
              <span className="truncate">
                {product.fragrances.slice(0, 3).join(', ')}
                {product.fragrances.length > 3 ? ` +${product.fragrances.length - 3}` : ''}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#1C1B1A] group-hover:text-[#C29B38] font-medium flex items-center gap-1.5 transition-colors min-h-[36px]">
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
            <span className="text-[10px] text-[#8A7E72] tracking-wider uppercase">
              {product.waxType || 'Natural soy wax'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
