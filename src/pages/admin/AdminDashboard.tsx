import React from 'react';
import { Product, Collection, Fragrance, PageSection, ContactEnquiry } from '../../types';
import { Package, Layers, Sparkles, Layout, Mail, Plus, Upload, Eye, CheckCircle2 } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  collections: Collection[];
  fragrances: Fragrance[];
  sections: PageSection[];
  enquiries: ContactEnquiry[];
  onNavigateTab: (tab: string) => void;
  onOpenCreateProduct: () => void;
  onViewWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  collections,
  fragrances,
  sections,
  enquiries,
  onNavigateTab,
  onOpenCreateProduct,
  onViewWebsite
}) => {
  const publishedProducts = products.filter((p) => p.published).length;
  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="space-y-8 text-left">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#33302C]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#DFC27D] font-medium block">
            Executive Overview
          </span>
          <h1 className="font-serif text-3xl font-normal text-white">
            Brand Dashboard
          </h1>
          <p className="text-xs text-[#8A7E72] font-light mt-1">
            Real-time control over products, fragrance accords, page sections, and concierge enquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateProduct}
            className="px-4 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={onViewWebsite}
            className="px-4 py-2.5 border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#DFC27D]" />
            <span>View Live Site</span>
          </button>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#242220] border border-[#33302C] p-5 space-y-2 hover:border-[#DFC27D]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A7E72]">
            <span className="text-[11px] uppercase tracking-wider">Products</span>
            <Package className="w-4 h-4 text-[#DFC27D]" />
          </div>
          <div className="font-serif text-3xl font-medium text-white tabular-nums">
            {products.length}
          </div>
          <p className="text-[11px] text-[#8A7E72]">
            {publishedProducts} Published live
          </p>
        </div>

        {/* Collections */}
        <div
          onClick={() => onNavigateTab('collections')}
          className="bg-[#242220] border border-[#33302C] p-5 space-y-2 hover:border-[#DFC27D]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A7E72]">
            <span className="text-[11px] uppercase tracking-wider">Collections</span>
            <Layers className="w-4 h-4 text-[#DFC27D]" />
          </div>
          <div className="font-serif text-3xl font-medium text-white tabular-nums">
            {collections.length}
          </div>
          <p className="text-[11px] text-[#8A7E72]">
            Candles, Diffusers, Gifts
          </p>
        </div>

        {/* Fragrances */}
        <div
          onClick={() => onNavigateTab('fragrances')}
          className="bg-[#242220] border border-[#33302C] p-5 space-y-2 hover:border-[#DFC27D]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A7E72]">
            <span className="text-[11px] uppercase tracking-wider">Fragrances</span>
            <Sparkles className="w-4 h-4 text-[#DFC27D]" />
          </div>
          <div className="font-serif text-3xl font-medium text-white tabular-nums">
            {fragrances.length}
          </div>
          <p className="text-[11px] text-[#8A7E72]">
            4 Signature Blends
          </p>
        </div>

        {/* Page Builder */}
        <div
          onClick={() => onNavigateTab('page_builder')}
          className="bg-[#242220] border border-[#33302C] p-5 space-y-2 hover:border-[#DFC27D]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A7E72]">
            <span className="text-[11px] uppercase tracking-wider">Page Sections</span>
            <Layout className="w-4 h-4 text-[#DFC27D]" />
          </div>
          <div className="font-serif text-3xl font-medium text-white tabular-nums">
            {sections.length}
          </div>
          <p className="text-[11px] text-[#8A7E72]">
            Customizable Layouts
          </p>
        </div>

        {/* Enquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-[#242220] border border-[#33302C] p-5 space-y-2 hover:border-[#DFC27D]/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#8A7E72]">
            <span className="text-[11px] uppercase tracking-wider">Enquiries</span>
            <Mail className="w-4 h-4 text-[#DFC27D]" />
          </div>
          <div className="font-serif text-3xl font-medium text-white tabular-nums">
            {enquiries.length}
          </div>
          <p className="text-[11px] text-[#DFC27D] font-medium">
            {newEnquiries} Pending Concierge
          </p>
        </div>
      </div>

      {/* Quick Shortcuts Bar */}
      <div className="bg-[#242220] border border-[#33302C] p-6 space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#EAE3D2]">
          Quick Workspace Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <button
            onClick={() => onNavigateTab('products')}
            className="p-3 bg-[#1C1B1A] border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] transition-colors text-left flex items-center justify-between cursor-pointer"
          >
            <span>Catalogue Items</span>
            <Plus className="w-3.5 h-3.5 text-[#DFC27D]" />
          </button>
          <button
            onClick={() => onNavigateTab('media')}
            className="p-3 bg-[#1C1B1A] border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] transition-colors text-left flex items-center justify-between cursor-pointer"
          >
            <span>Media Library</span>
            <Upload className="w-3.5 h-3.5 text-[#DFC27D]" />
          </button>
          <button
            onClick={() => onNavigateTab('page_builder')}
            className="p-3 bg-[#1C1B1A] border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] transition-colors text-left flex items-center justify-between cursor-pointer"
          >
            <span>Edit Homepage</span>
            <Layout className="w-3.5 h-3.5 text-[#DFC27D]" />
          </button>
          <button
            onClick={() => onNavigateTab('supabase')}
            className="p-3 bg-[#1C1B1A] border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] transition-colors text-left flex items-center justify-between cursor-pointer"
          >
            <span>Database Hub</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC27D]" />
          </button>
        </div>
      </div>

      {/* Recent Enquiries & Active Products Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-7 bg-[#242220] border border-[#33302C] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#33302C]">
            <h3 className="font-serif text-xl font-medium text-white">
              Recent Concierge Inquiries
            </h3>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs uppercase tracking-wider text-[#DFC27D] hover:underline cursor-pointer"
            >
              View All ({enquiries.length})
            </button>
          </div>

          {enquiries.length === 0 ? (
            <p className="text-xs text-[#8A7E72] py-6 text-center">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => onNavigateTab('enquiries')}
                  className="p-3.5 bg-[#1C1B1A] border border-[#33302C] hover:border-[#DFC27D]/60 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">{enq.name}</span>
                    <span className="text-[10px] text-[#8A7E72] font-mono">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#DFC27D]">{enq.subject}</p>
                  <p className="text-[11px] text-[#8A7E72] line-clamp-1 font-light">
                    {enq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System & Architecture Status */}
        <div className="lg:col-span-5 bg-[#242220] border border-[#33302C] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#33302C]">
            <h3 className="font-serif text-xl font-medium text-white">
              Architecture Status
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-[#DFC27D] font-mono">
              Live & Healthy
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center justify-between">
              <div>
                <p className="text-[#EAE3D2] font-medium">Persistent Storage</p>
                <p className="text-[11px] text-[#8A7E72]">data/database.json</p>
              </div>
              <span className="text-[#A3E635] text-[11px] font-mono">Active</span>
            </div>

            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center justify-between">
              <div>
                <p className="text-[#EAE3D2] font-medium">Media Storage Engine</p>
                <p className="text-[11px] text-[#8A7E72]">Direct Disk Uploads (/uploads)</p>
              </div>
              <span className="text-[#A3E635] text-[11px] font-mono">Ready</span>
            </div>

            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center justify-between">
              <div>
                <p className="text-[#EAE3D2] font-medium">Authentication</p>
                <p className="text-[11px] text-[#8A7E72]">Bcrypt Hashing + JWT Token</p>
              </div>
              <span className="text-[#A3E635] text-[11px] font-mono">Secured</span>
            </div>

            <div className="p-3 bg-[#1C1B1A] border border-[#33302C] flex items-center justify-between">
              <div>
                <p className="text-[#EAE3D2] font-medium">Supabase Migration</p>
                <p className="text-[11px] text-[#8A7E72]">SQL Schema & RLS Ready</p>
              </div>
              <button
                onClick={() => onNavigateTab('supabase')}
                className="text-xs text-[#DFC27D] hover:underline cursor-pointer"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
