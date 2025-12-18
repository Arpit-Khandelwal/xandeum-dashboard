"use client";

import { useQuery } from "@tanstack/react-query";
import { PNode, Activity } from "@/lib/types";



export default function ActivityLog()
{
    const { data: logs = [] } = useQuery<Activity[]>({
        queryKey: ['activity-logs'],
        queryFn: () => fetch("/api/activity").then(res => res.json()),
        refetchInterval: 5000 // Poll every 5 seconds
    });

    return (
        <div className="h-full max-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase text-muted tracking-wider">Real-time Activity</h2>
                <div className="text-xs text-muted-foreground/50 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {logs.length === 0 && (
                    <div className="text-center text-muted-foreground text-xs py-8 opacity-50">
                        Waiting for network events...
                    </div>
                )}

                {logs.map((act) => (
                    <div key={act.id} className="flex gap-3 items-start p-3 rounded-lg bg-card/50 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor] ${act.type === 'success' ? 'bg-[var(--status-online)] text-[var(--status-online)]' :
                            act.type === 'warning' ? 'bg-amber-500 text-amber-500' :
                                act.type === 'error' ? 'bg-[var(--status-offline)] text-[var(--status-offline)]' :
                                    'bg-[var(--primary)] text-[var(--primary)]'
                            }`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none mb-1.5">{act.msg}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {act.nodeId && (
                                    <>
                                        <span className="font-mono text-[var(--primary)] bg-[var(--primary)]/10 px-1 rounded">
                                            {act.nodeId.substring(0, 8)}...
                                        </span>
                                        <span>•</span>
                                    </>
                                )}
                                <span>{new Date(act.time).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
