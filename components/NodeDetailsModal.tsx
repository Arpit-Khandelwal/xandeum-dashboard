"use client";

import { PNode } from "@/lib/types";

interface NodeDetailsModalProps
{
    node: PNode | null;
    onClose: () => void;
}

export default function NodeDetailsModal({ node, onClose }: NodeDetailsModalProps)
{
    if (!node) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="card w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-0 overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted hover:text-white z-10"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="p-6 border-b border-[var(--border-color)] bg-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${node.status === 'Online' ? 'bg-[var(--status-online)]' : 'bg-[var(--status-offline)]'} shadow-[0_0_10px_currentColor]`} />
                        <span className="text-sm font-mono text-muted uppercase tracking-widest">{node.status}</span>
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-1">
                        Node {node.id.substring(0, 8)}...
                    </h2>
                    <p className="font-mono text-xs text-[var(--primary)] opacity-80">{node.id}</p>
                </div>

                {/* Body */}
                <div className="p-6 grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xs text-muted uppercase mb-4 border-b border-white/10 pb-2">Network Info</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted">IP Address</span>
                                <span className="font-mono text-white">{node.ip}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Port</span>
                                <span className="font-mono text-white">{node.port}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Version</span>
                                <span className="text-white">{node.version}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Location</span>
                                <span className="text-white flex items-center gap-2">
                                    {node.location.country}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs text-muted uppercase mb-4 border-b border-white/10 pb-2">Performance Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted">Uptime</span>
                                <span className="text-white">
                                    {Math.floor((node.stats?.uptime || 0) / (24 * 3600))} days
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted">CPU Load</span>
                                    <span className={node.stats?.cpu_usage! > 80 ? 'text-[var(--status-offline)]' : 'text-[var(--status-online)]'}>
                                        {node.stats?.cpu_usage}%
                                    </span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--primary)]" style={{ width: `${node.stats?.cpu_usage}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted">Memory</span>
                                    <span className="text-white">{node.stats?.memory_usage}%</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--secondary)]" style={{ width: `${node.stats?.memory_usage}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted">Disk Usage</span>
                                    <span className="text-white">{node.stats?.disk_usage} GB</span>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[var(--accent)]" style={{ width: `${Math.min((node.stats?.disk_usage || 0) / 1000 * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-white/5 border-t border-[var(--border-color)] flex justify-end">
                    <button className="btn btn-primary" onClick={onClose}>Close Details</button>
                </div>

            </div>
        </div>
    );
}
