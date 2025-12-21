"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { ActivityLevel } from '@/types/repository';

interface D3ActivityChartProps {
  activity: ActivityLevel[];
}

export default function D3ActivityChart({ activity }: D3ActivityChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Process data for the chart - take the last 30 days
  const chartData = activity.slice(-30).map(day => ({
    date: new Date(day.date),
    commits: day.count,
  }));

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    
    const renderChart = () => {
      if (!containerRef.current || !svgRef.current) return;
      const width = containerRef.current.clientWidth - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      // Clear existing content
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // X Scale
      const x = d3.scaleTime()
        .domain(d3.extent(chartData, d => d.date) as [Date, Date])
        .range([0, width]);

      // Y Scale
      const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.commits) || 10])
        .nice()
        .range([height, 0]);

      // Area generator
      const area = d3.area<{ date: Date; commits: number }>()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.commits))
        .curve(d3.curveMonotoneX);

      // Line generator
      const line = d3.line<{ date: Date; commits: number }>()
        .x(d => x(d.date))
        .y(d => y(d.commits))
        .curve(d3.curveMonotoneX);

      // Define gradient
      const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#2563eb")
        .attr("stop-opacity", 0.3);

      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#2563eb")
        .attr("stop-opacity", 0);

      // Add grid lines
      svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.1)
        .call(d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
        );

      // Add area
      svg.append("path")
        .datum(chartData)
        .attr("fill", "url(#area-gradient)")
        .attr("d", area);

      // Add line
      svg.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "#2563eb")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Add X Axis
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .ticks(5)
          .tickFormat(d3.timeFormat("%b %d") as (domainValue: d3.NumberValue | Date, index: number) => string)
        )
        .attr("color", "#6b7280")
        .selectAll("text")
        .attr("font-size", "12px")
        .attr("dy", "1em");

      // Add Y Axis
      svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .attr("color", "#6b7280")
        .selectAll("text")
        .attr("font-size", "12px");

      // Hide axis lines but keep labels
      svg.selectAll(".domain").remove();
      svg.selectAll(".tick line").attr("stroke-opacity", 0.1);
    };

    renderChart();

    const resizeObserver = new ResizeObserver(() => {
      renderChart();
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [chartData]);

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
      <div ref={containerRef} className="h-[300px] w-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </motion.div>
  );
}
