import StatsCards from "@/components/dashboard/StatsCards";
import RecentTransaction from "@/components/dashboard/RecentTransaction";
import ScheduleTransfers from "@/components/dashboard/ScheduleTransfers";
import Chart from "@/components/dashboard/Chart";
import Wallet from "@/components/dashboard/Wallet";

export default function DashboardPage() {
    return (
        <div className="p-4 md:p-6 bg-white md:pb-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left Section */}
                <div className="xl:col-span-8 space-y-6">
                    {/* Stats Grid - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <StatsCards />
                    </div>

                    {/* Working Capital Chart */}
                    <Chart />

                    {/* Recent Transaction */}
                    <RecentTransaction />
                </div>

                {/* Right Section */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Wallet */}
                    <Wallet />

                    {/* Scheduled Transfers */}
                    <ScheduleTransfers />
                </div>
            </div>
        </div>
    );
}
