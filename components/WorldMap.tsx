"use client";

import { useQuery } from "@tanstack/react-query";
import { PNode } from "@/lib/types";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Graticule, Sphere } from "react-simple-maps";
import { useMemo } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap()
{
    const { data: nodes = [] } = useQuery<PNode[]>({
        queryKey: ['nodes'],
        queryFn: () => fetch("/api/nodes").then(res => res.json())
    });

    // Filter nodes with valid location data
    const activeNodes = useMemo(() =>
    {
        return Array.isArray(nodes) ? nodes.filter(n => n.location?.lat && n.location?.long) : [];
    }, [nodes]);

    // Calculate top countries
    const topCountries = useMemo(() =>
    {
        const counts: Record<string, number> = {};
        activeNodes.forEach(n =>
        {
            const c = n.location?.country || "Unknown";
            counts[c] = (counts[c] || 0) + 1;
        });
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
    }, [activeNodes]);

    return (
        <div className="w-full h-full bg-[#0b0d1a] rounded-xl border border-white/5 overflow-hidden relative shadow-inner flex flex-col">
            <div className="flex-1 relative">
                <ComposableMap projection="geoMercator" projectionConfig={{ scale: 110 }} className="w-full h-full">
                    <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={4}>
                        <Sphere stroke="#FFF" strokeWidth={0.3} fill="transparent" id="sphere" />
                        <Graticule stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="rgba(255,255,255,0.08)"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "rgba(255,255,255,0.15)", outline: "none", transition: 'all 250ms' },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>

                        {activeNodes.map((node) => (
                            <Marker key={node.id} coordinates={[node.location!.long!, node.location!.lat!]}>
                                {/* Pulsing effect */}
                                <circle r={6} fill={node.status === 'Online' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} opacity={0.3}>
                                    <animate attributeName="r" from="2" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                                </circle>

                                {/* Core dot */}
                                <circle
                                    r={2.5}
                                    fill={node.status === 'Online' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'}
                                    stroke="#fff"
                                    strokeWidth={0.5}
                                />

                                <title>{`Node: ${(node.id || 'Unknown').substring(0, 8)}... (${node.location?.country || 'Unknown'})`}</title>
                            </Marker>
                        ))}
                    </ZoomableGroup>
                </ComposableMap>

                {/* Overlay Legend */}
                <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-muted-foreground pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shadow-[0_0_8px_hsl(var(--primary))]"></span>
                        <span className="font-semibold text-white">Active Node</span>
                        <span className="opacity-50">({activeNodes.filter(n => n.status === 'Online').length})</span>
                    </div>
                </div>

                {/* Top Countries Overlay */}
                <div className="absolute top-4 right-4 p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-muted-foreground min-w-[120px] pointer-events-none">
                    <h4 className="text-white font-bold mb-2 uppercase tracking-wider text-[10px]">Top Hubs</h4>
                    <ul className="space-y-1">
                        {topCountries.map(([country, count]) => (
                            <li key={country} className="flex justify-between items-center">
                                <span>{country}</span>
                                <span className="font-mono text-white">{count}</span>
                            </li>
                        ))}
                        {topCountries.length === 0 && <li>No data</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}
