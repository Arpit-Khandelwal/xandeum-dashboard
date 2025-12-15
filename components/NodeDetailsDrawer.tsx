"use client";

import { PNode } from "@/lib/types";
import { useEffect, useState } from "react";

interface NodeDetailsDrawerProps
{
    node: PNode | null;
    onClose: () => void;
    isOpen: boolean;
}

export default function NodeDetailsDrawer({ node, onClose, isOpen }: NodeDetailsDrawerProps)
{
    const [mount, setMount] = useState(false);

    useEffect(() =>
    {
        if (isOpen) setMount(true);
        else setTimeout(() => setMount(false), 300); // Wait for slide out
    }, [isOpen]);

    if (!mount) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] z-50 bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col">

                    {/* Header */}
                    <div className="p-6 border-b border-[var(--border-color)] bg-white/5 flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                                    <div className={`w-2 h-2 rounded-full ${node?.status === 'Online' ? 'bg-[var(--status-online)] shadow-[0_0_8px_var(--status-online)]' : 'bg-[var(--status-offline)]'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{node?.status}</span>
                                </div>
                                {node?.location?.country && (
                                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                        <span className="text-base">{getCountryFlag(node.location.country)}</span>
                                        <span className="font-mono">{node.location.country}</span>
                                    </div>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2 font-mono break-all leading-tight">
                                {node?.id}
                            </h2>

                            <button
                                className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-[var(--primary)] hover:text-black border border-white/5 hover:border-transparent transition-all duration-200 text-xs font-medium text-[var(--primary)] w-fit group"
                                onClick={() =>
                                {
                                    if (node) {
                                        navigator.clipboard.writeText(node.id);
                                        // Could show toast here but simple feedback logic is fine
                                    }
                                }}
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span>Copy ID</span>
                            </button>
                        </div>
                        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xs text-muted mb-1">Uptime</div>
                                <div className="text-lg font-mono text-white">{Math.floor((node?.stats?.uptime || 0) / 86400)}d</div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xs text-muted mb-1">Version</div>
                                <div className="text-lg font-mono text-white">{node?.version}</div>
                            </div>
                        </div>

                        {/* Performance Modules */}
                        <div>
                            <h3 className="text-xs text-muted uppercase mb-4 font-bold tracking-wider">Resources</h3>

                            <ResourceBar label="CPU Load" value={node?.stats?.cpu_usage || 0} color="var(--primary)" />
                            <div className="mt-4"></div>
                            <ResourceBar label="Memory" value={node?.stats?.memory_usage || 0} color="var(--secondary)" />
                            <div className="mt-4"></div>
                            <ResourceBar label="Disk Usage" value={(node?.stats?.disk_usage || 0) / 1000 * 100} displayValue={`${formatBytes((node?.stats?.disk_usage || 0) * 1024 * 1024 * 1024)}`} color="var(--accent)" />
                        </div>

                        {/* Network Info */}
                        <div>
                            <h3 className="text-xs text-muted uppercase mb-4 font-bold tracking-wider">Network</h3>
                            <div className="space-y-3 font-mono text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted">IP Address</span>
                                    <span>{node?.ip}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted">Port</span>
                                    <span>{node?.port}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-muted">Last Seen</span>
                                    <span>{node?.lastSeen ? new Date(node.lastSeen).toLocaleTimeString() : '-'}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-[var(--border-color)] bg-white/5 text-center text-xs text-muted">
                        Node ID: {node?.id}
                    </div>

                </div>
            </div>
        </>
    );
}

function ResourceBar({ label, value, displayValue, color }: { label: string, value: number, displayValue?: string, color: string })
{
    const cappedValue = Math.min(Math.max(value, 0), 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">{label}</span>
                <span className="text-white font-mono">{displayValue || `${value}%`}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${cappedValue}%`, background: color }}
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
