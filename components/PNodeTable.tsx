"use client";

import { useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";
import { PNode } from "@/lib/types";

import NodeDetailsDrawer from "./NodeDetailsDrawer";
// import { formatBytes, getCountryFlag } from "@/lib/utils"; // Assuming we will create this, or define locally. I'll define locally for now to be safe.

// Helper functions (move to lib/utils.ts in real app)
function getCountryFlagEmoji(cc: string)
{
  if (!cc) return '🌐';
  const codePoints = cc.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatDisk(gb: number)
{
  if (gb > 1000) return `${(gb / 1000).toFixed(1)} TB`;
  return `${gb} GB`;
}

function getHeatmapColor(val: number)
{
  if (val < 50) return 'var(--text-dim)'; // Low/Safe
  if (val < 80) return '#f59e0b'; // Warning
  return '#ef4444'; // Critical
}

import { useQuery } from "@tanstack/react-query";

// ... imports

export default function PNodeTable()
{
  const [selectedNode, setSelectedNode] = useState<PNode | null>(null);

  // Replaced manual fetch with TanStack Query
  const { data: nodes = [] } = useQuery<PNode[]>({
    queryKey: ['nodes'],
    queryFn: () => fetch("/api/nodes").then(res => res.json()),
  });

  const columns = useMemo<ColumnDef<PNode>[]>(
    () => [
      {
        id: "status_id",
        header: "Node",
        accessorFn: row => `${row.status}_${row.id}`,
        cell: ({ row }) =>
        {
          const status = row.original.status;
          const isOnline = status === 'Online';
          const id = row.original.id;

          return (
            <div className="flex items-center gap-3 group">
              {/* Status Dot */}
              <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] transition-all ${isOnline ? 'text-[var(--status-online)] bg-[var(--status-online)]' : 'text-[var(--status-offline)] bg-[var(--status-offline)]'}`} />

              {/* ID & Copy */}
              <div className="flex flex-col">
                <div className="font-mono text-white text-sm flex items-center gap-2">
                  {id ? id.substring(0, 8) : 'Unknown'}...
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)] hover:scale-110"
                    onClick={(e) =>
                    {
                      e.stopPropagation();
                      navigator.clipboard.writeText(id);
                    }}
                    title="Copy ID"
                  >
                    ❐
                  </button>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        accessorKey: "location.country",
        header: "Region",
        cell: ({ getValue }) =>
        {
          const cc = getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCountryFlagEmoji(cc)}</span>
              <span className="text-muted text-xs font-mono">{cc}</span>
            </div>
          )
        }
      },
      {
        accessorKey: "availability",
        header: "Avail (24h)",
        cell: ({ getValue }) =>
        {
          const raw = getValue();
          const val = typeof raw === 'number' ? raw : 0;

          return (
            <div className="flex items-end gap-0.5 h-6 w-16 opacity-80" title={`${val.toFixed(1)}%`}>
              <div className="w-1 rounded-sm" style={{ height: `${val}%`, background: 'var(--status-online)' }}></div>
              <div className="w-1 rounded-sm" style={{ height: `${Math.max(20, val - 10)}%`, background: 'var(--status-online)' }}></div>
              <div className="w-1 rounded-sm" style={{ height: `${Math.max(40, val - 5)}%`, background: 'var(--status-online)' }}></div>
              <div className="w-1 rounded-sm" style={{ height: `${Math.max(80, val - 2)}%`, background: 'var(--status-online)' }}></div>
              <div className="w-1 rounded-sm" style={{ height: '100%', background: 'var(--status-online)' }}></div>
            </div>
          );
        }
      },
      {
        id: 'cpu',
        header: () => <div className="text-right">CPU</div>,
        accessorFn: (row) => row.stats?.cpu_usage,
        cell: ({ getValue }) =>
        {
          const val = getValue() as number || 0;
          return <div className="text-right font-mono" style={{ color: getHeatmapColor(val) }}>{val}%</div>
        }
      },
      {
        id: 'mem',
        header: () => <div className="text-right">Mem</div>,
        accessorFn: (row) => row.stats?.memory_usage,
        cell: ({ getValue }) =>
        {
          const val = getValue() as number || 0;
          return <div className="text-right font-mono" style={{ color: getHeatmapColor(val) }}>{val}%</div>
        }
      },
      {
        id: 'disk',
        header: () => <div className="text-right">Disk</div>,
        accessorFn: (row) => row.stats?.disk_usage,
        cell: ({ getValue }) =>
        {
          const val = getValue() as number || 0;
          return <div className="text-right font-mono text-muted">{formatDisk(val)}</div>
        }
      },
      {
        id: 'uptime',
        header: () => <div className="text-right">Uptime</div>,
        accessorFn: (row) => row.stats?.uptime,
        cell: ({ getValue }) =>
        {
          const val = getValue() as number || 0;
          const days = Math.floor(val / (24 * 3600));
          return <div className="text-right font-mono text-white">{days}d</div>
        }
      },
    ],
    []
  );

  return (
    <>
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar relative">
        <DataTable
          columns={columns}
          data={nodes}
          onRowClick={(row) => setSelectedNode(row)}
        />
      </div>

      <NodeDetailsDrawer
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </>
  );
}
