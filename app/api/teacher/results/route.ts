import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST — Save graded result after backend AI grading
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { questionPaperId, studentId, fileUrl, grading } = await request.json();

        if (!questionPaperId || !studentId || !fileUrl || !grading) {
            return NextResponse.json({ message: "All fields required" }, { status: 400 });
        }

        // Create answer sheet
        const answerSheet = await prisma.answerSheet.create({
            data: {
                questionPaperId,
                studentId,
                fileUrl,
            },
        });

        // Create graded result
        const gradedResult = await prisma.gradedResult.create({
            data: {
                answerSheetId: answerSheet.id,
                totalScore: grading.total_scored || 0,
                maxScore: grading.total_max || 0,
                percentage: grading.percentage || 0,
                questionsJson: JSON.stringify(grading.questions || []),
                overallRemarks: grading.overall_remarks || null,
            },
        });

        return NextResponse.json({ answerSheet, gradedResult }, { status: 201 });
    } catch (error) {
        console.error("Save graded result error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
