import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const month = process.env.CUB_MONTH || "2025-12";
    const region = "SP";
    const cubR8N = Number(process.env.CUB_R8N || "2123.87"); // from Sinduscon-SP page/month

    await prisma.priceSource.create({
        data: {
            kind: "CUB",
            region,
            refMonth: month,
            raw: { cubR8N },
        },
    });

    console.log(`Saved CUB baseline ${month} ${region}: R8-N = ${cubR8N}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
