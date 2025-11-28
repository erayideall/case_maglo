'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { financialAPI, WorkingCapitalData } from '@/lib/api/client';
import { formatCurrency, formatNumberAbbreviated } from '@/lib/utils/format';
import { ChartSkeleton } from '@/components/skeletons';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  currency?: string;
  activeDataKey?: string | null;
  coordinate?: { x: number; y: number };
}

const CustomTooltip = ({ active, payload, currency = 'TRY', activeDataKey }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const incomeData = payload.find(p => p.dataKey === 'income');
    const expenseData = payload.find(p => p.dataKey === 'expense');

    return (
      <div className="bg-[#F3F6F8] text-[#1B212D] rounded-lg px-3 py-2 shadow-lg text-xs font-medium space-y-1">
        {incomeData && (
          <div
            className={`flex items-center gap-2 transition-opacity ${
              activeDataKey && activeDataKey !== 'income' ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>
            <span className={activeDataKey === 'income' ? 'font-bold' : 'font-semibold'}>
              {formatCurrency(incomeData.value || 0, currency, { format: 'intl' })}
            </span>
          </div>
        )}
        {expenseData && (
          <div
            className={`flex items-center gap-2 transition-opacity ${
              activeDataKey && activeDataKey !== 'expense' ? 'opacity-40' : 'opacity-100'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-[#bef264]"></div>
            <span className={activeDataKey === 'expense' ? 'font-bold' : 'font-semibold'}>
              {formatCurrency(expenseData.value || 0, currency, { format: 'intl' })}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

interface Period {
  label: string;
  value: string;
}

const periods: Period[] = [
  { label: 'Last 7 days', value: 'last7Days' },
  { label: 'Last 30 days', value: 'last30Days' },
  { label: 'Last 6 months', value: 'last6Months' },
];

export default function Chart() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(periods[2]); // Default: Last 6 months
  const [data, setData] = useState<WorkingCapitalData[]>([]);
  const [currency, setCurrency] = useState('TRY');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDataKey, setActiveDataKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchWorkingCapital = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await financialAPI.getWorkingCapital(selectedPeriod.value);
        if (response.success && response.data) {
          setData(response.data.data);
          setCurrency(response.data.currency);
        }
      } catch (err) {
        setError('Failed to load working capital data');
        console.error('Error fetching working capital:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingCapital();
  }, [selectedPeriod]);


  const getYAxisDomain = () => {
    if (data.length === 0) return [0, 10000];
    const maxIncome = Math.max(...data.map(d => d.income));
    const maxExpense = Math.max(...data.map(d => d.expense));
    const maxValue = Math.max(maxIncome, maxExpense);
    const roundedMax = Math.ceil(maxValue / 1000) * 1000;
    return [0, roundedMax];
  };

  if (loading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#F5F5F5]">
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#F5F5F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Working Capital</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
              <span className="text-sm text-gray-600">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#bef264]"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
          {/* Time selector */}
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <span>{selectedPeriod.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown menu */}
            <div
              className={`absolute right-0 mt-2 w-full sm:w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-200 origin-top ${isOpen
                  ? 'opacity-100 scale-100 visible'
                  : 'opacity-0 scale-95 invisible'
                }`}
              style={{ zIndex: 50 }}
            >
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedPeriod.value === period.value
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke="#f5f5f5" horizontal={false} vertical={true} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={formatNumberAbbreviated}
              domain={getYAxisDomain()}
            />
            <Tooltip
              content={<CustomTooltip currency={currency} activeDataKey={activeDataKey} />}
              cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              wrapperStyle={{ pointerEvents: 'none', zIndex: 100 }}
            />

            <Line
              type="natural"
              dataKey="income"
              stroke="#14b8a6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#14b8a6',
                strokeWidth: 0
              }}
              onMouseEnter={() => setActiveDataKey('income')}
              onMouseLeave={() => setActiveDataKey(null)}
            />
            <Line
              type="natural"
              dataKey="expense"
              stroke="#bef264"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: '#bef264',
                strokeWidth: 0
              }}
              onMouseEnter={() => setActiveDataKey('expense')}
              onMouseLeave={() => setActiveDataKey(null)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
