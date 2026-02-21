import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();
        const { fullName, email, phone, subjects, qualifications, experience, bio, linkedinUrl } = body;

        if (!fullName || !email || !subjects?.length || !qualifications || !experience) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // If logged in, use session user ID; otherwise create account first
        let userId: string;

        if (session?.user?.id) {
            userId = session.user.id;

            // Check if already applied
            const existing = await prisma.tutorApplication.findUnique({
                where: { userId },
            });
            if (existing) {
                return NextResponse.json(
                    { message: "You have already submitted a tutor application" },
                    { status: 400 }
                );
            }

            // Update user role to TUTOR
            await prisma.user.update({
                where: { id: userId },
                data: { role: "TUTOR" },
            });
        } else {
            // Must be logged in to apply
            return NextResponse.json(
                { message: "You must be logged in to apply as a tutor. Please sign up first." },
                { status: 401 }
            );
        }

        // Create tutor application
        const application = await prisma.tutorApplication.create({
            data: {
                userId,
                fullName,
                email,
                phone: phone || null,
                subjects,
                qualifications,
                experience,
                bio: bio || null,
                linkedinUrl: linkedinUrl || null,
                status: "PENDING",
            },
        });

        return NextResponse.json(
            { message: "Application submitted successfully", applicationId: application.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Tutor application error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
