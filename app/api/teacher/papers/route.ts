import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST — Save question paper metadata after backend extraction
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { classroomId, title, fileUrl, extractedText, markScheme, totalMarks } = await request.json();

        if (!classroomId || !title || !fileUrl) {
            return NextResponse.json({ message: "classroomId, title, and fileUrl required" }, { status: 400 });
        }

        const paper = await prisma.questionPaper.create({
            data: {
                classroomId,
                title,
                fileUrl,
                extractedText: extractedText || null,
                markScheme: markScheme || null,
                totalMarks: totalMarks || 0,
            },
        });

        return NextResponse.json(paper, { status: 201 });
    } catch (error) {
        console.error("Save question paper error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
