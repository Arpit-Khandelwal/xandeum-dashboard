"use client";

import { useQuery } from "@tanstack/react-query";
import { NetworkSummary } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Activity, Globe, Zap, Database, Gauge } from "lucide-react";

export default function NetworkOverview()
{
  const { data: summary } = useQuery<NetworkSummary>({
    queryKey: ['network'],
    queryFn: () => fetch("/api/network").then(res => res.json()),
  });

  const displaySummary = summary || {
    totalNodes: 0,
    onlinePercent: 0,
    countries: 0,
    availabilityScore: 0,
    storageCapacity: "128 EB",
    activeEpoch: 42069
  };

  const metrics = [
    { label: "Total pNodes", value: displaySummary.totalNodes, unit: "", trend: "+12", trendUp: true, icon: Server, color: '#fff' },
    { label: "Network Health", value: displaySummary.onlinePercent ? displaySummary.onlinePercent.toFixed(1) : "0", unit: "%", trend: "+0.5%", trendUp: true, icon: Activity, color: 'hsl(var(--status-online))' }, // use status color
    { label: "Active Countries", value: displaySummary.countries || 0, unit: "", trend: "Global", trendUp: true, color: 'hsl(var(--primary))', icon: Globe },
    { label: "Avg Availability", value: displaySummary.availabilityScore ? displaySummary.availabilityScore.toFixed(1) : "0", unit: "%", trend: "High", trendUp: true, color: 'hsl(var(--secondary))', icon: Zap },
    { label: "Active Stake", value: "45.2", unit: "M", trend: "$4.15", trendUp: true, color: '#8b5cf6', icon: Database }, // Purple/Violet
    { label: "Network TPS", value: "6500", unit: "", trend: "-120", trendUp: false, color: '#f59e0b', icon: Gauge },
  ];

  if (!summary) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => <Card key={i} className="h-32 animate-pulse bg-muted/50 border-none" />)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8 gap-6">
      {metrics.map((metric, i) => (
        <Card key={i} className="relative overflow-hidden group border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
          {/* Watermark Icon */}
          <div className="absolute -top-2 -right-2 p-0 opacity-[0.07] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.15]">
            <metric.icon className="w-24 h-24" style={{ color: metric.color || '#fff' }} />
          </div>

          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{metric.label}</CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-foreground" style={{ color: metric.color }}>
              {metric.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
            </div>

            <div className={`text-xs font-medium mt-2 flex items-center gap-1 ${metric.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {metric.trendUp ? '▲' : '▼'} {metric.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
