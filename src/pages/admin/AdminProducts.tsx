import React, { useState } from 'react';
import { Product, Fragrance, Collection } from '../../types';
import { createProduct, updateProduct, deleteProduct, duplicateProduct } from '../../services/api';
import { Plus, Edit2, Trash2, Copy, Check, Eye, EyeOff, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  fragrances: Fragrance[];
  collections: Collection[];
  onRefresh: () => void;
  openMediaPicker?: (onSelect: (url: string) => void) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  fragrances,
  collections,
  onRefresh
}) => {
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const emptyProduct: Partial<Product> = {
    name: '',
    category: 'Glass Candles',
    subCategory: '',
    shortDescription: '',
    fullDescription: '',
    images: ['/assets/images/product_atelier_screw_jar_1793372739090.jpg'],
    fragrances: ['Crimson Canopy', 'Petals in the Hearth'],
    colours: ['Red', 'Green'],
    weight: '200 g',
    vessel: 'Glass jar with lid',
    wicks: 1,
    burnTime: 'Approximately 35 hours',
    usage: 'Indoor use',
    countryOfOrigin: 'India',
    waxType: 'Natural soy wax',
    dimensions: '',
    careInstructions: [
      'Trim wick to 5mm before lighting.',
      'Allow wax pool to reach jar rim.'
    ],
    featured: false,
    published: true,
    order: products.length + 1
  };

  const handleStartCreate = () => {
    setEditingProduct({ ...emptyProduct });
    setIsCreating(true);
  };

  const handleStartEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.category) return;
    setLoading(true);

    try {
      if (isCreating) {
        await createProduct(editingProduct);
        setMessage('Product successfully created');
      } else if (editingProduct.id) {
        await updateProduct(editingProduct.id, editingProduct);
        setMessage('Product successfully updated');
      }
      setEditingProduct(null);
      onRefresh();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct(id);
      onRefresh();
      setMessage('Product duplicated as draft');
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error duplicating product');
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      await updateProduct(p.id, { published: !p.published });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMoveOrder = async (p: Product, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex((item) => item.id === p.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === products.length - 1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetProduct = products[targetIndex];

    try {
      await updateProduct(p.id, { order: targetProduct.order });
      await updateProduct(targetProduct.id, { order: p.order });
      onRefresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = filterCategory === 'All'
    ? products
    : products.filter((p) => p.category === filterCategory);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#33302C]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Product Catalogue Management
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Manage vessels, fragrance allocations, color variants, weights, and burn times.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 min-h-[44px] bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {['All', 'Glass Candles', 'Metal Candles', 'Mandala Candles', 'Diffusers', 'Diffuser Oils', 'Gift Sets'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-2 text-xs whitespace-nowrap transition-colors cursor-pointer border min-h-[38px] flex items-center shrink-0 ${
              filterCategory === cat
                ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
                : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile Card View (Visible on <md screens) */}
      <div className="md:hidden space-y-4">
        {filtered.map((product, idx) => (
          <div
            key={product.id}
            className="bg-[#242220] border border-[#33302C] p-4 space-y-3"
          >
            <div className="flex gap-3">
              <img
                src={product.images?.[0] || '/assets/images/product_atelier_screw_jar_1793372739090.jpg'}
                alt={product.name}
                className="w-16 h-16 object-cover border border-[#33302C] bg-[#1C1B1A] shrink-0"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#DFC27D] uppercase font-mono">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(product, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#8A7E72] hover:text-[#DFC27D] disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(product, 'down')}
                      disabled={idx === filtered.length - 1}
                      className="p-1 text-[#8A7E72] hover:text-[#DFC27D] disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-lg font-medium text-white truncate">
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#8A7E72]">
                  {product.weight} · {product.burnTime || product.vessel}
                </p>
              </div>
            </div>

            <div className="text-[11px] text-[#8A7E72] border-t border-[#33302C] pt-2">
              <span className="text-white font-medium">Scents: </span>
              {product.fragrances?.join(', ') || 'None'}
            </div>

            {/* Mobile Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#33302C]">
              <button
                onClick={() => handleTogglePublish(product)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium cursor-pointer border min-h-[36px] ${
                  product.published
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {product.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{product.published ? 'Live' : 'Draft'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(product)}
                  className="p-2 text-[#8A7E72] hover:text-[#DFC27D] min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Edit product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDuplicate(product.id)}
                  className="p-2 text-[#8A7E72] hover:text-[#DFC27D] min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Duplicate product"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  className="p-2 text-[#8A7E72] hover:text-red-400 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Products Table (Visible on md+ screens) */}
      <div className="hidden md:block bg-[#242220] border border-[#33302C] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C1B1A] text-[#8A7E72] uppercase tracking-wider border-b border-[#33302C]">
              <tr>
                <th className="py-3 px-4 w-12">Order</th>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Name & Specs</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Fragrances & Colours</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#33302C] text-[#EAE3D2]">
              {filtered.map((product, idx) => (
                <tr key={product.id} className="hover:bg-[#2A2825] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-[#8A7E72]">
                      <span className="font-mono">{product.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleMoveOrder(product, 'up')}
                          disabled={idx === 0}
                          className="hover:text-[#DFC27D] disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(product, 'down')}
                          disabled={idx === filtered.length - 1}
                          className="hover:text-[#DFC27D] disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <img
                      src={product.images?.[0] || '/assets/images/product_atelier_screw_jar_1793372739090.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover border border-[#33302C] bg-[#1C1B1A]"
                    />
                  </td>

                  <td className="py-3 px-4 space-y-1">
                    <div className="font-medium text-white flex items-center gap-2">
                      <span>{product.name}</span>
                      {product.featured && (
                        <span className="text-[10px] text-[#DFC27D] bg-[#DFC27D]/15 px-1.5 py-0.5 border border-[#DFC27D]/30">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8A7E72] flex items-center gap-2">
                      <span>{product.weight}</span>
                      <span>·</span>
                      <span>{product.vessel}</span>
                      {product.burnTime && (
                        <>
                          <span>·</span>
                          <span>{product.burnTime}</span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[#DFC27D]">
                    {product.category}
                  </td>

                  <td className="py-3 px-4 text-[11px] text-[#8A7E72] max-w-xs space-y-1">
                    <div>
                      <strong className="text-[#EAE3D2]">Scents: </strong>
                      {product.fragrances?.join(', ') || 'None'}
                    </div>
                    <div>
                      <strong className="text-[#EAE3D2]">Colors: </strong>
                      {product.colours?.join(', ') || 'Standard'}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleTogglePublish(product)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium cursor-pointer border ${
                        product.published
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {product.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{product.published ? 'Live' : 'Draft'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="p-1.5 text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(product.id)}
                        className="p-1.5 text-[#8A7E72] hover:text-[#DFC27D] transition-colors cursor-pointer"
                        title="Duplicate product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-[#8A7E72] hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6">
          <div className="relative w-full max-w-4xl bg-[#242220] border border-[#33302C] shadow-2xl p-5 sm:p-8 my-auto text-left max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2.5 text-[#8A7E72] hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6 pr-6">
              <span className="text-[10px] uppercase tracking-widest text-[#DFC27D] font-medium block">
                {isCreating ? 'Catalogue Creation' : 'Catalogue Editor'}
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                {isCreating ? 'Add New Product' : `Edit: ${editingProduct.name}`}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                  >
                    <option value="Glass Candles">Glass Candles</option>
                    <option value="Metal Candles">Metal Candles</option>
                    <option value="Mandala Candles">Mandala Candles</option>
                    <option value="Diffusers">Diffusers</option>
                    <option value="Diffuser Oils">Diffuser Oils</option>
                    <option value="Gift Sets">Gift Sets</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  placeholder="One sentence luxury overview"
                  className="w-full px-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Full Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.fullDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                  placeholder="Detailed craftsmanship and sensory description..."
                  className="w-full px-3 py-2.5 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                />
              </div>

              {/* Specifications Grid */}
              <div className="p-4 bg-[#1C1B1A] border border-[#33302C] space-y-3">
                <h4 className="text-[11px] uppercase tracking-wider text-[#DFC27D] font-medium">
                  Physical & Pour Specifications
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Weight</label>
                    <input
                      type="text"
                      value={editingProduct.weight || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, weight: e.target.value })}
                      placeholder="e.g. 210 g"
                      className="w-full px-2.5 py-2 bg-[#242220] border border-[#33302C] text-base sm:text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Burn Time</label>
                    <input
                      type="text"
                      value={editingProduct.burnTime || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, burnTime: e.target.value })}
                      placeholder="e.g. Approximately 40 hours"
                      className="w-full px-2.5 py-2 bg-[#242220] border border-[#33302C] text-base sm:text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Wax Formulation</label>
                    <input
                      type="text"
                      value={editingProduct.waxType || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, waxType: e.target.value })}
                      placeholder="Natural soy wax"
                      className="w-full px-2.5 py-2 bg-[#242220] border border-[#33302C] text-base sm:text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#8A7E72] mb-1">Vessel Format</label>
                    <input
                      type="text"
                      value={editingProduct.vessel || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, vessel: e.target.value })}
                      placeholder="Glass jar with screw lid"
                      className="w-full px-2.5 py-2 bg-[#242220] border border-[#33302C] text-base sm:text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Fragrances and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Available Fragrances (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fragrances?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        fragrances: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Crimson Canopy, White Garland, Orchid Pod"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                    Available Colours (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.colours?.join(', ') || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        colours: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Red, Green, Light Blue, Pink"
                    className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#EAE3D2] mb-1">
                  Product Image URLs (one per line)
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.images?.join('\n') || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      images: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full px-3 py-2 bg-[#1C1B1A] border border-[#33302C] text-base sm:text-xs text-white font-mono"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2] min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#DFC27D]"
                  />
                  <span>Show in Featured Showcase on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EAE3D2] min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={editingProduct.published !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, published: e.target.checked })}
                    className="w-4 h-4 accent-[#DFC27D]"
                  />
                  <span>Publish to Public Website</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#33302C]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 text-xs text-[#8A7E72] hover:text-white min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 min-h-[44px] bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Product Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
