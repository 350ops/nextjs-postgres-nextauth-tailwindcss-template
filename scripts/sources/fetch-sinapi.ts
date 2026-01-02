import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const month = process.env.SINAPI_MONTH || "2025-12";
    const region = process.env.SINAPI_REGION || "SP";

    // For MVP: assume you placed a cleaned CSV at data/sinapi/<month>-<region>.csv
    // We will create a dummy file if it doesn't exist for demonstration
    const dataDir = path.join(process.cwd(), "data", "sinapi");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        // create a dummy file to prevent crash if user runs it blindly
        fs.writeFileSync(path.join(dataDir, `${month}-${region}.csv`), "code,name,unit,price\n12345,Sample Item,m2,50.00");
    }

    const file = path.join(dataDir, `${month}-${region}.csv`);
    if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);

    const csv = fs.readFileSync(file, "utf8");
    const rows = csv.split("\n").slice(1).filter(Boolean);

    for (const r of rows) {
        const parts = r.split(",");
        if (parts.length < 4) continue;

        const [code, name, unit, price] = parts;

        await prisma.catalogItem.upsert({
            where: { sku: `SINAPI:${code}:${region}` },
            update: {
                name: name.trim(),
                unit: unit.trim(),
                basePrice: Number(price),
                sourceKind: "SINAPI",
                sourceRef: code,
            },
            create: {
                sku: `SINAPI:${code}:${region}`,
                name: name.trim(),
                category: "unclassified",
                unit: unit.trim(),
                basePrice: Number(price),
                sourceKind: "SINAPI",
                sourceRef: code,
            },
        });
    }

    await prisma.priceSource.create({
        data: { kind: "SINAPI", region, refMonth: month, raw: { file } },
    });

    console.log(`Imported SINAPI ${month} ${region}: ${rows.length} rows`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
