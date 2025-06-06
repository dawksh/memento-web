import { NextRequest } from "next/server";

import { backend } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const { data } = await backend.get("/user/has-posted", {
            params: {
                address: searchParams.get('address')
            }
        })
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch last posted' },
            { status: 500 }
        );
    }
}