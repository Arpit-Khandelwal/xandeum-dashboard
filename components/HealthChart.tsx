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
    return {
      timestamp: d.timestamp,
      score: d.score,
    };
  }).sort((a, b) => a.timestamp - b.timestamp);

  // Generate clean ticks for XAxis
  const startTime = data.length > 0 ? data[0].timestamp : Date.now() - 24 * 60 * 60 * 1000;
  const endTime = data.length > 0 ? data[data.length - 1].timestamp : Date.now();
  const durationMs = endTime - startTime;

  // Decide on tick interval (aim for ~6-8 ticks)
  // For 24h (86400000ms), 4h (14400000) interval gives 6 ticks, 3h gives 8 ticks.
  // Let's aim for nice round intervals within the set: 1h, 2h, 3h, 4h, 6h, 12h
  const desiredTicks = 8;
  const roughInterval = durationMs / desiredTicks;

  const hour = 60 * 60 * 1000;
  const niceIntervals = [hour, 2 * hour, 3 * hour, 4 * hour, 6 * hour, 12 * hour];
  const interval = niceIntervals.find(i => i >= roughInterval) || niceIntervals[niceIntervals.length - 1];

  const ticks: number[] = [];
  let current = new Date(startTime);

  // Align to the interval boundary
  // E.g. if interval is 3h, we want 0, 3, 6, 9...
  // Use local hours for alignment to look "clean" to the user
  const currentHour = current.getHours();
  const intervalHours = interval / hour;
  const alignedHour = currentHour - (currentHour % intervalHours);
  current.setHours(alignedHour, 0, 0, 0); // Align and clear minutes/seconds

  // Advance if we moved backwards before start
  // Actually, reasonable to show a tick slightly before start if we want context, 
  // but Recharts domain is dataMin-dataMax. 
  // If we want the first tick to be visible, it should be >= dataMin.
  // Let's loop and only add if >= startTime

  while (current.getTime() <= endTime) {
    if (current.getTime() >= startTime) {
      ticks.push(current.getTime());
    }
    current.setTime(current.getTime() + interval);
  }

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
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              ticks={ticks}
              tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
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
              labelFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
