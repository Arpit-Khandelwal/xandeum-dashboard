import { NextResponse } from "next/server";
import { startPolling } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET()
{
    try {
        console.log("Manual polling trigger...");
        startPolling(10000); // 10s interval
        return NextResponse.json({ status: "Poller started" });
    } catch (error) {
        console.error("Manual polling failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
