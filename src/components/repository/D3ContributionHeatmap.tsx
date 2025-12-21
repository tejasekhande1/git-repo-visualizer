"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { ActivityLevel } from '@/types/repository';

interface D3ContributionHeatmapProps {
  activity: ActivityLevel[];
}

export default function D3ContributionHeatmap({ activity }: D3ContributionHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || activity.length === 0) return;

    // Generate full 364 days (52 weeks) ending today
    const today = new Date();
    const data: ActivityLevel[] = [];
    const activityMap = new Map(activity.map(a => [a.date, a.count]));

    for (let i = 363; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        data.push({
            date: dateStr,
            count: activityMap.get(dateStr) || 0,
            level: 0 // Will be calculated by color scale
        });
    }

    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const cellGap = 3; // Reduced gap for better density
    const weekCount = 52;
    const dayCount = 7;

    const renderHeatmap = () => {
      if (!containerRef.current || !svgRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const availableWidth = containerWidth - margin.left - margin.right;
      
      // Calculate cell size to fit all weeks
      // weekCount * (cellSize + cellGap) = availableWidth
      // weekCount * cellSize + weekCount * cellGap = availableWidth
      // cellSize = (availableWidth - weekCount * cellGap) / weekCount
      
      const calculatedCellSize = Math.floor((availableWidth - (weekCount * cellGap)) / weekCount);
      const cellSize = Math.max(2, Math.min(12, calculatedCellSize)); // Clamp size between 2px and 12px
      
      const width = weekCount * (cellSize + cellGap);
      const height = dayCount * (cellSize + cellGap);

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Precision Color Scale
      const isDarkMode = document.documentElement.classList.contains('dark');
      const baseColor = isDarkMode ? "39, 39, 42" : "244, 244, 245"; // Zinc-800 or Zinc-100
      
      const colors = [
        `rgba(${baseColor}, 0.5)`,
        `rgba(139, 92, 246, 0.15)`,
        `rgba(139, 92, 246, 0.4)`,
        `rgba(139, 92, 246, 0.7)`,
        `#8b5cf6` // Violet 500
      ];

      const colorScale = d3.scaleThreshold<number, string>()
        .domain([1, 4, 8, 12])
        .range(colors);

      // Day labels
      const days = ['MON', 'WED', 'FRI'];
      svg.selectAll(".dayLabel")
        .data(days)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", -margin.left + 5)
        .attr("y", (_, i) => (i * 2 + 1) * (cellSize + cellGap) + cellSize / 2 + 3)
        .attr("font-size", "8px")
        .attr("font-weight", "900")
        .attr("class", "fill-muted-foreground/40 tracking-[0.1em]")
        .attr("alignment-baseline", "middle");

      // Draw cells
      svg.selectAll(".cell")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", (_, i) => Math.floor(i / 7) * (cellSize + cellGap))
        .attr("y", (_, i) => (i % 7) * (cellSize + cellGap))
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("fill", d => colorScale(d.count))
        .attr("stroke", "var(--background)")
        .attr("stroke-width", 0.5)
        .append("title")
        .text(d => `${d.date}: ${d.count} points detected`);

      // Legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, ${height + 25})`);
      
      legend.append("text")
        .text("NULL")
        .attr("x", -30)
        .attr("y", cellSize / 2 + 2)
        .attr("font-size", "7px")
        .attr("font-weight", "900")
        .attr("class", "fill-muted-foreground/30 uppercase tracking-widest");

      legend.selectAll(".legend-cell")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (_, i) => i * (cellSize + 4))
        .attr("y", 0)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 1)
        .attr("ry", 1)
        .attr("fill", d => d);

      legend.append("text")
        .text("MAX")
        .attr("x", colors.length * (cellSize + 4) + 5)
        .attr("y", cellSize / 2 + 2)
        .attr("font-size", "7px")
        .attr("font-weight", "900")
        .attr("class", "fill-muted-foreground/30 uppercase tracking-widest");
    };

    renderHeatmap();
    
    const observer = new MutationObserver(() => renderHeatmap());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [activity]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-border bg-background p-6 rounded-sm mb-8"
    >
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-rose-500 rounded-full" />
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Thermal Allocation</h3>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">52-Week Vector Analysis</p>
                </div>
            </div>
            <div className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.3em]">
                System_Status: Stable
            </div>
        </div>
      
      <div ref={containerRef} className="w-full overflow-hidden">
        <svg ref={svgRef} className="w-full"></svg>
      </div>
    </motion.div>
  );
}
