import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function POST() {
    const existing = await prisma.integrationSetting.findUnique({
        where: { kind: INTEGRATION_KIND },
    });

    if (!existing || existing.status !== "configured") {
        return NextResponse.json({
            status: "using_local_db",
            message: "No ERP configured. Using local database for now.",
        });
    }

    return NextResponse.json({
        status: "queued",
        message: "ERP sync placeholder. External sync will be wired later.",
        provider: existing.provider,
    });
}
