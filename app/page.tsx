import NetworkOverview from "@/components/NetworkOverview";
import HealthChart from "@/components/HealthChart";
import PNodeTable from "@/components/PNodeTable";
import WorldMap from "@/components/WorldMap";
import ActivityLog from "@/components/ActivityLog";
import { FadeIn } from "@/components/FadeIn";
import { TopStorageChart, TopUptimeList, VersionDistribution } from "@/components/TopPerformers";

export default function Home()
{
  return (
    <main className="container pt-6 flex flex-col flex-1">

      {/* Header Section */}
      <FadeIn delay={0}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-online)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--status-online)]"></span>
              </div>
              <h3 className="text-[var(--status-online)] font-mono text-xs">LIVE DEVNET</h3>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Xandeum Explorer</h1>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/Arpit-Khandelwal/xandeum-dashboard/blob/main/DEPLOYMENT_USAGE.md" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Documentation
            </a>
          </div>
        </div>
      </FadeIn>

      {/* Metrics Row */}
      <FadeIn delay={0.1}>
        <NetworkOverview />
      </FadeIn>

      {/* Primary Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 flex-1">

        {/* Row 1: Charts & Map */}
        <div className="lg:col-span-2 min-h-[350px]">
          <FadeIn delay={0.2} className="h-full">
            <div className="card h-full">
              <HealthChart />
            </div>
          </FadeIn>
        </div>

        <div className="min-h-[350px]">
          <FadeIn delay={0.3} className="h-full">
            <div className="card h-full flex flex-col">
              <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground font-bold">Live Latitude</h2>
              <div className="flex-1 relative rounded-lg overflow-hidden border border-[var(--border-color)]">
                <WorldMap />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Row 1.5: Top Performers */}
        <div className="min-h-[300px]">
          <FadeIn delay={0.35} className="h-full">
            <div className="card h-full">
              <TopStorageChart />
            </div>
          </FadeIn>
        </div>

        <div className="min-h-[300px]">
          <FadeIn delay={0.35} className="h-full">
            <div className="card h-full">
              <VersionDistribution />
            </div>
          </FadeIn>
        </div>

        <div className="min-h-[300px]">
          <FadeIn delay={0.35} className="h-full">
            <div className="card h-full">
              <TopUptimeList />
            </div>
          </FadeIn>
        </div>

        {/* Row 2: Tables & Logs */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <FadeIn delay={0.4}>
            <div className="flex justify-between items-center mb-0">
              <h2 className="m-0 text-xl">Active pNodes</h2>
            </div>
            <PNodeTable />
          </FadeIn>
        </div>

        <div className="h-full">
          <FadeIn delay={0.5} className="h-full">
            <div className="card h-full">
              <ActivityLog />
            </div>
          </FadeIn>
        </div>

      </div>


    </main>
  );
}
