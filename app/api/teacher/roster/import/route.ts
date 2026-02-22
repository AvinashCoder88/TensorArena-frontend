import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { divisionId, students } = await request.json();

        if (!divisionId || !Array.isArray(students) || students.length === 0) {
            return NextResponse.json({ message: "divisionId and students are required" }, { status: 400 });
        }

        const password = await bcrypt.hash("password123", 10);

        const results = await Promise.all(
            students.map(async (student: { name?: string; email: string }) => {
                if (!student.email) return null;
                const user = await prisma.user.upsert({
                    where: { email: student.email },
                    update: {
                        name: student.name || undefined,
                        role: "STUDENT",
                    },
                    create: {
                        email: student.email,
                        name: student.name || student.email.split("@")[0],
                        password,
                        role: "STUDENT",
                    },
                });

                await prisma.studentEnrollment.upsert({
                    where: {
                        studentId_divisionId: {
                            studentId: user.id,
                            divisionId,
                        },
                    },
                    update: {},
                    create: {
                        studentId: user.id,
                        divisionId,
                    },
                });

                return user.id;
            })
        );

        const imported = results.filter(Boolean).length;

        return NextResponse.json({ imported });
    } catch (error) {
        console.error("Roster import error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
