import { NextRequest, NextResponse } from 'next/server';
import { backend } from '@/lib/api';

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams

        const { data } = await backend.get("/moments", {
            params: {
                coin: searchParams.get('coin'),
                user: searchParams.get('user')
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

export async function POST(req: NextRequest) {
    try {
        const { title, userAddress, imageUrl } = await req.json()

        const { data } = await backend.post("/moments/create", {
            title,
            userAddress,
            imageUrl
        })
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}
