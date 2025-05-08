import { NextResponse } from "next/server";
import { backend } from "@/lib/api";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    console.log(body);
    await backend.post("/webhook", body);
    return NextResponse.json({ message: "Webhook received" });
}