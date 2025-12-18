import { NextResponse } from "next/server";
import { getActivities } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET()
{
    try {
        const logs = getActivities(50);
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching activities:", error);
        return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
    }
}
