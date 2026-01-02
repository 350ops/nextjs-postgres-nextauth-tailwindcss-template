import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { computeEstimate } from "@/lib/estimate/engine";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const inputs = await req.json();

        const catalog = await prisma.catalogItem.findMany();
        const estimate = computeEstimate(inputs, catalog);

        // optionally persist
        const project = await prisma.project.create({
            data: {
                title: inputs.title ?? "New Estimate",
                city: inputs.city ?? "São Paulo",
                state: inputs.state ?? "SP",
                inputs,
                estimate,
                total: estimate.total,
            },
        });

        return NextResponse.json({ projectId: project.id, estimate });
    } catch (error) {
        console.error("Estimate error:", error);
        return NextResponse.json({ error: "Failed to create estimate" }, { status: 500 });
    }
}
