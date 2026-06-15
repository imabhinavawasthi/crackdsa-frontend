import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Minus, Crown } from "lucide-react";
import Link from "next/link";

interface CompareProModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  coursePrice?: number;
}

export function CompareProModal({ isOpen, onClose, courseTitle = "This Course", coursePrice = 0 }: CompareProModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#0B0F19] rounded-[2rem] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 pointer-events-none" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                Choose Your Path
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Compare standalone course access vs the complete PRO ecosystem.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors z-10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Table */}
          <div className="p-6 sm:p-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-6 font-bold text-gray-400 text-sm w-1/3">Features</th>
                    <th className="pb-6 px-4 text-center w-1/3">
                      <div className="text-lg font-black text-gray-900 dark:text-white">{courseTitle}</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Standalone</div>
                    </th>
                    <th className="pb-6 px-4 text-center w-1/3 relative">
                      <div className="absolute -inset-4 bg-brand-500/5 rounded-t-3xl -z-10 border-x border-t border-brand-500/20" />
                      <div className="inline-flex items-center gap-1.5 text-lg font-black text-brand-600 dark:text-brand-400">
                        <Crown size={18} /> CrackDSA PRO
                      </div>
                      <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-1">All Access</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  <FeatureRow title="Lifetime access to current course" basic={true} pro={true} />
                  <FeatureRow title="Course specific problems & articles" basic={true} pro={true} />
                  <FeatureRow title="Community Discord Access" basic={true} pro={true} />
                  <FeatureRow title="Access to ALL current & future courses" basic={false} pro={true} />
                  <FeatureRow title="AI-driven personalized Roadmaps" basic={false} pro={true} />
                  <FeatureRow title="Priority 1:1 Doubt Resolution" basic={false} pro={true} />
                  <FeatureRow title="Exclusive Masterclasses & Live Q&A" basic={false} pro={true} />
                </tbody>
                <tfoot>
                  <tr>
                    <td className="pt-8"></td>
                    <td className="pt-8 px-4 text-center">
                      <div className="text-2xl font-black text-gray-900 dark:text-white mb-4">₹{coursePrice}</div>
                      <button 
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      >
                        Buy Single Course
                      </button>
                    </td>
                    <td className="pt-8 px-4 text-center relative">
                      <div className="absolute -inset-x-4 inset-y-0 bg-brand-500/5 rounded-b-3xl -z-10 border-x border-b border-brand-500/20" />
                      <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mb-4">₹999<span className="text-sm text-gray-400 font-bold">/mo</span></div>
                      <Link 
                        href="/checkout/pro"
                        className="block w-full py-3 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-lg shadow-brand-500/20"
                      >
                        Unlock PRO
                      </Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function FeatureRow({ title, basic, pro }: { title: string; basic: boolean; pro: boolean }) {
  return (
    <tr>
      <td className="py-4 text-sm font-medium text-gray-700 dark:text-gray-300 pr-4">{title}</td>
      <td className="py-4 px-4 text-center">
        {basic ? (
          <Check size={20} className="text-emerald-500 mx-auto" />
        ) : (
          <Minus size={20} className="text-gray-300 dark:text-gray-700 mx-auto" />
        )}
      </td>
      <td className="py-4 px-4 text-center relative">
        <div className="absolute -inset-x-4 inset-y-0 bg-brand-500/5 -z-10 border-x border-brand-500/20" />
        {pro ? (
          <Check size={20} className="text-brand-500 mx-auto" />
        ) : (
          <Minus size={20} className="text-gray-300 dark:text-gray-700 mx-auto" />
        )}
      </td>
    </tr>
  );
}
