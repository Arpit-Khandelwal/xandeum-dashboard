import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'network_stats.json');

// Interface for our DB schema
export interface DbSchema
{
    stats: {
        timestamp: number;
        totalNodes: number;
        onlineNodes: number;
        score: number;
    }[];
    logs: {
        id: string;
        type: 'success' | 'warning' | 'error' | 'info';
        msg: string;
        time: number;
        nodeId?: string;
    }[];
}

const IS_KV_ENABLED = !!process.env.KV_REST_API_URL;

export async function readDb(): Promise<DbSchema>
{
    if (IS_KV_ENABLED) {
        try {
            const data = await kv.get<DbSchema>('network_stats');
            return data || { stats: [], logs: [] };
        } catch (error) {
            console.error('Failed to read from Vercel KV:', error);
            return { stats: [], logs: [] };
        }
    } else {
        // Fallback to local FS
        try {
            if (!fs.existsSync(DB_PATH)) {
                return { stats: [], logs: [] };
            }
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to read local DB:', e);
            return { stats: [], logs: [] };
        }
    }
}

export async function writeDb(data: DbSchema): Promise<void>
{
    if (IS_KV_ENABLED) {
        try {
            await kv.set('network_stats', data);
        } catch (error) {
            console.error('Failed to write to Vercel KV:', error);
        }
    } else {
        // Fallback to local FS
        try {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        } catch (e) {
            console.error('Failed to write local DB:', e);
        }
    }
}
