import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import emailjs from 'emailjs-com';

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ open, onClose }: ContactDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    agency: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (open && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    emailjs.send(
      'service_ktws6ic',
      'template_bv7ptpn',
      {
        name: form.name,
        email: form.email,
        agency: form.agency,
        phone: form.phone,
        message: form.message,
      },
      'BVXzsppHII8mXgHwc'
    )
    .then(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', agency: '', phone: '', message: '' });
        onClose();
      }, 2000);
    })
    .catch(() => {
      setError('Failed to send. Please try again.');
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            tabIndex={-1}
            className="fixed left-0 right-0 bottom-0 z-50 bg-white/90 rounded-t-2xl sm:rounded-t-3xl shadow-2xl p-0 max-w-full sm:max-w-3xl mx-auto w-full flex flex-col animate-none border-t border-blue-900/10"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            role="dialog"
            aria-modal="true"
            style={{ boxShadow: "0 8px 48px 0 rgba(16,30,54,0.18)" }}
          >
            <button
              className="absolute top-3 right-3 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full bg-blue-50 hover:bg-blue-100 shadow transition"
              onClick={onClose}
              aria-label="Close contact drawer"
            >
              <X className="h-6 w-6 text-blue-900" />
            </button>
            <div className="flex flex-col items-center gap-3 sm:gap-4 mt-6 sm:mt-8 px-4 sm:px-12 pb-8 sm:pb-12">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-blue-900 tracking-tight mb-2 sm:mb-4 drop-shadow-xl text-center">Contact Us</h2>
              {submitted ? (
                <div className="flex flex-col items-center gap-2 py-10 sm:py-16">
                  <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mb-2" />
                  <div className="text-base sm:text-lg font-semibold text-green-700">Thank you! We'll be in touch soon.</div>
                </div>
              ) : (
                <form className="w-full flex flex-col gap-3 sm:gap-6" onSubmit={handleSubmit} autoComplete="off">
                  {error && (
                    <div className="text-red-600 text-center font-semibold mb-2">{error}</div>
                  )}
                  {/* Floating label input */}
                  {[
                    { name: "name", type: "text", label: "Full Name", required: true },
                    { name: "email", type: "email", label: "Email Address", required: true },
                    { name: "agency", type: "text", label: "Agency Name", required: true },
                    { name: "phone", type: "tel", label: "Phone Number", required: true },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <input
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        className="peer w-full px-3 sm:px-4 pt-5 sm:pt-6 pb-2 rounded-xl sm:rounded-2xl border border-blue-900/10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-900 text-base sm:text-lg shadow-sm transition placeholder-transparent"
                        placeholder={field.label}
                        id={`contact-${field.name}`}
                        autoComplete="off"
                      />
                      <label
                        htmlFor={`contact-${field.name}`}
                        className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-blue-900/70 text-sm sm:text-base font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-blue-900 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-blue-900/40"
                      >
                        {field.label}
                        {field.required && <span className="text-blue-900">*</span>}
                      </label>
                    </div>
                  ))}
                  {/* Floating label textarea */}
                  <div className="relative">
                    <textarea
                      name="message"
                      placeholder="How can we help you?"
                      className="peer w-full px-3 sm:px-4 pt-5 sm:pt-6 pb-2 rounded-xl sm:rounded-2xl border border-blue-900/10 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-900 text-base sm:text-lg min-h-[80px] sm:min-h-[100px] resize-none shadow-sm transition placeholder-transparent"
                      value={form.message}
                      onChange={handleChange}
                      id="contact-message"
                      required
                    />
                    <label
                      htmlFor="contact-message"
                      className="absolute left-3 sm:left-4 top-1.5 sm:top-2 text-blue-900/70 text-sm sm:text-base font-medium pointer-events-none transition-all duration-200 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-blue-900 peer-placeholder-shown:translate-y-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-blue-900/40"
                    >
                      How can we help you?
                    </label>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, backgroundColor: "#1e3a8a" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-lg transition-all duration-300 bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-900 mt-2 tracking-tight"
                  >
                    Send Message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 