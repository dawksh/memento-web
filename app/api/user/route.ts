import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        console.log(searchParams.get("address"))
        const { data } = await backend.get("/user", {
            params: {
                address: searchParams.get('address')
            }
        })
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}
