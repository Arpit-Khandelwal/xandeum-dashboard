import { PrpcClient } from 'xandeum-prpc';
import { PNode, NetworkSummary, PodsResponse, NodeStats } from './types';

const seeds = [
  "173.212.220.65",
  "161.97.97.41",
  "192.190.136.36",
  "192.190.136.38",
  "207.244.255.1",
  "192.190.136.28",
  "192.190.136.29",
  "173.212.203.145",
];

async function getWorkingClient(): Promise<PrpcClient>
{
  const shuffledSeeds = [...seeds].sort(() => Math.random() - 0.5);
  for (const seed of shuffledSeeds) {
    try {
      const client = new PrpcClient(seed);
      // Simple ping-like call to verify connectivity
      // @ts-ignore
      await client.getPods();
      return client;
    } catch (e) {
      console.warn(`Seed ${seed} is down, trying next...`);
    }
  }
  throw new Error("All seeds failed");
}

interface RawPod
{
  pubkey: string;
  address: string;
  version: string;
  last_seen_timestamp: number;
  uptime: number;
  storage_used: number;
  storage_committed: number;
  // Other fields...
}

function mapRawToPNode(raw: RawPod): PNode
{
  const [ip, portStr] = raw.address.split(':');
  const now = Date.now() / 1000;
  // If last seen within 300 seconds (5 mins), online
  const isOnline = (now - raw.last_seen_timestamp) < 300;

  // Deterministic mock location based on IP
  const ipParts = ip.split('.').map(Number);
  const countryCodes = ['USA', 'DE', 'JP', 'SG', 'UK', 'BR', 'AU', 'CA'];
  const country = countryCodes[(ipParts[0] || 0) % countryCodes.length];
  // Mock coords for map
  const latRes = [37, 51, 36, 1, 55, -14, -25, 56];
  const longRes = [-95, 10, 138, 103, -3, -51, 133, -106];
  const idx = (ipParts[0] || 0) % countryCodes.length;

  return {
    id: raw.pubkey,
    ip: ip,
    port: parseInt(portStr) || 0,
    status: isOnline ? "Online" : "Offline",
    version: raw.version,
    lastSeen: new Date(raw.last_seen_timestamp * 1000),
    location: {
      country: country,
      lat: latRes[idx],
      long: longRes[idx]
    },
    performance: 100, // Placeholder
    availability: 99.9, // Placeholder
    atRisk: false,
    stats: {
      nodeId: raw.pubkey,
      uptime: raw.uptime,
      disk_usage: raw.storage_used,
      storage_committed: raw.storage_committed,
      // cpu_usage: undefined, 
      // memory_usage: undefined, 
      bandwidth_in: 0,
      bandwidth_out: 0,
      last_sync: new Date(),
    }
  };
}

export async function getPNodes(): Promise<PNode[]>
{
  const client = await getWorkingClient();
  // @ts-ignore
  const response = await client.getPodsWithStats();
  const rawPods = (response as any).pods as RawPod[];

  const nodes = rawPods.map(mapRawToPNode);

  // Deduplicate by ID
  const uniqueNodes = Array.from(new Map(nodes.map(n => [n.id, n])).values());

  return uniqueNodes;
}


export async function getPodsWithStats(): Promise<PodsResponse>
{
  const client = await getWorkingClient();
  // @ts-ignore 
  const response = await client.getPodsWithStats();
  return response as unknown as PodsResponse;
}

export async function getStats(nodeId: string): Promise<NodeStats>
{
  const client = await getWorkingClient();
  // @ts-ignore 
  const stats = await client.getStats(nodeId);
  return stats as unknown as NodeStats;
}

export async function getNetworkSummary()
{
  // Use the mapped nodes to get clean stats
  const pods = await getPNodes();

  const totalNodes = pods.length;
  const onlineNodes = pods.filter(n => n.status === "Online").length;
  const onlinePercent = totalNodes > 0 ? (onlineNodes / totalNodes) * 100 : 0;

  // Extract unique countries
  const countries = new Set(pods.map(n => n.location.country)).size;

  // Average Availability
  const availabilityScore = pods.reduce((acc, n) => acc + (n.availability || 0), 0) / (pods.length || 1);

  // Version breakdown
  const versionMap = new Map<string, number>();
  pods.forEach(n =>
  {
    if (n.version) {
      versionMap.set(n.version, (versionMap.get(n.version) || 0) + 1);
    }
  });
  const versions = Array.from(versionMap.entries()).map(([v, count]) => ({
    version: v,
    percent: (count / totalNodes) * 100
  }));

  return {
    totalNodes,
    onlinePercent,
    countries,
    atRiskCount: pods.filter(n => n.atRisk).length,
    compositeScore: Math.round(availabilityScore * 0.4 + onlinePercent * 0.6),
    availabilityScore,
    versionHealth: versions.every(v => v.percent > 10) ? 90 : 60,
    distributionScore: countries > 5 ? 90 : 40,
    versions,
    locations: [],
  } as NetworkSummary;
}

// Add more functions like getStats() if library supports
