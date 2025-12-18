"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";

export default function HealthChart()
{
  const { data: rawData = [] } = useQuery<any[]>({
    queryKey: ['network-history'],
    queryFn: () => fetch("/api/history").then(res => res.json()),
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  if (!rawData || rawData.length === 0) {
    return (
      <div className="flex flex-col h-full w-full justify-center items-center text-muted-foreground">
        <div className="text-xl font-bold mb-2 opacity-20">NO DATA</div>
        <div className="text-xs opacity-50">Historical metrics unavailable</div>
      </div>
    )
  }

  // Calculate stats derived from rawData
  // Calculate stats derived from rawData
  const scores = rawData.map((d: any) => d.score);
  const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

  const data = rawData.map((d: any) =>
  {
    const date = new Date(d.timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    // Since we are showing hourly data, let's just show HH:00 to be cleaner
    return {
      time: `${hours}:00`,
      score: d.score,
    };
  });

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold">Network Health</h2>
          <p className="text-xs text-muted-foreground">Live & 24h History</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-mono font-bold text-[var(--primary)]">{avg.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[60, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              itemStyle={{ color: 'hsl(var(--primary))' }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
