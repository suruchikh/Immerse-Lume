import React, { useState, useEffect } from 'react';
import { Product, Collection } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CollectionsPageProps {
  products: Product[];
  collections: Collection[];
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  products,
  collections,
  initialCategory,
  onSelectProduct
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');

  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const categoryOptions = [
    'All',
    'Glass Candles',
    'Metal Candles',
    'Mandala Candles',
    'Diffusers',
    'Diffuser Oils',
    'Gift Sets'
  ];

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const activeCollectionInfo = collections.find((c) => c.name === activeCategory);

  return (
    <div className="space-y-16 md:space-y-24 pb-24 text-left">
      {/* Header Banner */}
      <section className="bg-[#F5EFEB] border-b border-[#EAE3D2] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#C29B38] font-medium block">
            Product Catalogue
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-[#1C1B1A]">
            The Immerse Lume Collections
          </h1>
          <p className="text-xs sm:text-sm text-[#5C5854] font-light max-w-xl mx-auto leading-relaxed">
            {activeCollectionInfo
              ? activeCollectionInfo.description
              : 'Discover handcrafted natural soy wax scented candles, botanical slow diffusers, and luxury presentation gift boxes.'}
          </p>
        </div>
      </section>

      {/* Filter Navigation */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-start md:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar border-b border-[#EAE3D2]/70">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] whitespace-nowrap transition-colors cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-[#1C1B1A] text-[#FDFBF7] border-[#1C1B1A] font-medium'
                  : 'bg-[#FDFBF7] text-[#5C5854] border-[#EAE3D2] hover:border-[#1C1B1A] hover:text-[#1C1B1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Collection Spotlight if specific category selected */}
      {activeCollectionInfo && activeCollectionInfo.image && (
        <section className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#FDFBF7] border border-[#EAE3D2] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xs">
            <div className="w-full md:w-1/3 aspect-4/3 bg-[#EAE3D2]/40 overflow-hidden">
              <img
                src={activeCollectionInfo.image}
                alt={activeCollectionInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-2/3 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
                Category Focus · {activeCollectionInfo.parentCategory}
              </span>
              <h2 className="font-serif text-3xl font-medium text-[#1C1B1A]">
                {activeCollectionInfo.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4744] font-light leading-relaxed">
                {activeCollectionInfo.description}
              </p>
              <div className="pt-2 text-[11px] text-[#8A7E72] flex items-center gap-4">
                <span>Handcrafted with natural ingredients</span>
                <span>·</span>
                <span>Vessel re-usable</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#F5EFEB] border border-[#EAE3D2] p-8 space-y-3">
            <p className="font-serif text-xl text-[#1C1B1A]">No vessels found in this collection.</p>
            <p className="text-xs text-[#8A7E72]">
              Select another category above or view all products.
            </p>
            <button
              onClick={() => setActiveCategory('All')}
              className="mt-4 px-6 py-2.5 bg-[#1C1B1A] text-white text-xs uppercase tracking-wider"
            >
              Show All Collections
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </section>

      {/* Catalogue Note */}
      <section className="max-w-3xl mx-auto px-6 text-center space-y-3 pt-8">
        <p className="text-xs text-[#8A7E72] font-light">
          Immerse Lume candles are produced in small artisanal batches to maintain maximum fragrance saturation. Bespoke orders and custom gifting boxes can be requested via our concierge.
        </p>
      </section>
    </div>
  );
};
