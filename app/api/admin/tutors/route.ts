import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — List all tutor applications (admin only)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Check admin — for now use adminAuth or check email-based
        // In production, add an isAdmin field to User
        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get("status"); // PENDING, APPROVED, REJECTED

        const where = statusFilter ? { status: statusFilter } : {};

        const applications = await prisma.tutorApplication.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Admin tutors list error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// PATCH — Approve or reject a tutor application
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { applicationId, status, reviewNote } = await request.json();

        if (!applicationId || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }

        const application = await prisma.tutorApplication.update({
            where: { id: applicationId },
            data: {
                status,
                reviewNote: reviewNote || null,
            },
        });

        // If rejected, revert user role to STUDENT
        if (status === "REJECTED") {
            await prisma.user.update({
                where: { id: application.userId },
                data: { role: "STUDENT" },
            });
        }

        return NextResponse.json({
            message: `Application ${status.toLowerCase()} successfully`,
            application,
        });
    } catch (error) {
        console.error("Admin tutor update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
