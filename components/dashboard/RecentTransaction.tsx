"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { financialAPI, Transaction } from "@/lib/api/client";
import { formatDate, formatCurrency } from "@/lib/utils/format";
import { RecentTransactionSkeleton } from "@/components/skeletons";

export default function RecentTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const response = await financialAPI.getRecentTransactions(3);
        if (response.success) {
          setTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error("Failed to fetch recent transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTransactions();
  }, []);

  if (loading) {
    return <RecentTransactionSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F5F5F5] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Transaction</h3>
        <Link
          href="/transactions"
          className="text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1 transition-colors"
        >
          View All
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Table Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-3 border-b border-gray-100">
        <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Name/Business
        </div>
        <div className="col-span-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
          Type
        </div>
        <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Amount
        </div>
        <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
          Date
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="md:grid md:grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors px-2 -mx-2"
          >
            {/* Name/Business Column */}
            <div className="col-span-12 md:col-span-4 flex items-center gap-3 mb-3 md:mb-0">
              <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                <Image
                  src={transaction.image}
                  alt={transaction.name}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {transaction.name}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.business}
                </p>
              </div>
              {/* Amount on mobile - shown next to name */}
              <div className="md:hidden">
                <p className={`text-sm font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(transaction.amount, transaction.currency, { format: 'signed' })}
                </p>
              </div>
            </div>

            {/* Type Column */}
            <div className="col-span-12 md:col-span-4 flex justify-between md:block mb-2 md:mb-0">
              <span className="text-xs text-gray-400 md:hidden">Type:</span>
              <p className="text-sm text-[#929EAE] font-medium text-center">{transaction.type}</p>
            </div>

            {/* Amount Column - Hidden on mobile (shown next to name instead) */}
            <div className="hidden md:block col-span-2">
              <p className={`text-sm font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(transaction.amount, transaction.currency, { format: 'signed' })}
              </p>
            </div>

            {/* Date Column */}
            <div className="col-span-12 md:col-span-2 flex justify-between md:block">
              <span className="text-xs text-gray-400 md:hidden">Date:</span>
              <p className="text-sm text-[#929EAE] text-center">{formatDate(transaction.date, 'short')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
