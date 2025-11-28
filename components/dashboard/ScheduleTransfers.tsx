'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { financialAPI, ScheduledTransfer } from '@/lib/api/client';
import { formatDate, formatCurrency } from '@/lib/utils/format';
import { ScheduleTransfersSkeleton } from '@/components/skeletons';

export default function ScheduleTransfers() {
  const [transfers, setTransfers] = useState<ScheduledTransfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledTransfers = async () => {
      try {
        const response = await financialAPI.getScheduledTransfers(5);
        if (response.success) {
          setTransfers(response.data.transfers);
        }
      } catch (error) {
        console.error('Failed to fetch scheduled transfers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledTransfers();
  }, []);

  if (loading) {
    return <ScheduleTransfersSkeleton />;
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F5F5F5]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Scheduled Transfers</h2>
        <Link
          href="/transfers"
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

      {/* Transfers List */}
      <div className="space-y-4">
        {transfers.map((transfer) => (
          <div
            key={transfer.id}
            className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg transition-colors px-2 -mx-2"
          >
            {/* Left side - Avatar and Info */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                <Image
                  src={transfer.image}
                  alt={transfer.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/avatar/avatar-1.png';
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{transfer.name}</h3>
                <p className="text-sm text-gray-500">{formatDate(transfer.date, 'long')}</p>
              </div>
            </div>

            {/* Right side - Amount */}
            <div className="font-semibold text-gray-900">
              - {formatCurrency(transfer.amount, transfer.currency, { format: 'simple' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
