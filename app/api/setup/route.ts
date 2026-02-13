import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const teacherEmail = 'teacher@tensorarena.com';
        const teacherPassword = 'teacher_password_123';
        const studentEmail = 'student@tensorarena.com';
        const studentPassword = 'student_password_123';

        const hashedPasswordTeacher = await bcrypt.hash(teacherPassword, 10);
        const hashedPasswordStudent = await bcrypt.hash(studentPassword, 10);

        // Upsert Teacher
        await prisma.user.upsert({
            where: { email: teacherEmail },
            update: {
                role: 'TEACHER',
                password: hashedPasswordTeacher
            },
            create: {
                email: teacherEmail,
                name: 'Mr. Anderson',
                password: hashedPasswordTeacher,
                role: 'TEACHER',
            },
        });

        // Upsert Student
        await prisma.user.upsert({
            where: { email: studentEmail },
            update: {
                role: 'STUDENT',
                password: hashedPasswordStudent
            },
            create: {
                email: studentEmail,
                name: 'Neo',
                password: hashedPasswordStudent,
                role: 'STUDENT',
            },
        });

        return NextResponse.json({
            success: true,
            message: "Credentials generated successfully",
            teacher: { email: teacherEmail, password: teacherPassword },
            student: { email: studentEmail, password: studentPassword }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
