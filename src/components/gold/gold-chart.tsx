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
import {useLanguage} from '@/src/lib/i18n/language-context';
import {TrendingUp, Activity} from 'lucide-react';

interface HistoryItem {
	price: number;
	time: string;
}

export default function GoldChart() {
	const [data, setData] = useState<HistoryItem[]>([]);
	const [loading, setLoading] = useState(true);
	const {lang} = useLanguage();

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

	// Format price for Y-Axis and Tooltip
	const formatPrice = (price: number) =>
			new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US').format(price);

	// Format time for X-Axis
	const formatXAxis = (tickItem: string) => {
		const date = new Date(tickItem);
		return date.toLocaleTimeString(lang === 'fa' ? 'fa-IR' : 'en-US', {
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
								{lang === 'fa' ? 'نمودار قیمت طلا' : 'Gold Price Chart'}
							</h3>
							<p className="text-xs text-[var(--foreground)]/50 uppercase tracking-widest">
								{lang === 'fa' ? 'آخرین نوسانات بازار' : 'Live Market Fluctuations'}
							</p>
						</div>
					</div>
				</div>

				<div className="h-[300px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
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

							<YAxis
									hide={true}
									domain={['auto', 'auto']}
							/>

							<Tooltip
									content={<CustomTooltip lang={lang}/>}
							/>

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

// Custom Premium Tooltip Component
const CustomTooltip = ({active, payload, label, lang}: any) => {
	if (active && payload && payload.length) {
		const price = payload[0].value;
		const date = new Date(label);

		return (
				<div
						className="bg-[var(--background)] border border-[var(--primary)]/30 p-4 rounded-2xl shadow-xl backdrop-blur-md">
					<p className="text-xs text-[var(--foreground)]/50 mb-1">
						{date.toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-US', {
							month: 'short',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</p>
					<p className="text-xl font-bold text-[var(--primary)] tabular-nums">
						${new Intl.NumberFormat().format(price)}
					</p>
				</div>
		);
	}
	return null;
};