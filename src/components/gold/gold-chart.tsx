'use client';

import React, {useEffect, useState} from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import {TrendingUp, Activity} from 'lucide-react';
import {useLocale} from '@/src/lib/i18n/LocaleProvider';
import {formatNumber} from "@/src/lib/i18n/formatters";

interface HistoryItem {
	price: number;
	time: string;
}

export default function GoldChart() {
	const [data, setData] = useState<HistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const {dict, locale} = useLocale();

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await fetch('/api/gold/history');
				const history = await res.json();
				setData(history);
			} catch (err) {
				console.error('Failed to fetch gold history');
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, []);

	if (!dict) return null;

	// Price is stored per-gram in USD-equivalent units; *10 converts to IRR, matching GoldTicker
	const formattedPrice = (price: number) =>
			price !== null ? formatNumber(price * 10, locale) : null;

	const formatXAxis = (tickItem: string) => {
		const date = new Date(tickItem);
		return date.toLocaleTimeString(dict.language.lng, {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading) {
		return (
				<div
						className="w-full h-[400px] bg-[var(--card)] animate-pulse rounded-3xl border border-[var(--border)] flex items-center justify-center">
					<Activity className="text-[var(--primary)] animate-spin" size={32}/>
				</div>
		);
	}

	return (
			<div className="w-full bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-[var(--primary)]/10 rounded-xl">
							<TrendingUp className="text-[var(--primary)]" size={20}/>
						</div>
						<div>
							<h3 className="font-bold text-lg">
								{dict.gold.goldChart.priceChart}
							</h3>
							<p className="text-xs text-[var(--foreground)]/50 uppercase tracking-widest">
								{dict.gold.goldChart.fluctuations}
							</p>
						</div>
					</div>
				</div>

				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart key={locale} data={data}>
							<defs>
								<linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
									<stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
								</linearGradient>
							</defs>

							<CartesianGrid
									strokeDasharray="3 3"
									vertical={false}
									stroke="var(--border)"
									opacity={0.5}
							/>

							<XAxis
									dataKey="time"
									tickFormatter={formatXAxis}
									fontSize={10}
									tick={{fill: 'var(--foreground)', opacity: 0.5}}
									axisLine={false}
									tickLine={false}
									minTickGap={30}
							/>

							<YAxis hide={true} domain={['auto', 'auto']}/>

							<Tooltip content={<CustomTooltip dict={dict} formatPrice={formattedPrice}/>}/>

							<Area
									type="monotone"
									dataKey="price"
									stroke="var(--primary)"
									strokeWidth={3}
									fillOpacity={1}
									fill="url(#colorPrice)"
									animationDuration={1500}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
	);
}

const CustomTooltip = ({active, payload, label, dict, formatPrice}: any) => {
	if (active && payload && payload.length) {
		const price = payload[0].value;
		const date = new Date(label);

		return (
				<div
						className="bg-[var(--background)] border border-[var(--primary)]/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
					<p className="text-xs text-[var(--foreground)]/50 mb-1">
						{date.toLocaleDateString(dict.language.lng, {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
					<p className="text-xl font-bold text-[var(--primary)] tabular-nums">
						{`${formatPrice(price)} ${dict.gold.goldChart.currency}`}
					</p>
				</div>
		);
	}
	return null;
};