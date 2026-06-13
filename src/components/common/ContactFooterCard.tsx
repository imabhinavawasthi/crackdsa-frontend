import React from "react";
import { MessageCircle, PhoneCall, Mail } from "lucide-react";
import { CONTACT_INFO } from "@/config/contact";

export function ContactFooterCard() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}?text=Hi%20CrackDSA%2C%20I%20have%20a%20doubt%20about%20a%20course!`;

  return (
    <section className="px-4 max-w-4xl mx-auto py-16">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/80 dark:to-[#1a1f2e] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-lg shadow-gray-200/20 dark:shadow-none">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 dark:border-gray-700">
            <MessageCircle className="w-8 h-8 text-emerald-500" />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Still have doubts?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              We understand that choosing the right course is a big decision. Our team is here to answer your questions and help you build a personalized roadmap.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
            <a 
              href={`tel:${CONTACT_INFO.phone}`} 
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 font-bold transition-colors"
            >
              <PhoneCall size={18} />
              Call {CONTACT_INFO.phone}
            </a>
          </div>
          
          <div className="pt-2">
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 font-medium inline-flex items-center gap-1.5 transition-colors">
              <Mail size={12} /> Or email us at {CONTACT_INFO.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
