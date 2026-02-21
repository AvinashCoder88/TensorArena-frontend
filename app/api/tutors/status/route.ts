import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const application = await prisma.tutorApplication.findUnique({
            where: { userId: session.user.id },
            select: {
                id: true,
                fullName: true,
                email: true,
                subjects: true,
                status: true,
                reviewNote: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!application) {
            return NextResponse.json(
                { message: "No application found" },
                { status: 404 }
            );
        }

        return NextResponse.json(application);
    } catch (error) {
        console.error("Tutor status error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
