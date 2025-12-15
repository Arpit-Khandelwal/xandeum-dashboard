import { NextResponse } from "next/server";
import { getPNodes } from "@/lib/prpcClient";

export async function GET() {
  try {
    const nodes = await getPNodes();
    return NextResponse.json(nodes);
  } catch (error) {
    console.error("Error fetching pNodes:", error);
    return NextResponse.json({ error: "Failed to fetch pNodes" }, { status: 500 });
  }
}
