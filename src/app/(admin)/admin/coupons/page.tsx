"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2, Edit2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { fetchAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon } from "@/api/admin-payments";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    max_uses: "",
    valid_until: "",
    applicable_to: "ALL", // Comma separated, or ALL
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
        applicable_to: formData.applicable_to.split(",").map(s => s.trim()),
      };
      await createAdminCoupon(payload);
      setShowModal(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: "", max_uses: "", valid_until: "", applicable_to: "ALL" });
      loadCoupons();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateAdminCoupon(id, { is_active: !currentStatus });
      loadCoupons();
    } catch (err: any) {
      alert("Failed to toggle: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteAdminCoupon(id);
      loadCoupons();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="text-brand-500" />
            Coupon Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount codes for courses and PRO subscriptions.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-all hover:-translate-y-0.5"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider font-bold text-gray-500">
                <th className="p-4">Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Applicable To</th>
                <th className="p-4">Uses</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-brand-500" /></td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No coupons found. Create one above.</td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="p-4 font-black text-gray-900 dark:text-white">{c.code}</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                    </td>
                    <td className="p-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {c.applicable_to.join(", ")}
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {c.used_count} {c.max_uses ? `/ ${c.max_uses}` : "uses"}
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {c.valid_until ? new Date(c.valid_until).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(c.id, c.is_active)}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${c.is_active ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}
                      >
                        {c.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {c.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Coupon</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Coupon Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. FESTIVAL50"
                  value={formData.code}
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={e => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Value</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder={formData.discount_type === "percentage" ? "e.g. 20" : "e.g. 1000"}
                    value={formData.discount_value}
                    onChange={e => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Applicable To (comma separated)</label>
                <input
                  required
                  type="text"
                  placeholder="ALL, or PRO, or <course-id>"
                  value={formData.applicable_to}
                  onChange={e => setFormData({...formData, applicable_to: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Max Uses (optional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={formData.max_uses}
                    onChange={e => setFormData({...formData, max_uses: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Valid Until (optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.valid_until}
                    onChange={e => setFormData({...formData, valid_until: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
