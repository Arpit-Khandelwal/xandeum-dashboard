import { NextResponse } from "next/server";
import { getStats } from "@/lib/prpcClient";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
)
{
    try {
        const stats = await getStats(params.id);
        return NextResponse.json(stats);
    } catch (error) {
        console.error(`Error fetching stats for node ${params.id}:`, error);
        return NextResponse.json(
            { error: `Failed to fetch stats for node ${params.id}` },
            { status: 500 }
        );
    }
}
