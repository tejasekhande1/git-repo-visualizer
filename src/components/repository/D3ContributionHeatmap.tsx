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

    // Process data: Take last 364 days to represent 52 weeks
    const data = activity.slice(-364);

    const margin = { top: 20, right: 20, bottom: 20, left: 30 };
    const cellSize = 12;
    const cellGap = 2;
    const weekCount = 52;
    const dayCount = 7;

    const renderHeatmap = () => {
      if (!containerRef.current || !svgRef.current) return;
      // Calculate responsive width or use a fixed size with overflow
      const width = weekCount * (cellSize + cellGap);
      const height = dayCount * (cellSize + cellGap);

      // Clear existing content
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Color Scale - similar to GitHub's colors
      const colorScale = d3.scaleThreshold<number, string>()
        .domain([1, 5, 10, 15])
        .range(["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]);
        
      // In dark mode we should adjust these, but for now we'll use a CSS-friendly approach
      // or check the theme. Let's use CSS variables for colors if possible.
      const isDarkMode = document.documentElement.classList.contains('dark');
      const darkColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
      const lightColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
      
      const colors = isDarkMode ? darkColors : lightColors;
      colorScale.range(colors);

      // Day labels
      const days = ['Mon', 'Wed', 'Fri'];
      svg.selectAll(".dayLabel")
        .data(days)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", -margin.left)
        .attr("y", (_, i) => (i * 2 + 1) * (cellSize + cellGap) + cellSize / 2 + 3)
        .attr("font-size", "10px")
        .attr("fill", "#6b7280")
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
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", d => colorScale(d.count))
        .append("title")
        .text(d => `${d.date}: ${d.count} contributions`);

      // Add simple legend
      const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, ${height + 15})`);
      
      legend.append("text")
        .text("Less")
        .attr("x", -30)
        .attr("y", cellSize / 2 + 2)
        .attr("font-size", "10px")
        .attr("fill", "#6b7280");

      legend.selectAll(".legend-cell")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (_, i) => i * (cellSize + 2))
        .attr("y", 0)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", d => d);

      legend.append("text")
        .text("More")
        .attr("x", colors.length * (cellSize + 2) + 5)
        .attr("y", cellSize / 2 + 2)
        .attr("font-size", "10px")
        .attr("fill", "#6b7280");
    };

    renderHeatmap();
    
    // Listen for theme changes to re-render colors
    const observer = new MutationObserver(() => renderHeatmap());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [activity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-zinc-900"
    >
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Contribution Activity
      </h2>
      <div ref={containerRef} className="w-full overflow-x-auto">
        <svg ref={svgRef} className=""></svg>
      </div>
    </motion.div>
  );
}
