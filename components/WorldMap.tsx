"use client";

import { useQuery } from "@tanstack/react-query";
import { PNode } from "@/lib/types";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useMemo } from "react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap()
{
    const { data: nodes = [] } = useQuery<PNode[]>({ queryKey: ['nodes'] });

    // Filter nodes with valid location data
    const activeNodes = useMemo(() =>
    {
        return nodes.filter(n => n.location?.lat && n.location?.long);
    }, [nodes]);

    return (
        <div className="w-full h-[400px] bg-card/30 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden relative shadow-inner">
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
                <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={4}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="rgba(255,255,255,0.05)"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "rgba(255,255,255,0.1)", outline: "none", transition: 'all 250ms' },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {activeNodes.map((node) => (
                        <Marker key={node.id} coordinates={[node.location!.long!, node.location!.lat!]}>
                            {/* Pulsing effect */}
                            <circle r={8} fill={node.status === 'Online' ? 'var(--primary)' : 'var(--destructive)'} opacity={0.3}>
                                <animate attributeName="r" from="4" to="12" dur="2s" begin="0s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="indefinite" />
                            </circle>

                            {/* Core dot */}
                            <circle
                                r={3}
                                fill={node.status === 'Online' ? 'var(--primary)' : 'var(--destructive)'}
                                stroke="#fff"
                                strokeWidth={1}
                                style={{ filter: `drop-shadow(0 0 4px ${node.status === 'Online' ? 'var(--primary)' : 'var(--destructive)'})` }}
                            />

                            <title>{`Node: ${(node.id || 'Unknown').substring(0, 8)}... (${node.location?.country || 'Unknown'})`}</title>
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>

            {/* Overlay Legend */}
            <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]"></span>
                    <span className="font-semibold text-white">Active Node</span>
                    <span className="opacity-50">({activeNodes.filter(n => n.status === 'Online').length})</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--destructive)]"></span>
                    <span>Offline</span>
                    <span className="opacity-50">({activeNodes.filter(n => n.status !== 'Online').length})</span>
                </div>
            </div>
        </div>
    );
}
