
import fs from 'fs';
import path from 'path';
import { getNetworkSummary, getPNodes } from "@/lib/prpcClient";
import { PNode, Activity } from './types';

const DB_PATH = path.join(process.cwd(), 'network_stats.json');

// Interface for our DB schema
interface DbSchema
{
    stats: {
        timestamp: number;
        totalNodes: number;
        onlineNodes: number;
        score: number;
    }[];
    logs: Activity[];
}

function readDb(): DbSchema
{
    try {
        if (!fs.existsSync(DB_PATH)) {
            return { stats: [], logs: [] };
        }
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            stats: parsed.stats || [],
            logs: parsed.logs || []
        };
    } catch (e) {
        return { stats: [], logs: [] };
    }
}

function writeDb(data: DbSchema)
{
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Failed to write to DB", e);
    }
}

export function saveNetworkStats(total: number, online: number, score: number)
{
    const db = readDb();
    db.stats.push({
        timestamp: Date.now(),
        totalNodes: total,
        onlineNodes: online,
        score
    });
    // Keep last 1000 entries
    if (db.stats.length > 1000) {
        db.stats = db.stats.slice(-1000);
    }
    writeDb(db);
}

export function saveActivity(log: Omit<Activity, 'id' | 'time'>)
{
    const db = readDb();
    const newLog: Activity = {
        ...log,
        id: crypto.randomUUID(),
        time: Date.now()
    };

    // Add to beginning
    db.logs.unshift(newLog);

    // Keep last 100 logs
    if (db.logs.length > 100) {
        db.logs = db.logs.slice(0, 100);
    }
    writeDb(db);
}

export function getHistoricalStats(hours: number = 24)
{
    const db = readDb();
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const rawStats = db.stats.filter(s => s.timestamp > cutoff);

    // Aggregate by hour
    const hourlyMap = new Map<string, { totalNodes: number, onlineNodes: number, score: number, count: number, timestamp: number }>();

    rawStats.forEach(stat =>
    {
        const date = new Date(stat.timestamp);
        // Key by YYYY-MM-DD-HH
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;

        if (!hourlyMap.has(key)) {
            hourlyMap.set(key, {
                totalNodes: 0,
                onlineNodes: 0,
                score: 0,
                count: 0,
                timestamp: stat.timestamp // Keep first timestamp of the hour for sorting/display
            });
        }

        const entry = hourlyMap.get(key)!;
        entry.totalNodes += stat.totalNodes;
        entry.onlineNodes += stat.onlineNodes;
        entry.score += stat.score;
        entry.count += 1;
    });

    const aggregated = Array.from(hourlyMap.values()).map(entry => ({
        timestamp: entry.timestamp,
        totalNodes: Math.round(entry.totalNodes / entry.count),
        onlineNodes: Math.round(entry.onlineNodes / entry.count),
        score: Math.round(entry.score / entry.count) // Average score
    })).sort((a, b) => a.timestamp - b.timestamp);

    // If we have very few points (e.g. just started), might want to return raw or finer grain, 
    // but for now let's adhere to "Hourly" requirement. 
    // Actually, if we have less than 2 hours of data, hourly might look empty. 
    // Let's fallback to raw if aggregated is too small (< 2) AND raw has data.
    if (aggregated.length < 2 && rawStats.length > 0) {
        return rawStats;
    }

    return aggregated;
}

export function getActivities(limit: number = 50)
{
    const db = readDb();
    return db.logs.slice(0, limit);
}

// Background poller with global singleton pattern for HMR safety
const globalForStats = global as unknown as {
    statsPoller: NodeJS.Timeout | null;
    lastNodesMap: Map<string, PNode> | null;
};


export function startPolling(intervalMs: number = 60000) // Default 60s
{
    if (globalForStats.statsPoller) {
        return;
    }

    console.log(`Starting network stats poller with interval ${intervalMs}ms...`);

    // Initial run
    runTask();

    globalForStats.statsPoller = setInterval(runTask, intervalMs);
    (globalForStats.statsPoller as any).unref();
}

async function runTask()
{
    console.log(`[${new Date().toISOString()}] Running network stats task...`);
    try {
        // 1. Get current state
        const nodes = await getPNodes();
        const summary = await getNetworkSummary();

        console.log(`Stats fetched: ${nodes.length} nodes, ${summary.onlinePercent}% online`);

        // 2. Save Stats
        const onlineCount = Math.round((summary.onlinePercent / 100) * summary.totalNodes);
        saveNetworkStats(summary.totalNodes, onlineCount, summary.compositeScore ?? Math.round(summary.onlinePercent));

        // 3. Detect Changes & Log Activity
        const currentMap = new Map(nodes.map(n => [n.id, n]));
        const prevMap = globalForStats.lastNodesMap || new Map();

        // Skip logging on very first run after restart to avoid spamming "new node"
        if (globalForStats.lastNodesMap) {

            const newJoins: string[] = [];
            const disconnections: string[] = [];
            const statusChanges: { id: string, status: string }[] = [];

            // Check joins and status changes
            nodes.forEach(node =>
            {
                if (!prevMap.has(node.id)) {
                    newJoins.push(node.id);
                } else {
                    const prev = prevMap.get(node.id)!;
                    if (prev.status !== node.status) {
                        statusChanges.push({ id: node.id, status: node.status });
                    }
                }
            });

            // Check drops
            prevMap.forEach((_, id) =>
            {
                if (!currentMap.has(id)) {
                    disconnections.push(id);
                }
            });

            // LOGGING LOGIC
            // Joins
            if (newJoins.length > 3) {
                saveActivity({
                    type: 'success',
                    msg: `${newJoins.length} new pNodes joined the network`
                });
            } else {
                newJoins.forEach(id =>
                {
                    saveActivity({
                        type: 'success',
                        msg: 'New pNode joined the network',
                        nodeId: id
                    });
                });
            }

            // Status Changes
            if (statusChanges.length > 3) {
                const onlineCount = statusChanges.filter(s => s.status === 'Online').length;
                saveActivity({
                    type: 'info',
                    msg: `Bulk status update: ${onlineCount} Online`
                });
            } else {
                statusChanges.forEach(change =>
                {
                    saveActivity({
                        type: change.status === 'Online' ? 'success' : 'warning',
                        msg: `Node status changed to ${change.status} `,
                        nodeId: change.id
                    });
                });
            }

            // Disconnections
            if (disconnections.length > 3) {
                saveActivity({
                    type: 'error',
                    msg: `${disconnections.length} pNodes disconnected`
                });
            } else {
                disconnections.forEach(id =>
                {
                    saveActivity({
                        type: 'error',
                        msg: 'pNode disconnected from network',
                        nodeId: id
                    });
                });
            }
        } else {
            // Optional: Log startup
            // saveActivity({ type: 'info', msg: `Monitoring started.Tracking ${ nodes.length } nodes.` });
        }

        // Update cache
        globalForStats.lastNodesMap = currentMap;

    } catch (error) {
        console.error("Failed to poll network stats:", error);
    }
}
