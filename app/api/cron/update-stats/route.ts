import { NextResponse } from 'next/server';
import { updateNetworkStats } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request)
{
    try {
        await updateNetworkStats();
        return NextResponse.json({ success: true, timestamp: Date.now() });
    } catch (error) {
        console.error("Cron Update Error:", error);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}
