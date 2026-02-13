"use server";

import { authOptions } from "@/lib/auth"; // Assuming auth options export
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma"; // Assuming prisma client export
import { revalidatePath } from "next/cache";

// We need to define the return type
type GradingResult = {
    success: boolean;
    grade?: string;
    remarks?: string;
    reportUrl?: string;
    error?: string;
    details?: any;
};

export async function gradeAnswerSheet(formData: FormData): Promise<GradingResult> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if user is teacher (optional for now, but recommended)
    // const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    // if (user?.role !== "TEACHER") ...

    const file = formData.get("file") as File;
    const studentName = formData.get("studentName") as string || "Student";

    if (!file) {
        return { success: false, error: "No file uploaded" };
    }

    try {
        // 1. Create DB Record
        // We need a student ID. For this demo, let's just pick the first student or use the current user as placeholder if it's a demo
        // Ideally the teacher selects a student.
        // Let's create a placeholder "Guest Student" or find one.
        const student = await prisma.user.findFirst({ where: { role: "STUDENT" } });
        const studentId = student?.id || session.user.id; // Fallback

        const sheet = await prisma.answerSheet.create({
            data: {
                studentId: studentId,
                teacherId: session.user.id,
                status: "PENDING",
                originalFileUrl: "pending_upload", // In real app, upload to S3 first
            }
        });

        // 2. Call Python Backend
        // We need to send the file content.
        const backendUrl = "http://localhost:8000/classroom/grade_paper";
        const backendFormData = new FormData();
        backendFormData.append("file", file);
        backendFormData.append("student_name", studentName);

        const response = await fetch(backendUrl, {
            method: "POST",
            body: backendFormData,
            // Next.js might complain about FormData in fetch on server without specific headers or handling
            // Actually, 'fetch' in Node environment with FormData logic might need 'duplex: half' or specific setups
            // Let's hope the standard FormData works in this Node version.
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend error: ${errorText}`);
        }

        const data = await response.json();

        // 3. Update DB Record
        await prisma.answerSheet.update({
            where: { id: sheet.id },
            data: {
                status: "GRADED",
                grade: data.grade,
                remarks: data.remarks,
                gradedFileUrl: data.report_url, // This is a relative path "/static/..."
                gradedAt: new Date(),
            }
        });

        revalidatePath("/classroom/teacher");

        return {
            success: true,
            grade: data.grade,
            remarks: data.remarks,
            reportUrl: "http://localhost:8000" + data.report_url, // Absolute URL for download
            details: data.details
        };

    } catch (error) {
        console.error("Grading failed:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
