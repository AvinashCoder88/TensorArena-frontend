import { NextResponse } from "next/server"

import { verifyAdminToken } from "@/lib/adminAuth"
import prisma from "@/lib/prisma"

const ADMIN_TOKEN_HEADER = "x-admin-token"

export async function GET(request: Request) {
    const headerToken = request.headers.get(ADMIN_TOKEN_HEADER)
    const bearerToken = request.headers
        .get("authorization")
        ?.match(/^Bearer\s+(.+)$/i)?.[1]

    let tokenIsValid = false
    try {
        tokenIsValid = Boolean(verifyAdminToken(headerToken ?? bearerToken ?? null))
    } catch (error) {
        console.error("Admin token verification failed", error)
        return NextResponse.json(
            { message: "Server configuration error" },
            { status: 500 },
        )
    }

    if (!tokenIsValid) {
        return NextResponse.json(
            { message: "Invalid or expired admin token" },
            { status: 401 },
        )
    }

    const [users, questions] = await Promise.all([
        prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isSubscribed: true,
                questionsUsed: true,
                freeQuestionLimit: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.question.findMany({
            select: {
                id: true,
                title: true,
                topic: true,
                difficulty: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
    ])

    return NextResponse.json({ users, questions })
}
