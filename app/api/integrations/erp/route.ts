import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mockStudents, mockTeachers } from "@/lib/mockErpData";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const INTEGRATION_KIND = "ERP";

// Placeholder ERP integration endpoint.
// This will be wired to a real SIS/ERP provider (OneRoster/LTI/OAuth).
export async function GET() {
    const existing = await prisma.integrationSetting.findUnique({
        where: { kind: INTEGRATION_KIND },
    });

    if (!existing || existing.status !== "configured") {
        return NextResponse.json({
            status: "not_configured",
            message: "ERP integration is not configured. Using local database.",
        });
    }

    return NextResponse.json({
        status: "configured",
        provider: existing.provider,
        tenant: existing.tenant,
    });
}

export async function POST(req: Request) {
    const existing = await prisma.integrationSetting.findUnique({
        where: { kind: INTEGRATION_KIND },
    });

    let body: any = {};
    try {
        body = await req.json();
    } catch (e) { }

    if (!existing || existing.status !== "configured") {
        try {
            const hashedPassword = await bcrypt.hash("password123", 10);
            const allUsers = [...mockTeachers, ...mockStudents];

            // Insert or update all mock users
            for (const u of allUsers) {
                await prisma.user.upsert({
                    where: { email: u.email },
                    update: { role: u.role as Role, name: u.name, password: hashedPassword },
                    create: { name: u.name, email: u.email, role: u.role as Role, password: hashedPassword }
                });
            }

            // Enroll the students if a divisionId is provided
            if (body.divisionId) {
                for (const student of mockStudents) {
                    const dbStudent = await prisma.user.findUnique({ where: { email: student.email } });
                    if (dbStudent) {
                        await prisma.studentEnrollment.upsert({
                            where: {
                                studentId_divisionId: {
                                    studentId: dbStudent.id,
                                    divisionId: body.divisionId
                                }
                            },
                            update: {},
                            create: {
                                studentId: dbStudent.id,
                                divisionId: body.divisionId
                            }
                        });
                    }
                }
            }

            return NextResponse.json({
                status: "using_local_db",
                message: `Mock ERP Sync Complete: added ${mockTeachers.length} teachers and enrolled ${mockStudents.length} students.`,
            });
        } catch (err) {
            console.error("Local mock ERP sync failed:", err);
            return NextResponse.json({
                status: "using_local_db",
                message: "No ERP configured. Using local database for now (Sync failed).",
            });
        }
    }

    return NextResponse.json({
        status: "queued",
        message: "ERP sync placeholder. External sync will be wired later.",
        provider: existing.provider,
    });
}
