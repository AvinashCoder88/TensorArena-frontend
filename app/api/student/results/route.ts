import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — Student's own graded results across all subjects
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const results = await prisma.answerSheet.findMany({
            where: { studentId: session.user.id },
            include: {
                gradedResult: true,
                questionPaper: {
                    include: {
                        classroom: {
                            include: {
                                subject: true,
                                division: { include: { grade: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Group by subject
        const grouped: Record<string, unknown[]> = {};
        for (const sheet of results) {
            const subjectName = sheet.questionPaper.classroom.subject.name;
            if (!grouped[subjectName]) grouped[subjectName] = [];
            grouped[subjectName].push({
                id: sheet.id,
                examTitle: sheet.questionPaper.title,
                grade: sheet.questionPaper.classroom.division.grade.name,
                division: sheet.questionPaper.classroom.division.name,
                fileUrl: sheet.fileUrl,
                gradedResult: sheet.gradedResult,
                createdAt: sheet.createdAt,
            });
        }

        return NextResponse.json(grouped);
    } catch (error) {
        console.error("Fetch student results error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
