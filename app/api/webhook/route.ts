import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
    ParseWebhookEvent,
    parseWebhookEvent,
    verifyAppKeyWithNeynar,
} from "@farcaster/frame-node";
import { deleteUserNotificationDetails } from "@/lib/redis";
import { setUserNotificationDetails } from "@/lib/redis";
import { sendFrameNotification } from "@/lib/frame";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const data = await parseWebhookEvent(body, verifyAppKeyWithNeynar);
        const { event, fid } = data;
        switch (event.event) {
            case "frame_added":
                if (event.notificationDetails) {
                    await setUserNotificationDetails(fid.toString(), event.notificationDetails);
                    await sendFrameNotification(fid.toString(), [event.notificationDetails.token], "knock knock, is this thing working?", "welcome to momnt");
                } else {
                    await deleteUserNotificationDetails(fid.toString());
                }

                break;
            case "frame_removed":
                await deleteUserNotificationDetails(fid.toString());

                break;
            case "notifications_enabled":
                await setUserNotificationDetails(fid.toString(), event.notificationDetails);


                break;
            case "notifications_disabled":
                await deleteUserNotificationDetails(fid.toString());

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
    return NextResponse.json({ message: "Webhook received" });
}