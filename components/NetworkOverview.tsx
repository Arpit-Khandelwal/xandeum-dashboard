"use client";

import { useEffect, useState } from "react";
import { NetworkSummary } from "@/lib/types";

export default function NetworkOverview()
{
  const [summary, setSummary] = useState<NetworkSummary | null>(null);

  useEffect(() =>
  {
    fetch("/api/network")
      .then((res) => res.json())
      .then(setSummary)
      .catch(console.error);
  }, []);

  // Mock data falling back if API fails or while loading
  const displaySummary = summary || {
    totalNodes: 0,
    onlinePercent: 0,
    countries: 0,
    availabilityScore: 0,
    // Add mock data for visual completeness
    storageCapacity: "128 EB",
    activeEpoch: 42069
  };

  const metrics = [
    { label: "Total pNodes", value: displaySummary.totalNodes, unit: "", trend: "+12", trendUp: true },
    { label: "Network Health", value: displaySummary.onlinePercent ? displaySummary.onlinePercent.toFixed(1) : "0", unit: "%", trend: "+0.5%", trendUp: true },
    { label: "Active Countries", value: displaySummary.countries || 0, unit: "", trend: "Global", trendUp: true, color: 'var(--primary)' },
    { label: "Avg Availability", value: displaySummary.availabilityScore ? displaySummary.availabilityScore.toFixed(1) : "0", unit: "%", trend: "High", trendUp: true, color: 'var(--secondary)' },
    { label: "Active Stake", value: "45.2", unit: "M", trend: "$4.15", trendUp: true, color: 'var(--accent)' },
    { label: "Network TPS", value: "6500", unit: "", trend: "-120", trendUp: false, color: '#f59e0b' },
  ];

  if (!summary) return <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 animate-pulse gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="card" style={{ height: 120 }}></div>)}
  </div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8 gap-6">
      {metrics.map((metric, i) => (
        <div key={i} className="card relative overflow-hidden group">
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1, transform: 'scale(1.5)', transition: 'transform 0.3s' }}>
            {/* Abstract circle or icon could go here */}
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: metric.color || '#fff' }}></div>
          </div>
          <h3>{metric.label}</h3>
          <div className="stat-value" style={{ color: metric.color || 'var(--text-main)' }}>
            {metric.value}<span style={{ fontSize: '1rem', color: 'var(--text-dim)', marginLeft: 4 }}>{metric.unit}</span>
          </div>
          <div className={`stat-trend ${metric.trendUp ? 'trend-up' : 'trend-down'} mt-2`}>
            {metric.trendUp ? '▲' : '▼'} {metric.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
