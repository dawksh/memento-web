import { backend } from "@/lib/api";
import { Moment } from "@/types/moment";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ImageResponse } from "@vercel/og";
import React from "react";

export const runtime = "edge";

const getMediaLink = (link: string) =>
    link.startsWith("ipfs://")
        ? link.replace("ipfs://", "https://ipfs.io/ipfs/")
        : link;

const MOMNT_LOGO = `${process.env.NEXT_PUBLIC_URL ||
    "http://" + (process.env.VERCEL_URL || "localhost:3000")
    }/momnt.png`;

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const { data } = await backend.get<Moment[]>("/moments", {
            params: {
                coin: searchParams.get("coin"),
            },
        });

        if (data && data[0] && data[0].assetURL) {
            const imageUrl = getMediaLink(data[0].assetURL);
            return new ImageResponse(
                React.createElement(
                    "div",
                    {
                        style: {
                            width: "1600px",
                            height: "800px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#f4f4f4",
                            position: "relative",
                        },
                    },
                    // Card container
                    React.createElement(
                        "div",
                        {
                            style: {
                                width: "1200px",
                                height: "600px",
                                borderRadius: "32px",
                                boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
                                background: "#fff",
                                position: "relative",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            },
                        },
                        // Blurred background
                        React.createElement("div", {
                            style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundImage: `url(${imageUrl})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "repeat",
                                display: "flex",
                                filter: "blur(18px)",
                                opacity: 0.5,
                                zIndex: 0,
                                maskImage:
                                    "radial-gradient(circle at center, black 60%, transparent 100%)",
                                WebkitMaskImage:
                                    "radial-gradient(circle at center, black 60%, transparent 100%)",
                            },
                        }),
                        // Main image
                        React.createElement("img", {
                            src: imageUrl,
                            width: 800,
                            height: 400,
                            style: {
                                objectFit: "contain",
                                borderRadius: "24px",
                                boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                position: "relative",
                                zIndex: 1,
                                background: "rgba(255,255,255,0.02)",
                            },
                            alt: "OG Image",
                        }),
                        // Logo
                        React.createElement("img", {
                            src: MOMNT_LOGO,
                            width: 120,
                            height: 120,
                            style: {
                                position: "absolute",
                                right: 40,
                                bottom: 40,
                                zIndex: 2,
                                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                                background: "rgba(255,255,255,0.85)",
                                padding: 8,
                            },
                            alt: "Momnt Logo",
                        })
                    )
                ),
                {
                    width: 1600,
                    height: 800,
                }
            );
        }
        return NextResponse.json({ error: "No image found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
