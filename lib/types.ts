export interface PNode
{
  id: string;
  ip: string;
  port: number;
  status: "Online" | "Offline" | "Syncing" | "Warning";
  version: string;
  location: { country: string; lat?: number; long?: number };
  lastSeen: Date;
  performance: number;
  availability: number;
  atRisk: boolean;
  stats?: NodeStats;
  // Add more fields as per API response
}

export interface NetworkSummary
{
  totalNodes: number;
  onlinePercent: number;
  countries: number;
  atRiskCount: number;
  compositeScore: number;
  availabilityScore: number;
  versionHealth: number;
  distributionScore: number;
  versions: { version: string; percent: number }[];
  locations: { country: string; nodeCount: number; online: number; healthy: number }[];
}

export interface HistoricalHealth
{
  period: "1h" | "6h" | "24h";
  data: { timestamp: Date; score: number }[];
  avg: number;
  min: number;
  max: number;
  change: number;
}

export interface PodsResponse
{
  pods: PNode[];
  total_count: number;
  // Add other fields as needed
}

export interface NodeStats
{
  nodeId: string;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage: number;
  storage_committed?: number;
  bandwidth_in?: number;
  bandwidth_out?: number;
  uptime: number;
  last_sync: Date;
}

export interface Activity
{
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  msg: string;
  nodeId?: string;
  time: number;
}
