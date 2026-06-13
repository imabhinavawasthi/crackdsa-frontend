"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { fetchAdminTransactions } from "@/api/admin-payments";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTransactions(filterStatus, filterType);
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [filterStatus, filterType]);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "success": return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider w-fit"><CheckCircle2 size={12} /> Success</div>;
      case "failed": return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 text-xs font-bold uppercase tracking-wider w-fit"><XCircle size={12} /> Failed</div>;
      default: return <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 text-xs font-bold uppercase tracking-wider w-fit"><Clock size={12} /> Pending</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="text-brand-500" />
            Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-1">Audit and filter all Razorpay payments on the platform.</p>
        </div>
        
        <div className="flex gap-3">
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 outline-none"
          >
            <option value="">All Purchase Types</option>
            <option value="pro_subscription">PRO Subscriptions</option>
            <option value="course">Courses</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider font-bold text-gray-500">
                <th className="p-4">Transaction ID / Order</th>
                <th className="p-4">User</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Product</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-brand-500" /></td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No transactions found for these filters.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs text-gray-900 dark:text-white mb-1">{tx.razorpay_payment_id || "-"}</div>
                      <div className="font-mono text-[10px] text-gray-400">{tx.razorpay_order_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{tx.users?.full_name || "-"}</div>
                      <div className="text-xs text-gray-500">{tx.users?.email || "-"}</div>
                    </td>
                    <td className="p-4 font-black text-gray-900 dark:text-white">
                      ₹{tx.amount}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        {tx.purchase_type === "pro_subscription" ? "PRO" : "COURSE"}
                      </span>
                      <div className="text-xs text-gray-500 font-medium mt-1 truncate max-w-[150px]">{tx.target_id || "-"}</div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      {new Date(tx.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <StatusIcon status={tx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
