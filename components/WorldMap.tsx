"use client";

import { useEffect, useState } from "react";
import { PNode } from "@/lib/types";

export default function WorldMap()
{
    const [nodes, setNodes] = useState<PNode[]>([]);

    useEffect(() =>
    {
        // In a real app, you'd fetch nodes with geo-coordinates
        // For now, we'll mock some "dots" on a map
        setNodes([
            { id: '1', status: 'Online', location: { country: 'USA', lat: 37, long: -95 } } as any,
            { id: '2', status: 'Online', location: { country: 'DE', lat: 51, long: 10 } } as any,
            { id: '3', status: 'Syncing', location: { country: 'JP', lat: 36, long: 138 } } as any,
            { id: '4', status: 'Offline', location: { country: 'BR', lat: -14, long: -51 } } as any,
            { id: '5', status: 'Online', location: { country: 'AU', lat: -25, long: 133 } } as any,
        ]);
    }, []);

    // Simple projection function (Mercator-ish) for standard 1000x500 SVG
    const project = (lat: number, lng: number) =>
    {
        const x = (lng + 180) * (1000 / 360);
        const latRad = (lat * Math.PI) / 180;
        const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
        const y = 500 / 2 - (500 * mercN) / (2 * Math.PI);
        return { x, y };
    };

    return (
        <div className="w-full h-full relative" style={{ minHeight: '300px', background: 'radial-gradient(circle, #1a1d3a 0%, #050614 100%)', borderRadius: '1rem', overflow: 'hidden' }}>
            <svg viewBox="0 0 1000 500" className="w-full h-full opacity-60">
                {/* Simplified World Map Path */}
                <path
                    d="M153,138 c0,0,13-14,18-13 s17-4,24,0 s11,10,8,16 s-12,8-19,5 s-14-11-14-11 L153,138 z
             M486,133 c0,0,16-9,26-5 s12,12,6,17 s-18,6-25,1 s-7-13-7-13 L486,133 z
             M818,158 c0,0,21-20,31-15 s6,17,0,22 s-23,4-30-2 s-8-14-1-5 L818,158 z
             M248,154 c0,0,88-46,110-30 s-10,76-35,84 s-96-16-96-16 L248,154 z
             M626,160 c0,0,52-32,71-20 s12,62-4,67 s-78-15-78-15 L626,160 z
             M780,350 c0,0,32-28,45-18 s-4,38-16,40 s-40-10-40-10 L780,350 z
             M280,360 c0,0,28-40,48-28 s-8,50-20,52 s-38-12-38-12 L280,360 z
             M550,280 c0,0,14-20,24-10 s-2,24-10,24 s-20-8-20-8 L550,280 z
             "
                    // This path is extremely abstract. I should use a cleaner one or just dots if I can't get a good path.
                    // Actually, for a tech dashboard, a "grid" map or just dots might be better if I don't have a huge path string.
                    // Let's rely on a faint background image for the map if possible, or build a 'grid' of dots.
                    // Strategy Switch: Grid of dots that light up.
                    fill="none" stroke="none"
                />

                {/* Grid Pattern Map */}
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.1)" />
                    </pattern>
                </defs>
                <rect width="1000" height="500" fill="url(#grid)" />

                {/* Nodes */}
                {nodes.map((node, i) =>
                {
                    const { x, y } = project(node.location.lat!, node.location.long!);
                    // Clamp for safety
                    const safeX = Math.max(0, Math.min(1000, x));
                    const safeY = Math.max(0, Math.min(500, y));

                    return (
                        <g key={i}>
                            <circle cx={safeX} cy={safeY} r="4" fill={node.status === 'Online' ? '#00d4ff' : '#ff007a'} className="animate-pulse" />
                            <circle cx={safeX} cy={safeY} r="8" fill={node.status === 'Online' ? '#00d4ff' : '#ff007a'} opacity="0.3">
                                <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                            </circle>
                        </g>
                    );
                })}
            </svg>

            <div className="absolute bottom-4 left-4 text-xs text-muted">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#00d4ff]"></span> Active Node
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff007a]"></span> Offline/Syncing
                </div>
            </div>
        </div>
    );
}
