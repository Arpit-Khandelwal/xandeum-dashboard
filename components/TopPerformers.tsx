"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { PNode } from "@/lib/types";
import { FadeIn } from "@/components/FadeIn";

function formatStorage(bytes: number)
{
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatUptime(seconds: number)
{
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
}

export function TopStorageChart()
{
    const { data: nodes = [] } = useQuery<PNode[]>({
        queryKey: ['nodes'],
        queryFn: () => fetch("/api/nodes").then(res => res.json()),
    });

    const topNodes = nodes
        .filter(n => (n.stats?.storage_committed || 0) > 0)
        .sort((a, b) => (b.stats?.storage_committed || 0) - (a.stats?.storage_committed || 0))
        .slice(0, 5)
        .map(n => ({
            name: n.id.substring(0, 6) + '...',
            fullId: n.id,
            storage: n.stats?.storage_committed || 0,
        }));

    if (topNodes.length === 0) {
        return (
            <div className="flex flex-col h-full justify-center items-center text-muted-foreground opacity-50">
                <p>No storage data available</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground font-bold">Top Storage Contributors</h2>
            <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topNodes} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                            formatter={(value: number | undefined) => formatStorage(value || 0)}
                        />
                        <Bar dataKey="storage" radius={[0, 4, 4, 0]} barSize={20}>
                            {topNodes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={0.8 - (index * 0.1)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function TopUptimeList()
{
    const { data: nodes = [] } = useQuery<PNode[]>({
        queryKey: ['nodes'],
        queryFn: () => fetch("/api/nodes").then(res => res.json()),
    });

    const topNodes = nodes
        .sort((a, b) => (b.stats?.uptime || 0) - (a.stats?.uptime || 0))
        .slice(0, 5);

    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground font-bold">Longest Running Nodes</h2>
            <div className="flex flex-col gap-3">
                {topNodes.map((node, i) => (
                    <div key={node.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="font-mono text-xs text-muted-foreground w-6">#{i + 1}</div>
                            <div className="flex flex-col">
                                <div className="font-mono text-sm text-foreground">{node.id.substring(0, 8)}...</div>
                                <div className="text-xs text-muted-foreground">{node.location.country}</div>
                            </div>
                        </div>
                        <div className="font-mono text-sm text-[var(--status-online)]">
                            {formatUptime(node.stats?.uptime || 0)}
                        </div>
                    </div>
                ))}
                {topNodes.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-4">No data available</div>
                )}
            </div>
        </div>
    );
}

export function VersionDistribution()
{
    const { data: nodes = [] } = useQuery<PNode[]>({
        queryKey: ['nodes'],
        queryFn: () => fetch("/api/nodes").then(res => res.json()),
    });

    const versions = nodes.reduce((acc, node) =>
    {
        const v = node.version || 'Unknown';
        acc[v] = (acc[v] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(versions)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const total = nodes.length;

    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground font-bold">Node Versions</h2>
            <div className="flex flex-col gap-3">
                {data.map((entry, i) => (
                    <div key={entry.name} className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                            <span className="font-mono text-muted-foreground">{entry.name}</span>
                            <span className="font-bold">{((entry.value / total) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[var(--primary)]"
                                style={{ width: `${(entry.value / total) * 100}%`, opacity: 1 - (i * 0.15) }}
                            />
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-4">No data available</div>
                )}
            </div>
        </div>
    );
}
