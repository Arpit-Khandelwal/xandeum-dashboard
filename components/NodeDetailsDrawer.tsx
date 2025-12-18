"use client";

import { PNode } from "@/lib/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface NodeDetailsDrawerProps
{
    node: PNode | null;
    onClose: () => void;
    isOpen: boolean;
}

export default function NodeDetailsDrawer({ node, onClose, isOpen }: NodeDetailsDrawerProps)
{
    if (!node) return null;

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="right" className="w-full sm:w-[450px] border-l border-border bg-card p-0 flex flex-col gap-0 text-foreground">

                {/* Header */}
                <div className="p-6 border-b border-border bg-muted/20">
                    <div className="flex items-center gap-4 mb-3">
                        <Badge variant={node.status === 'Online' ? 'online' : 'offline'} className="pl-1 pr-2 gap-2">
                            <div className={`w-2 h-2 rounded-full ${node.status === 'Online' ? 'bg-emerald-400 shadow-[0_0_8px_currentColor]' : 'bg-rose-500'}`} />
                            {node.status}
                        </Badge>

                        {node.location?.country && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="text-base">{getCountryFlag(node.location.country)}</span>
                                <span className="font-mono">{node.location.country}</span>
                            </div>
                        )}
                    </div>

                    <SheetTitle className="text-xl font-bold font-mono break-all leading-tight mb-2">
                        {node.id}
                    </SheetTitle>

                    <button
                        className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-md bg-secondary/10 hover:bg-primary hover:text-primary-foreground border border-transparent hover:border-transparent transition-all duration-200 text-xs font-medium text-primary w-fit group"
                        onClick={() =>
                        {
                            if (node) {
                                navigator.clipboard.writeText(node.id);
                            }
                        }}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copy ID</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/20 rounded-lg border border-border">
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Uptime</div>
                            <div className="text-xl font-mono text-foreground">{Math.floor((node.stats?.uptime || 0) / 86400)}d</div>
                        </div>
                        <div className="p-4 bg-muted/20 rounded-lg border border-border">
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wider">Version</div>
                            <div className="text-xl font-mono text-foreground">{node.version}</div>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-xs text-muted-foreground uppercase mb-4 font-bold tracking-wider">System Resources</h3>
                        <div className="space-y-6">
                            <ResourceBar label="CPU Load" value={node.stats?.cpu_usage || 0} displayValue={node.stats?.cpu_usage === undefined ? 'N/A' : undefined} color="hsl(var(--primary))" />
                            <ResourceBar label="Memory" value={node.stats?.memory_usage || 0} displayValue={node.stats?.memory_usage === undefined ? 'N/A' : undefined} color="hsl(var(--secondary))" />
                            <ResourceBar label="Disk Usage" value={(node.stats?.disk_usage || 0) / 1000 * 100} displayValue={`${formatBytes((node.stats?.disk_usage || 0) * 1024 * 1024 * 1024)}`} color="#10b981" />
                        </div>
                    </div>

                    {/* Network Info */}
                    <div>
                        <h3 className="text-xs text-muted-foreground uppercase mb-4 font-bold tracking-wider">Network Configuration</h3>
                        <div className="space-y-0 text-sm border border-border rounded-lg overflow-hidden">
                            <div className="flex justify-between p-3 bg-muted/10 border-b border-border">
                                <span className="text-muted-foreground">IP Address</span>
                                <span className="font-mono">{node.ip}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/10 border-b border-border">
                                <span className="text-muted-foreground">Port</span>
                                <span className="font-mono">{node.port}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-muted/10">
                                <span className="text-muted-foreground">Last Seen</span>
                                <span className="font-mono">{node.lastSeen ? new Date(node.lastSeen).toLocaleTimeString() : '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/20 text-center text-xs text-muted-foreground font-mono">
                    ID: {node.id.substring(0, 16)}...
                </div>

            </SheetContent>
        </Sheet>
    );
}

function ResourceBar({ label, value, displayValue, color }: { label: string, value: number, displayValue?: string, color: string })
{
    const cappedValue = Math.min(Math.max(value, 0), 100);
    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
                <span className="text-sm font-mono font-bold text-foreground">{displayValue || `${value}%`}</span>
            </div>
            {/* Track */}
            <div className="h-2.5 w-full bg-secondary/10 rounded-full overflow-hidden border border-white/5">
                {/* Fill */}
                <div
                    className="h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_currentColor]"
                    style={{ width: `${cappedValue}%`, background: color, color: color }}
                />
            </div>
        </div>
    )
}

function getCountryFlag(cc: string)
{
    const codePoints = cc
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function formatBytes(bytes: number, decimals = 2)
{
    if (!+bytes) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
