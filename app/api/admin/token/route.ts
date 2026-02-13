import { NextResponse } from "next/server"

import { ADMIN_TOKEN_TTL_MS, generateAdminToken } from "@/lib/adminAuth"

type TokenRequest = {
    key?: string
}

export async function POST(request: Request) {
    const adminKey = process.env.ADMIN_MASTER_KEY

    if (!adminKey) {
        return NextResponse.json(
            { message: "ADMIN_MASTER_KEY is not configured on the server" },
            { status: 500 },
        )
    }

    let body: TokenRequest
    try {
        body = await request.json()
    } catch {
        return NextResponse.json(
            { message: "Invalid JSON body" },
            { status: 400 },
        )
    }

    if (body.key !== adminKey) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
        )
    }

    const { token, expiresAt } = generateAdminToken()

    return NextResponse.json({
        token,
        expiresAt,
        expiresAtIso: new Date(expiresAt).toISOString(),
        ttlMinutes: ADMIN_TOKEN_TTL_MS / 60000,
    })
}
