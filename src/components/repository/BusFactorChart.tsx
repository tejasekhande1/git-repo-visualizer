"use client";

import { motion } from "framer-motion";
import { BusFactor } from "@/types/repository";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface BusFactorChartProps {
    data: BusFactor;
}

export default function BusFactorChart({ data }: BusFactorChartProps) {
    if (!data) return null;

    const riskColor = 
        data.risk_level === 'high' ? 'text-rose-500' : 
        data.risk_level === 'medium' ? 'text-amber-500' : 
        'text-emerald-500';

    const borderColor = 
        data.risk_level === 'high' ? 'border-rose-500' : 
        data.risk_level === 'medium' ? 'border-amber-500' : 
        'border-emerald-500';

    const bgGradient = 
        data.risk_level === 'high' ? 'from-rose-500/10 to-transparent' : 
        data.risk_level === 'medium' ? 'from-amber-500/10 to-transparent' : 
        'from-emerald-500/10 to-transparent';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border border-border bg-background p-6 rounded-sm h-full relative overflow-hidden`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${bgGradient} opacity-20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={`h-4 w-1 rounded-full ${data.risk_level === 'high' ? 'bg-rose-500' : data.risk_level === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Bus Factor Analysis</h3>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Knowledge Distribution</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 mb-8 relative z-10">
                <div className={`flex flex-col items-center justify-center h-24 w-24 rounded-full border-4 ${borderColor} bg-background`}>
                    <span className={`text-4xl font-black ${riskColor}`}>{data.bus_factor}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Devs</span>
                </div>
                
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        {data.risk_level === 'high' ? <AlertTriangle className="h-4 w-4 text-rose-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        <span className="text-sm font-bold uppercase tracking-wide text-foreground">
                            Risk Level: <span className={riskColor}>{data.risk_level}</span>
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        A bus factor of <strong className="text-foreground">{data.bus_factor}</strong> means {data.bus_factor} developer(s) control {Math.round((data.threshold || 0.5) * 100)}% of the codebase provided.
                    </p>
                </div>
            </div>

            <div className="relative z-10 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Primary Owners</h4>
                {data.top_contributors?.slice(0, 5).map((c, i) => (
                    <div key={`${c.email}-${i}`} className="group">
                        <div className="flex items-center justify-between mb-1.5 text-xs">
                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                            <span className="font-mono text-muted-foreground">{c.ownership_pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${c.ownership_pct}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
