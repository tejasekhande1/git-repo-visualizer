"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { ChurnFile } from '@/types/repository';

interface D3ChurnChartProps {
  churn: ChurnFile[];
}

export default function D3ChurnChart({ churn }: D3ChurnChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || churn.length === 0) return;

    const renderChart = () => {
      if (!containerRef.current || !svgRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = 300; // Fixed height for scatter plot

      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const g = svg.attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Scales
      const x = d3.scaleLog()
        .domain([1, d3.max(churn, d => d.commit_count) || 10])
        .range([0, innerWidth])
        .base(10)
        .nice();

      const y = d3.scaleLog()
        .domain([1, d3.max(churn, d => d.lines_changed) || 100])
        .range([innerHeight, 0])
        .base(10)
        .nice();
        
      const r = d3.scaleLinear()
        .domain([0, d3.max(churn, d => d.churn_score) || 100])
        .range([4, 20]);

      // Axes
      const xAxis = d3.axisBottom(x)
        .ticks(5, "~s")
        .tickSize(-innerHeight);
        
      const yAxis = d3.axisLeft(y)
        .ticks(5, "~s")
        .tickSize(-innerWidth);

      g.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(xAxis)
        .selectAll(".tick line")
        .attr("stroke-opacity", 0.1);

      g.append("g")
        .attr("class", "grid")
        .call(yAxis)
        .selectAll(".tick line")
        .attr("stroke-opacity", 0.1);

      // Labels
      g.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("fill", "currentColor")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "0.1em")
        .text("Commit Frequency (Log)");

      g.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("y", -45)
        .attr("x", -innerHeight / 2)
        .attr("transform", "rotate(-90)")
        .attr("fill", "currentColor")
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .style("text-transform", "uppercase")
        .style("letter-spacing", "0.1em")
        .text("Volume (Lines Changed - Log)");

      // Tooltip
      const tooltip = d3.select(containerRef.current)
        .append("div")
        .attr("class", "absolute z-10 px-3 py-2 text-xs font-medium text-white bg-zinc-900 rounded shadow-lg pointer-events-none opacity-0 transition-opacity whitespace-nowrap border border-zinc-800")
        .style("top", "0")
        .style("left", "0");

      // Points
      g.selectAll(".dot")
        .data(churn)
        .enter()
        .append("circle")
        .attr("class", "dot cursor-pointer transition-all duration-300")
        .attr("cx", d => x(Math.max(1, d.commit_count)))
        .attr("cy", d => y(Math.max(1, d.lines_changed)))
        .attr("r", d => r(d.churn_score))
        .attr("fill", d => {
            if (d.category === 'hotspot') return "#f43f5e"; // Rose 500
            if (d.category === 'massive') return "#eab308"; // Yellow 500
            if (d.category === 'frequent') return "#8b5cf6"; // Violet 500
            return "#71717a"; // Zinc 500 (stable)
        })
        .attr("opacity", 0.7)
        .attr("stroke", "var(--background)")
        .attr("stroke-width", 1.5)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 1).attr("stroke", "var(--foreground)");
            tooltip.style("opacity", 1)
                .html(`
                    <div class="font-bold mb-1">${d.file_path}</div>
                    <div class="text-[10px] opacity-80">
                        Commits: ${d.commit_count}<br>
                        Lines: ${d.lines_changed}<br>
                        Score: ${d.churn_score} (${d.category})
                    </div>
                `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 0.7).attr("stroke", "var(--background)");
            tooltip.style("opacity", 0);
        })
        .on("click", function(event, d) {
            // Toggle pinned tooltip on click (HTML overlay with z-index)
            const tooltipId = `pinned-tooltip-${d.file_path.replace(/[/.\s]/g, '-')}`;
            const existingPinned = d3.select(`#${tooltipId}`);
            
            if (!existingPinned.empty()) {
                // Remove existing pinned tooltip
                existingPinned.remove();
            } else {
                // Create pinned tooltip (HTML overlay)
                d3.select(containerRef.current)
                    .append("div")
                    .attr("id", tooltipId)
                    .attr("class", "absolute z-50 px-3 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg shadow-xl border border-primary/50 cursor-pointer")
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 10}px`)
                    .html(`
                        <div class="flex items-center justify-between gap-3 mb-1">
                            <span class="font-bold text-primary">${d.file_path.split('/').pop() || d.file_path}</span>
                            <span class="text-[10px] text-muted-foreground/60">×</span>
                        </div>
                        <div class="text-[10px] opacity-80 space-y-0.5">
                            <div>Path: ${d.file_path}</div>
                            <div>Commits: ${d.commit_count}</div>
                            <div>Lines: ${d.lines_changed}</div>
                            <div>Score: ${d.churn_score} (${d.category})</div>
                        </div>
                    `)
                    .on("click", function() {
                        d3.select(this).remove();
                    });
            }
        });

      // Labels with collision detection ("Clever" greedy approach)
      const labels = churn
        .filter(d => d.category === 'hotspot' || d.category === 'massive' || d.churn_score > 50)
        .sort((a, b) => b.churn_score - a.churn_score); // Prioritize highest impact

      const placedLabels: { x: number, y: number, width: number, height: number }[] = [];

      const getLabelConfig = (d: ChurnFile) => {
          const name = d.file_path.split('/').pop() || d.file_path;
          const labelText = name.length > 20 ? name.substring(0, 18) + '...' : name;
          const xPos = x(Math.max(1, d.commit_count)) + 8;
          const yPos = y(Math.max(1, d.lines_changed)) + 3;
          // Approx width based on 10px font (approx 6px per char)
          const width = labelText.length * 6; 
          const height = 14; 
          return { name, labelText, x: xPos, y: yPos, width, height };
      };

      const visibleLabels = labels.filter(d => {
          const config = getLabelConfig(d);
          
          // Check collision with already placed labels
          const hasCollision = placedLabels.some(placed => {
              return (
                  config.x < placed.x + placed.width &&
                  config.x + config.width > placed.x &&
                  config.y < placed.y + placed.height &&
                  config.y + config.height > placed.y
              );
          });

          if (!hasCollision) {
              placedLabels.push(config);
              return true;
          }
          return false;
      });

      g.selectAll(".label")
        .data(visibleLabels)
        .enter()
        .append("text")
        .attr("x", d => x(Math.max(1, d.commit_count)) + 8)
        .attr("y", d => y(Math.max(1, d.lines_changed)) + 3)
        .text(d => {
            const name = d.file_path.split('/').pop() || d.file_path;
            return name.length > 20 ? name.substring(0, 18) + '...' : name;
        })
        .attr("font-size", "10px")
        .attr("font-weight", "600")
        .attr("fill", "var(--foreground)")
        .attr("opacity", 1)
        .style("pointer-events", "none");

    };

    renderChart();
    
    // Resize observer
    const observer = new ResizeObserver(() => renderChart());
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [churn]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border border-border bg-background p-6 rounded-sm h-full relative"
    >
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-amber-500 rounded-full" />
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">Churn Matrix</h3>
                    <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Hotspot Identification</p>
                </div>
            </div>
            
            <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    Hotspot
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                    Frequent
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    Massive
                </div>
            </div>
        </div>
      
      <div ref={containerRef} className="w-full h-[300px]">
        <svg ref={svgRef} className="w-full h-full text-muted-foreground/20"></svg>
      </div>
    </motion.div>
  );
}
