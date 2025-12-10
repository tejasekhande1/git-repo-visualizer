import { motion } from "framer-motion";
import type { ActivityLevel } from "@/lib/api";

interface ContributionHeatmapProps {
    activity: ActivityLevel[];
}

export default function ContributionHeatmap({ activity }: ContributionHeatmapProps) {
    // Group days into weeks for the heatmap
    const weeks: ActivityLevel[][] = [];
    let currentWeek: ActivityLevel[] = [];

    // Assuming activity is sorted by date, latest last
    // We want to display roughly the last year (52 weeks)
    // For simplicity, we'll just chunk the array
    // A real implementation would need complex date math to align with days of week

    // Take last 364 days (52 weeks * 7 days)
    const recentActivity = activity.slice(-364);

    recentActivity.forEach((day, index) => {
        currentWeek.push(day);
        if (currentWeek.length === 7 || index === recentActivity.length - 1) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return "bg-gray-100 dark:bg-zinc-800";
            case 1: return "bg-green-200 dark:bg-green-900/50";
            case 2: return "bg-green-400 dark:bg-green-700";
            case 3: return "bg-green-600 dark:bg-green-500";
            case 4: return "bg-green-800 dark:bg-green-300";
            default: return "bg-gray-100 dark:bg-zinc-800";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900"
        >
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                Contribution Activity
            </h2>

            <div className="w-full overflow-x-auto">
                <div className="flex min-w-max gap-[2px]">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[2px]">
                            {week.map((day, dIndex) => (
                                <div
                                    key={day.date}
                                    className={`h-3 w-3 rounded-sm ${getLevelColor(day.level)}`}
                                    title={`${day.date}: ${day.count} contributions`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-[2px]">
                    <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-zinc-800" />
                    <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900/50" />
                    <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
                    <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
                    <div className="h-3 w-3 rounded-sm bg-green-800 dark:bg-green-300" />
                </div>
                <span>More</span>
            </div>
        </motion.div>
    );
}
