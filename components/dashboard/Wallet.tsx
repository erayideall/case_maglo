"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NfcIcon from "../icons/NfcIcon";
import { walletAPI, WalletCard } from "@/lib/api/client";
import { getNetworkLogo } from "@/lib/utils/format";
import { WalletSkeleton } from "@/components/skeletons";

export default function Wallet() {
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await walletAPI.getWallet();
        if (response.success) {
          setCards(response.data.cards);
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  if (loading) {
    return <WalletSkeleton />;
  }

  const firstCard = cards[0];
  const secondCard = cards[1];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 pt-0 pb-3 z-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Wallet</h2>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-3 sm:space-y-4">
        {/* First Card - Universal Bank (Dark) */}
        {firstCard && (
          <div
            className="relative h-48 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-6 text-white shadow-xl"
            style={{ backgroundColor: firstCard.color }}
          >
            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-between">
              {/* Top Section */}
              <div className="flex items-start justify-between">
                {/* Bank Name */}
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold">
                    {firstCard.bank.split('|')[0].trim()}{' '}
                    <span className="text-[#626260] font-normal text-sm sm:text-lg">
                      {firstCard.bank.includes('|') ? `| ${firstCard.bank.split('|')[1].trim()}` : ''}
                    </span>
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {/* Chip */}
                <Image
                  src="/images/card-chip.png"
                  alt="Chip"
                  width={24}
                  height={24}
                  className="object-contain sm:w-8 sm:h-8"
                />
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  <NfcIcon width={32} height={32} color="#363B41" />
                </div>
              </div>
              {/* Card Number */}
              <div>
                <p className="text-base sm:text-[20px] tracking-[0.2em] sm:tracking-[0.3em] font-bold">{firstCard.cardNumber}</p>
              </div>
              {/* Network Icon */}
              <div className="flex items-end justify-end">
                <Image
                  src={getNetworkLogo(firstCard.network)}
                  alt={firstCard.network}
                  width={32}
                  height={32}
                  className="object-contain sm:w-10 sm:h-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Second Card - Commercial Bank (Light) */}
        {secondCard && (
          <div className="h-44 sm:h-53 mx-3 sm:mx-5 -mt-16 sm:-mt-20 rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-6 text-gray-800 backdrop-blur-xs">
            {/* Colorful Gradient Circle */}
            <div className="absolute top-0 right-0 w-full h-full bg-linear-to-l from-[#d4d4d4] to-[#d4d4d4] rounded-full blur-3xl"></div>
            {/* Card Content */}
            <div className="relative h-full flex flex-col justify-between">
              {/* Top Section */}
              <div className="flex items-start justify-between">
                {/* Bank Name */}
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-white">
                    {secondCard.bank.split('|')[0].trim()}{' '}
                    <span className="text-white font-normal text-sm sm:text-lg">
                      {secondCard.bank.includes('|') ? `| ${secondCard.bank.split('|')[1].trim()}` : ''}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Chip */}
              <div className="flex items-center justify-between">
                <Image
                  src="/images/card-chip.png"
                  alt="Chip"
                  width={24}
                  height={24}
                  className="object-contain sm:w-8 sm:h-8"
                />
                <div className="w-8 h-8 sm:w-10 sm:h-10">
                  <NfcIcon width={32} height={32} color="#363B41" />
                </div>
              </div>

              {/* Card Number & Bottom Section */}
              <div className="space-y-1 sm:space-y-2">
                <p className="text-lg sm:text-2xl font-bold tracking-wide sm:tracking-wider text-[#1B212D]">{secondCard.cardNumber}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-[#929EAE]">
                    {String(secondCard.expiryMonth).padStart(2, '0')}/{String(secondCard.expiryYear).slice(-2)}
                  </p>
                  <Image
                    src={getNetworkLogo(secondCard.network)}
                    alt={secondCard.network}
                    width={28}
                    height={28}
                    className="object-contain sm:w-8 sm:h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}