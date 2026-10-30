import React, { useState, useEffect } from 'react';
import { fetchSupabaseStatus } from '../../services/api';
import { Database, ShieldCheck, Copy, Check, ExternalLink, Download } from 'lucide-react';

export const AdminSupabase: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSupabaseStatus()
      .then((data) => setStatus(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopySql = () => {
    if (status?.schemaSql) {
      navigator.clipboard.writeText(status.schemaSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJson = () => {
    window.open('/api/products?admin=true', '_blank');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="pb-4 border-b border-[#33302C]">
        <h2 className="font-serif text-2xl font-normal text-white">
          Backend Architecture & Supabase Integration
        </h2>
        <p className="text-xs text-[#8A7E72] font-light mt-0.5">
          Review relational database architecture, Row Level Security (RLS) schemas, and deployment credentials.
        </p>
      </div>

      {/* Backend Status Card */}
      <div className="bg-[#242220] border border-[#33302C] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#33302C]">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#DFC27D]" />
            <div>
              <h3 className="font-serif text-xl font-medium text-white">
                Active Database Engine
              </h3>
              <p className="text-xs text-[#8A7E72]">
                {status?.configured
                  ? 'Supabase Cloud PostgreSQL connected & synchronized'
                  : 'Built-in Persistent JSON & Disk Storage Engine (Full-Stack Mode)'}
              </p>
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-1 font-mono uppercase tracking-wider border ${
              status?.configured
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}
          >
            {status?.configured ? 'Connected' : 'Autonomous Engine'}
          </span>
        </div>

        <p className="text-xs text-[#EAE3D2] leading-relaxed font-light">
          {status?.message}
        </p>

        {!status?.configured && (
          <div className="p-4 bg-[#1C1B1A] border border-[#33302C] space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#DFC27D] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>How to connect your Cloud Supabase project</span>
            </h4>
            <ol className="text-xs text-[#8A7E72] list-decimal list-inside space-y-1.5 font-light">
              <li>Create a new project at <strong>supabase.com</strong>.</li>
              <li>Open the <strong>SQL Editor</strong> in your Supabase dashboard and run the schema script provided below.</li>
              <li>Provide the environment variables <code className="text-[#DFC27D] bg-[#242220] px-1 py-0.5 font-mono">SUPABASE_URL</code> and <code className="text-[#DFC27D] bg-[#242220] px-1 py-0.5 font-mono">SUPABASE_KEY</code>.</li>
              <li>The application will automatically synchronize all catalogue items, sections, and inquiries to your cloud tables!</li>
            </ol>
          </div>
        )}
      </div>

      {/* SQL Migration Script Box */}
      <div className="bg-[#242220] border border-[#33302C] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#33302C]">
          <div>
            <h3 className="font-serif text-xl font-medium text-white">
              Supabase PostgreSQL Schema & RLS Policies
            </h3>
            <p className="text-xs text-[#8A7E72]">
              Tables: products, collections, fragrances, page_sections, enquiries with Row Level Security.
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="px-3.5 py-1.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL' : 'Copy SQL Script'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#1C1B1A] border border-[#33302C] text-[11px] text-[#A69B8F] font-mono overflow-x-auto max-h-72 leading-relaxed">
          {status?.schemaSql || 'Loading schema definition...'}
        </pre>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExportJson}
          className="px-4 py-2 border border-[#33302C] hover:border-[#DFC27D] text-[#EAE3D2] text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#DFC27D]" />
          <span>Export Catalogue Data JSON</span>
        </button>
      </div>
    </div>
  );
};
