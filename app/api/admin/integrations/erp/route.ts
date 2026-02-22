import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const INTEGRATION_KIND = "ERP";

export async function GET() {
    const existing = await prisma.integrationSetting.findUnique({
        where: { kind: INTEGRATION_KIND },
    });

    if (!existing) {
        return NextResponse.json({ status: "not_configured" });
    }

    return NextResponse.json({
        status: existing.status,
        provider: existing.provider,
        tenant: existing.tenant,
        clientId: existing.clientId,
        clientSecret: existing.clientSecret ? "********" : "",
    });
}

export async function POST(request: Request) {
    const { provider, tenant, clientId, clientSecret, status } = await request.json();

    if (!provider || !tenant || !clientId || !clientSecret) {
        return NextResponse.json(
            { message: "provider, tenant, clientId, and clientSecret are required" },
            { status: 400 },
        );
    }

    const setting = await prisma.integrationSetting.upsert({
        where: { kind: INTEGRATION_KIND },
        update: {
            provider,
            tenant,
            clientId,
            clientSecret,
            status: status || "configured",
        },
        create: {
            kind: INTEGRATION_KIND,
            provider,
            tenant,
            clientId,
            clientSecret,
            status: status || "configured",
        },
    });

    return NextResponse.json({ status: setting.status });
}
