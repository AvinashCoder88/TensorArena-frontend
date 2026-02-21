import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — List children linked to the parent
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const links = await prisma.parentChild.findMany({
            where: { parentId: session.user.id },
            include: {
                child: { select: { id: true, name: true, email: true, image: true } },
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json(links.map((l: any) => l.child));
    } catch (error) {
        console.error("Fetch children error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST — Link a child to a parent (by email)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { childEmail } = await request.json();

        if (!childEmail) {
            return NextResponse.json({ message: "childEmail required" }, { status: 400 });
        }

        const child = await prisma.user.findUnique({ where: { email: childEmail } });

        if (!child) {
            return NextResponse.json({ message: "Student account not found" }, { status: 404 });
        }

        await prisma.parentChild.create({
            data: { parentId: session.user.id, childId: child.id },
        });

        return NextResponse.json({ message: "Child linked successfully", child }, { status: 201 });
    } catch (error: unknown) {
        if (error && typeof error === "object" && "code" in error && (error as { code: string }).code === "P2002") {
            return NextResponse.json({ message: "Child already linked" }, { status: 400 });
        }
        console.error("Link child error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
