import React, { useState, useEffect } from 'react';
import { submitEnquiry } from '../services/api';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, defaultSubject }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject || 'Private Concierge Product Enquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultSubject) {
      setFormData((prev) => ({ ...prev, subject: defaultSubject }));
    }
  }, [defaultSubject]);

  // Lock body scroll on open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitEnquiry(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: defaultSubject || 'Private Concierge Product Enquiry',
          message: ''
        });
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] shadow-2xl border border-[#EAE3D2] p-5 sm:p-8 md:p-10 my-auto text-left animate-in fade-in duration-200 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2.5 text-[#5C5854] hover:text-[#1C1B1A] transition-colors rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close enquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 mb-6 pr-6">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#C29B38] font-medium block">
            Immerse Lume Concierge
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1B1A] leading-snug">
            Private Consultation & Gifting
          </h3>
          <p className="text-xs text-[#5C5854] font-light leading-relaxed">
            Please share your enquiry or curation requirements. Our brand concierge will respond within 24 hours.
          </p>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-4 bg-[#F5EFEB] border border-[#EAE3D2] p-6">
            <CheckCircle2 className="w-12 h-12 text-[#C29B38] mx-auto" />
            <h4 className="font-serif text-xl font-medium text-[#1C1B1A]">
              Enquiry Received
            </h4>
            <p className="text-xs text-[#5C5854] max-w-xs mx-auto leading-relaxed">
              Thank you for connecting with Immerse Lume. Our concierge team has received your message and will be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3.5 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
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
                  className="w-full px-3.5 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
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
                  className="w-full px-3.5 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Product enquiry or bespoke order"
                className="w-full px-3.5 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.16em] font-medium text-[#1C1B1A] mb-1">
                Message & Requirements *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about the desired quantities, preferred fragrances, or event date..."
                className="w-full px-3.5 py-3 text-base sm:text-xs bg-[#F5EFEB] border border-[#EAE3D2] focus:outline-hidden focus:border-[#C29B38] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3.5 bg-[#1C1B1A] hover:bg-[#323827] text-[#FDFBF7] uppercase tracking-[0.2em] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:bg-[#323827]"
            >
              {loading ? (
                <span>Transmitting...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#DFC27D]" />
                  <span>Submit To Concierge</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
