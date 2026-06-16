"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchMyTransactions } from "@/functions/checkout";
import { ArrowLeft, CreditCard, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import LoginRequired from "@/components/common/LoginRequired";

import WhatsAppSupportButton from "@/components/common/WhatsAppSupportButton";

export default function MyTransactionsPage() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchMyTransactions()
        .then(res => {
          setTransactions(res.items || []);
        })
        .catch(err => {
          console.error("Failed to fetch transactions", err);
        })
        .finally(() => {
          setLoadingTx(false);
        });
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <LoginRequired
          title="Transaction History Requires Sign In"
          description="Sign in to view your past purchases and billing history."
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 select-none space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/profile/subscription"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-500 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Subscription
        </Link>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <CreditCard size={20} />
              </span>
              Billing & Transactions
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              View your transaction history and payment details.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900/50 rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
        {loadingTx ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Item</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-gray-500 text-right">Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {new Date(tx.created_at).toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="font-bold text-gray-900 dark:text-white capitalize">
                        {tx.purchase_type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{tx.metadata?.target_name || tx.target_id?.replace(/-/g, " ")}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      ₹{tx.amount}
                    </td>
                    <td className="px-6 py-4">
                      {tx.status === "success" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                          <CheckCircle2 size={12} /> Success
                        </span>
                      )}
                      {tx.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {tx.status === "failed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/20">
                          <XCircle size={12} /> Failed
                        </span>
                      )}
                      {tx.failure_reason === "timeout" && (
                        <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Timeout</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {tx.status !== "success" && (
                        <WhatsAppSupportButton 
                          title="Need Help?"
                          message={`Hi CrackDSA Support, I'm facing an issue with a transaction.\n\nEmail: ${user?.email}\nTransaction ID: ${tx.id}\nAmount: ₹${tx.amount}\nStatus: ${tx.status}\n\nPlease help me out.`}
                          className="!py-1.5 !px-3 !text-xs !rounded-lg"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
