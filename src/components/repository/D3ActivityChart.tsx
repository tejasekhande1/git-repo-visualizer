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

  const chartData = activity.slice(-30).map(day => ({
    date: new Date(day.date),
    commits: day.count,
  }));

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || chartData.length === 0) return;

    const margin = { top: 30, right: 30, bottom: 40, left: 40 };
    
    const renderChart = () => {
      if (!containerRef.current || !svgRef.current) return;
      const width = containerRef.current.clientWidth - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain(d3.extent(chartData, d => d.date) as [Date, Date])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, (d3.max(chartData, d => d.commits) || 10) * 1.2])
        .nice()
        .range([height, 0]);

      // Gradients
      const defs = svg.append("defs");
      const mainGradient = defs.append("linearGradient")
        .attr("id", "precision-chart-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");

      mainGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "var(--primary)")
        .attr("stop-opacity", 0.1);

      mainGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "var(--primary)")
        .attr("stop-opacity", 0);

      const area = d3.area<{ date: Date; commits: number }>()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.commits))
        .curve(d3.curveMonotoneX);

      const line = d3.line<{ date: Date; commits: number }>()
        .x(d => x(d.date))
        .y(d => y(d.commits))
        .curve(d3.curveMonotoneX);

      // Grid
      svg.append("g")
        .attr("class", "grid")
        .attr("opacity", 0.05)
        .call(d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
        );

      // Area
      svg.append("path")
        .datum(chartData)
        .attr("fill", "url(#precision-chart-gradient)")
        .attr("d", area);

      // Line
      svg.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke-width", 2.5)
        .attr("d", line);

      // Data Points & Labels for non-zero activity
      const activeData = chartData.filter(d => d.commits > 0);
      
      svg.selectAll(".dot")
        .data(activeData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.commits))
        .attr("r", 4)
        .attr("fill", "var(--primary)")
        .attr("stroke", "var(--background)")
        .attr("stroke-width", 2);

      // Axes
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .ticks(6)
          .tickFormat(d3.timeFormat("%b %d") as (domainValue: d3.NumberValue | Date, index: number) => string)
        )
        .attr("color", "var(--border)")
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("class", "uppercase tracking-tighter fill-muted-foreground");

      svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .attr("color", "var(--border)")
        .selectAll("text")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("class", "fill-muted-foreground");

      svg.selectAll(".domain").remove();
      svg.selectAll(".tick line").attr("stroke-opacity", 0.1);

      // Interactive Focus (Tooltip)
      const focus = svg.append("g")
        .style("display", "none");

      focus.append("circle")
        .attr("r", 5)
        .attr("fill", "var(--primary)")
        .attr("stroke", "var(--background)")
        .attr("stroke-width", 2);

      const focusText = focus.append("text")
        .attr("x", 0)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("fill", "var(--foreground)")
        .style("pointer-events", "none");
        
      const focusDate = focus.append("text")
        .attr("x", 0)
        .attr("y", -28)
        .attr("text-anchor", "middle")
        .attr("font-size", "9px")
        .attr("fill", "var(--muted-foreground)")
        .style("pointer-events", "none");

      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", (event: React.MouseEvent | MouseEvent) => {
          const bisect = d3.bisector((d: { date: Date; commits: number }) => d.date).left;
          const [mouseX] = d3.pointer(event);
          const x0 = x.invert(mouseX);
          const i = bisect(chartData, x0, 1);
          const d0 = chartData[i - 1];
          const d1 = chartData[i];
          if (!d0 || !d1) return;
          const d = x0.getTime() - d0.date.getTime() > d1.date.getTime() - x0.getTime() ? d1 : d0;
          
          focus.attr("transform", `translate(${x(d.date)},${y(d.commits)})`);
          focusText.text(`${d.commits} commits`);
          focusDate.text(d3.timeFormat("%b %d")(d.date));
          
          // Adjust text anchor if near edges
          const xPos = x(d.date);
          if (xPos < 40) {
              focusText.attr("text-anchor", "start").attr("x", 8);
              focusDate.attr("text-anchor", "start").attr("x", 8);
          } else if (xPos > width - 40) {
              focusText.attr("text-anchor", "end").attr("x", -8);
              focusDate.attr("text-anchor", "end").attr("x", -8);
          } else {
              focusText.attr("text-anchor", "middle").attr("x", 0);
              focusDate.attr("text-anchor", "middle").attr("x", 0);
          }
        });

      // Update static labels to prevent clipping
      svg.selectAll(".label")
       .attr("text-anchor", (d: unknown) => {
           const data = d as { date: Date; commits: number };
           const xPos = x(data.date);
           if (xPos < 10) return "start";
           if (xPos > width - 10) return "end"; 
           return "middle";
       });
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-border bg-background p-6 rounded-sm h-full flex flex-col"
    >
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-violet-500 rounded-full" />
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Propagation Matrix</h3>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">30-Day Activity Vector</p>
                </div>
            </div>
            <div className="px-2 py-1 bg-secondary rounded flex items-center gap-2 border border-border/50">
                <div className="h-1 w-1 rounded-full bg-primary" />
                <span className="text-[9px] font-mono font-black uppercase tracking-tighter text-muted-foreground">0x_PROT</span>
            </div>
        </div>
      
      <div ref={containerRef} className="flex-1 w-full overflow-hidden min-h-[250px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </motion.div>
  );
}
