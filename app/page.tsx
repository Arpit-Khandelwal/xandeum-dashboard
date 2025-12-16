import NetworkOverview from "@/components/NetworkOverview";
import HealthChart from "@/components/HealthChart";
import PNodeTable from "@/components/PNodeTable";
import WorldMap from "@/components/WorldMap";
import ActivityLog from "@/components/ActivityLog";

export default function Home()
{
  return (
    <main className="container animate-fade-in pt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-online)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--status-online)]"></span>
            </div>
            <h3 className="text-[var(--status-online)] font-mono text-xs">LIVE MAINNET</h3>
          </div>
          <h1 className="text-3xl">Xandeum Explorer</h1>
        </div>
        <div className="flex gap-4">
          <a href="https://github.com/Arpit-Khandelwal/xandeum-dashboard/blob/main/DEPLOYMENT_USAGE.md" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Documentation
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <NetworkOverview />

      {/* Primary Dashboard Grid - 2 Rows, Mixed Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Row 1: Charts & Map */}
        <div className="card lg:col-span-2 min-h-[350px]">
          <HealthChart />
        </div>

        <div className="card min-h-[350px] flex flex-col">
          <h2 className="mb-4">Live Node Map</h2>
          <div className="flex-1 relative rounded-lg overflow-hidden border border-[var(--border-color)]">
            <WorldMap />
          </div>
        </div>

        {/* Row 2: Tables & Logs */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Controls Bar */}
          <div className="flex justify-between items-center">
            <h2 className="m-0">Active pNodes</h2>
            <input
              type="text"
              placeholder="Search Node ID..."
              className="card"
              style={{ padding: '0.4rem 1rem', width: 250, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: '#fff' }}
            />
          </div>
          <PNodeTable />
        </div>

        <div className="card h-full">
          <ActivityLog />
        </div>

      </div>
    </main>
  );
}
