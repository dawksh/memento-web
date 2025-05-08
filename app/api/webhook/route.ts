import { NextResponse } from "next/server";
import { backend } from "@/lib/api";
import { NextRequest } from "next/server";
import {
    ParseWebhookEvent,
    parseWebhookEvent,
    verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const data = await parseWebhookEvent(body, verifyAppKeyWithNeynar);
        const { event, fid } = data;
        switch (event.event) {
            case "frame_added":
                if (event.notificationDetails) {
                    await backend.post("/webhook", { fid, details: event.notificationDetails });
                } else {
                    await backend.post("/webhook", { fid, details: null });
                }

                break;
            case "frame_removed":
                await backend.post("/webhook", { fid, details: null });

                break;
            case "notifications_enabled":
                await backend.post("/webhook", { fid, details: event.notificationDetails });


                break;
            case "notifications_disabled":
                await backend.post("/webhook", { fid, details: null });

                break;
        }
    } catch (e: unknown) {
        const error = e as ParseWebhookEvent.ErrorType;
        switch (error.name) {
            case "VerifyJsonFarcasterSignature.InvalidDataError":
                console.error("Invalid data", { error })
                break;
            case "VerifyJsonFarcasterSignature.InvalidEventDataError":
                console.error("Invalid event data", { error })
                break;
            case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
                console.error("Invalid app key", { error })
                break;
            case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
                console.error("Verify app key error", { error })
                break;
        }
    }
    await backend.post("/webhook", body);
    return NextResponse.json({ message: "Webhook received" });
}