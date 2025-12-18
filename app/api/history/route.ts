import { NextResponse } from 'next/server';
import { getHistoricalStats, startPolling } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET()
{
    try {
        // Ensure background polling is active
        startPolling(30000);

        const stats = getHistoricalStats(24); // Last 24h
        return NextResponse.json(stats);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}
