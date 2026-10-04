import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ArrowRight, ShieldCheck, Mail, Building, User } from 'lucide-react';

interface ContactSectionProps {
  inquiryPrefill?: {
    projectType?: string;
    modules?: string[];
    timelineWeeks?: number;
    priceRange?: string;
    referenceCaseStudy?: string;
  };
}

export const ContactSection: React.FC<ContactSectionProps> = ({ inquiryPrefill }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    budget: '$15k – $30k',
    timeline: 'Within 4–8 Weeks',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  useEffect(() => {
    if (inquiryPrefill) {
      let appendedNotes = formData.notes;
      if (inquiryPrefill.projectType) {
        appendedNotes += `\n[Prefilled Scope from Estimator: ${inquiryPrefill.projectType} (${inquiryPrefill.priceRange}, ~${inquiryPrefill.timelineWeeks} wks)]`;
      }
      if (inquiryPrefill.modules && inquiryPrefill.modules.length > 0) {
        appendedNotes += `\nModules: ${inquiryPrefill.modules.join(', ')}`;
      }
      if (inquiryPrefill.referenceCaseStudy) {
        appendedNotes += `\nReferenced Project Architecture: ${inquiryPrefill.referenceCaseStudy}`;
      }

      setFormData((prev) => ({
        ...prev,
        notes: appendedNotes.trim(),
        budget: inquiryPrefill.priceRange ? inquiryPrefill.priceRange : prev.budget,
      }));
    }
  }, [inquiryPrefill]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Work email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid business email address';
    }
    if (!formData.organization.trim()) {
      errs.organization = 'Organization or venture name is required';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate reliable studio dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTicketRef(`VG-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 450);
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Expectations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs uppercase font-mono tracking-widest text-neutral-400">
              Initiate Engagement
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight leading-snug">
              Let's build a software system that sets the standard in your industry.
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              We accept a maximum of three concurrent production engagements per quarter to ensure partner-level attention on every deliverable.
            </p>

            <div className="pt-6 border-t border-neutral-800 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">Direct Inquiries</p>
                  <p className="text-sm font-mono text-white mt-0.5">engagements@vanguard-studio.internal</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">Mutual Confidentiality</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Standard two-way mutual NDA executed prior to technical architecture disclosure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Interactive Form */}
          <div className="lg:col-span-7">
            {isSuccess ? (
              <div className="p-8 rounded-xl bg-neutral-900 border border-neutral-800 space-y-6 text-center animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-display text-white">Inquiry Received</h3>
                  <p className="text-xs font-mono text-neutral-400 mt-1">
                    Reference ID: <span className="text-white font-semibold">{ticketRef}</span>
                  </p>
                </div>
                <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-medium">{formData.name}</span>. A principal engineer will review your project parameters and respond within one business day with an initial technical assessment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      name: '',
                      email: '',
                      organization: '',
                      budget: '$15k – $30k',
                      timeline: 'Within 4–8 Weeks',
                      notes: '',
                    });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
                >
                  Submit Another Project Brief
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-8 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-6"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alexander Cole"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                        errors.name ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexander@company.com"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                        errors.email ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Organization field */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Apex Dynamics Ltd"
                      className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                        errors.organization ? 'border-red-500' : 'border-neutral-800'
                      }`}
                    />
                    {errors.organization && (
                      <p className="text-xs text-red-400 mt-1">{errors.organization}</p>
                    )}
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Target Budget Range
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    >
                      <option value="$10k – $20k">$10,000 – $20,000 USD</option>
                      <option value="$20k – $40k">$20,000 – $40,000 USD</option>
                      <option value="$40k – $80k">$40,000 – $80,000 USD</option>
                      <option value="$80k+">$80,000+ USD (Enterprise Architecture)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Project Objectives & Technical Scope
                  </label>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe your product goals, timeline, and current engineering stack..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 disabled:bg-neutral-600 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Dispatching Brief...</span>
                  ) : (
                    <>
                      <span>Submit Project Architecture Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
