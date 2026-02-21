import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — List teacher's classrooms with grade/division/subject info
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const classrooms = await prisma.classroom.findMany({
            where: { teacherId: session.user.id },
            include: {
                division: {
                    include: { grade: true },
                },
                subject: true,
                questionPapers: {
                    include: {
                        answerSheets: {
                            include: { gradedResult: true, student: { select: { id: true, name: true, email: true } } },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(classrooms);
    } catch (error) {
        console.error("Fetch classrooms error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST — Create a new classroom
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { gradeName, divisionName, subjectName } = await request.json();

        if (!gradeName || !divisionName || !subjectName) {
            return NextResponse.json({ message: "Grade, division, and subject are required" }, { status: 400 });
        }

        // Upsert grade
        const grade = await prisma.grade.upsert({
            where: { name: gradeName },
            update: {},
            create: { name: gradeName },
        });

        // Upsert division
        const division = await prisma.division.upsert({
            where: { gradeId_name: { gradeId: grade.id, name: divisionName } },
            update: {},
            create: { name: divisionName, gradeId: grade.id },
        });

        // Upsert subject
        const subject = await prisma.subject.upsert({
            where: { name: subjectName },
            update: {},
            create: { name: subjectName },
        });

        // Create classroom (unique: teacher + division + subject)
        const classroom = await prisma.classroom.create({
            data: {
                teacherId: session.user.id,
                divisionId: division.id,
                subjectId: subject.id,
            },
        });

        return NextResponse.json(classroom, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
            return NextResponse.json({ message: "Classroom already exists" }, { status: 400 });
        }
        console.error("Create classroom error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
