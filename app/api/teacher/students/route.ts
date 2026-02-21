import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — List students enrolled in a division (for a classroom)
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const divisionId = searchParams.get("divisionId");

        if (!divisionId) {
            return NextResponse.json({ message: "divisionId required" }, { status: 400 });
        }

        const enrollments = await prisma.studentEnrollment.findMany({
            where: { divisionId },
            include: {
                student: { select: { id: true, name: true, email: true, image: true } },
            },
        });

        return NextResponse.json(enrollments.map((e) => e.student));
    } catch (error) {
        console.error("Fetch students error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST — Enroll a student in a division (by email)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { studentEmail, divisionId } = await request.json();

        if (!studentEmail || !divisionId) {
            return NextResponse.json({ message: "studentEmail and divisionId required" }, { status: 400 });
        }

        const student = await prisma.user.findUnique({ where: { email: studentEmail } });

        if (!student) {
            return NextResponse.json({ message: "Student not found. They must sign up first." }, { status: 404 });
        }

        const enrollment = await prisma.studentEnrollment.create({
            data: { studentId: student.id, divisionId },
        });

        return NextResponse.json({ message: "Student enrolled", enrollment }, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
            return NextResponse.json({ message: "Student already enrolled in this division" }, { status: 400 });
        }
        console.error("Enroll student error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
