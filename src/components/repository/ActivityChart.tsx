"use client";

import { motion } from "framer-motion";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { ActivityLevel } from "@/lib/api";

interface ActivityChartProps {
    activity: ActivityLevel[];
}

export default function ActivityChart({ activity }: ActivityChartProps) {
    // Process data for the chart - group by month or week if needed
    // For now, we'll take the last 30 days for a cleaner view
    const chartData = activity.slice(-30).map(day => ({
        date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        commits: day.count,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900"
        >
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Commit History (Last 30 Days)
            </h2>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#18181b",
                                border: "1px solid #27272a",
                                borderRadius: "0.5rem",
                                color: "#f3f4f6",
                            }}
                            itemStyle={{ color: "#f3f4f6" }}
                            cursor={{ stroke: "#374151", strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="commits"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCommits)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
