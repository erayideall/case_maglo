"use client";

import { useState, useEffect } from "react";
import StatsCard from "./StatsCard";
import { financialAPI } from "@/lib/api/client";
import { StatsCardSkeleton } from "@/components/skeletons";

export default function StatsCards() {
    const [loading, setLoading] = useState(true);
    const [totalBalance, setTotalBalance] = useState("₺0.00");
    const [totalExpense, setTotalExpense] = useState("₺0.00");
    const [totalSavings, setTotalSavings] = useState("₺0.00");

    useEffect(() => {
        const fetchFinancialSummary = async () => {
            try {
                const response = await financialAPI.getSummary();
                if (response.success) {
                    const { totalBalance, totalExpense, totalSavings } = response.data;

                    const formatCurrency = (amount: number, currency: string) => {
                        const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : currency;
                        return `${symbol}${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    };

                    setTotalBalance(formatCurrency(totalBalance.amount, totalBalance.currency));
                    setTotalExpense(formatCurrency(totalExpense.amount, totalExpense.currency));
                    setTotalSavings(formatCurrency(totalSavings.amount, totalSavings.currency));
                }
            } catch (error) {
                console.error("Failed to fetch financial summary:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialSummary();
    }, []);

    if (loading) {
        return (
            <>
                <StatsCardSkeleton />
                <StatsCardSkeleton />
                <StatsCardSkeleton />
            </>
        );
    }

    return (
        <>
            <StatsCard
                title="Total balance"
                value={totalBalance}
                icon="spend"
                isActive
            />
            <StatsCard
                title="Total spending"
                value={totalExpense}
                icon="spend"
            />
            <StatsCard
                title="Total saved"
                value={totalSavings}
                icon="saved"
            />
        </>
    );
}
