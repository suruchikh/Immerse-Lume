import React, { useState } from 'react';
import { GlobalSettings } from '../types';
import { submitEnquiry } from '../services/api';
import { Mail, Phone, MapPin, Instagram, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';

interface ContactPageProps {
  settings: GlobalSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Brand & Catalogue Enquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitEnquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Brand & Catalogue Enquiry',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to transmit message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 sm:space-y-20 md:space-y-28 pb-24 text-left">
      {/* Header Banner */}
      <section className="bg-[#F5EFEB] border-b border-[#EAE3D2] py-14 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C29B38] font-medium block">
            Private Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-[#1C1B1A]">
            Connect With Immerse Lume
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#5C5854] font-light max-w-xl mx-auto leading-relaxed px-2">
            For bespoke catalogue requests, private retail consultations, interior projects, and corporate gifting commissions.
          </p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column: Direct Studio Details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-10">
            <div className="space-y-2.5">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[#8A7E72] font-medium block">
                Brand Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1B1A]">
                The Concierge Desk
              </h2>
              <p className="text-xs text-[#5C5854] font-light leading-relaxed">
                Whether selecting a bespoke fragrance for your home or commissioning an exclusive production run, our fragrance consultants provide individualized guidance.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6 border-t border-[#EAE3D2] pt-6 sm:pt-8 text-xs text-[#5C5854]">
              {settings.contactEmail && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-[#F5EFEB] text-[#C29B38] border border-[#EAE3D2] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="font-medium text-[#1C1B1A] hover:text-[#C29B38] transition-colors break-all"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {settings.contactPhone && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-[#F5EFEB] text-[#C29B38] border border-[#EAE3D2] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                      Telephone / WhatsApp Concierge
                    </span>
                    <a
                      href={`tel:${settings.contactPhone}`}
                      className="font-medium text-[#1C1B1A] hover:text-[#C29B38] transition-colors"
                    >
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings.contactAddress && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-[#F5EFEB] text-[#C29B38] border border-[#EAE3D2] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                      Registered Studio
                    </span>
                    <p className="font-medium text-[#1C1B1A]">
                      {settings.contactAddress}
                    </p>
                  </div>
                </div>
              )}

              {settings.instagramUrl && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-[#F5EFEB] text-[#C29B38] border border-[#EAE3D2] shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A7E72] block">
                      Visual Journal
                    </span>
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#1C1B1A] hover:text-[#C29B38] transition-colors inline-flex items-center gap-1"
                    >
                      <span>@immerselume</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-[#F5EFEB] border border-[#EAE3D2] space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[#C29B38] font-medium block">
                Trade & Interior Designers
              </span>
              <p className="text-xs text-[#5C5854] font-light">
                We collaborate with architects, boutique hoteliers, and interior decorators on signature room scents and custom vessels.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#FDFBF7] border border-[#EAE3D2] p-5 sm:p-8 md:p-12 shadow-sm">
            <h3 className="font-serif text-2xl font-medium text-[#1C1B1A] mb-1.5">
              Send an Enquiry
            </h3>
            <p className="text-xs text-[#8A7E72] mb-6 sm:mb-8 font-light">
              All messages are routed directly to our private concierge team.
            </p>

            {success ? (
              <div className="py-10 text-center space-y-4 bg-[#F5EFEB] border border-[#EAE3D2] p-6 sm:p-8">
                <CheckCircle2 className="w-12 h-12 text-[#C29B38] mx-auto" />
                <h4 className="font-serif text-2xl font-medium text-[#1C1B1A]">
                  Thank You
                </h4>
                <p className="text-xs text-[#5C5854] max-w-sm mx-auto leading-relaxed">
                  Your enquiry has been received by our concierge. A brand representative will contact you shortly with catalogue details or consultation availability.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-3 min-h-[44px] bg-[#1C1B1A] text-white text-xs uppercase tracking-wider cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lady Vivienne Sterling"
                    className="w-full px-4 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="vivienne@residence.com"
                      className="w-full px-4 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98000 00000"
                      className="w-full px-4 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                    Nature of Enquiry
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bespoke Wedding Favours or Corporate Suite"
                    className="w-full px-4 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please specify desired items, fragrance preferences, or quantities..."
                    className="w-full px-4 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] py-4 bg-[#1C1B1A] hover:bg-[#323827] text-[#FDFBF7] uppercase tracking-[0.2em] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:bg-[#323827]"
                >
                  {loading ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#DFC27D]" />
                      <span>Transmit Message to Concierge</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
