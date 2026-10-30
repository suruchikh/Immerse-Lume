import React, { useState } from 'react';
import { ContactEnquiry } from '../../types';
import { updateEnquiryStatus } from '../../services/api';
import { Mail, Phone, Calendar, Check, Archive, MessageSquare, ArrowUpRight } from 'lucide-react';

interface AdminEnquiriesProps {
  enquiries: ContactEnquiry[];
  onRefresh: () => void;
}

export const AdminEnquiries: React.FC<AdminEnquiriesProps> = ({ enquiries, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'reviewed' | 'archived'>('all');
  const [activeEnquiry, setActiveEnquiry] = useState<ContactEnquiry | null>(null);

  const handleStatusChange = async (id: string, status: 'new' | 'reviewed' | 'archived') => {
    try {
      await updateEnquiryStatus(id, status);
      onRefresh();
      if (activeEnquiry?.id === id) {
        setActiveEnquiry({ ...activeEnquiry, status });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating enquiry');
    }
  };

  const filtered = filterStatus === 'all'
    ? enquiries
    : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#33302C]">
        <div>
          <h2 className="font-serif text-2xl font-normal text-white">
            Concierge Inquiries Inbox
          </h2>
          <p className="text-xs text-[#8A7E72] font-light mt-0.5">
            Incoming private client requests, bespoke gifting consultations, and corporate enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'new', 'reviewed', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                filterStatus === st
                  ? 'bg-[#DFC27D] text-[#1C1B1A] border-[#DFC27D] font-medium'
                  : 'bg-[#1C1B1A] text-[#8A7E72] border-[#33302C] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center bg-[#242220] border border-[#33302C] text-xs text-[#8A7E72]">
              No enquiries match the selected filter.
            </div>
          ) : (
            filtered.map((enq) => (
              <div
                key={enq.id}
                onClick={() => setActiveEnquiry(enq)}
                className={`p-4 bg-[#242220] border transition-colors cursor-pointer space-y-2 text-left ${
                  activeEnquiry?.id === enq.id
                    ? 'border-[#DFC27D] bg-[#2A2825]'
                    : 'border-[#33302C] hover:border-[#DFC27D]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{enq.name}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${
                      enq.status === 'new'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : enq.status === 'reviewed'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>

                <p className="text-xs text-[#DFC27D] truncate font-medium">
                  {enq.subject}
                </p>

                <p className="text-[11px] text-[#8A7E72] line-clamp-2 font-light">
                  {enq.message}
                </p>

                <div className="text-[10px] text-[#5C5854] flex items-center justify-between pt-1 font-mono">
                  <span>{enq.email}</span>
                  <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Enquiry Detail View */}
        <div className="lg:col-span-7 bg-[#242220] border border-[#33302C] p-6 space-y-6">
          {activeEnquiry ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between pb-4 border-b border-[#33302C]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#DFC27D]">
                    Enquiry ID: {activeEnquiry.id}
                  </span>
                  <h3 className="font-serif text-2xl font-medium text-white mt-1">
                    {activeEnquiry.subject}
                  </h3>
                  <p className="text-xs text-[#8A7E72]">
                    Received on {new Date(activeEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(activeEnquiry.id, 'reviewed')}
                    className="px-2.5 py-1 text-[11px] bg-[#1C1B1A] border border-[#33302C] hover:border-emerald-500 text-emerald-400 cursor-pointer"
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleStatusChange(activeEnquiry.id, 'archived')}
                    className="px-2.5 py-1 text-[11px] bg-[#1C1B1A] border border-[#33302C] hover:border-zinc-500 text-zinc-400 cursor-pointer"
                  >
                    Archive
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#1C1B1A] border border-[#33302C] text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#8A7E72] block">Client Name</span>
                  <span className="text-white font-medium">{activeEnquiry.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#8A7E72] block">Email</span>
                  <a
                    href={`mailto:${activeEnquiry.email}?subject=Re: ${encodeURIComponent(activeEnquiry.subject)}`}
                    className="text-[#DFC27D] hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>{activeEnquiry.email}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
                {activeEnquiry.phone && (
                  <div>
                    <span className="text-[10px] uppercase text-[#8A7E72] block">Phone</span>
                    <a
                      href={`tel:${activeEnquiry.phone}`}
                      className="text-white hover:text-[#DFC27D] font-mono"
                    >
                      {activeEnquiry.phone}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-[10px] uppercase text-[#8A7E72] block">Workflow Status</span>
                  <span className="text-[#DFC27D] uppercase font-mono">{activeEnquiry.status}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                  Client Message & Custom Requirements
                </span>
                <div className="p-4 bg-[#1C1B1A] border border-[#33302C] text-xs text-[#EAE3D2] leading-relaxed whitespace-pre-wrap font-light">
                  {activeEnquiry.message}
                </div>
              </div>

              {/* Action reply button */}
              <div className="pt-2">
                <a
                  href={`mailto:${activeEnquiry.email}?subject=Re: Immerse Lume Concierge — ${encodeURIComponent(activeEnquiry.subject)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DFC27D] hover:bg-[#C29B38] text-[#1C1B1A] text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email Client</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-[#8A7E72] space-y-2">
              <MessageSquare className="w-8 h-8 text-[#5C5854] mx-auto" />
              <p>Select an enquiry from the list to view its complete consultation details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
