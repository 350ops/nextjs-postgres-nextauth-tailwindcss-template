import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const items = [
    { name: "Porcelain tile (material)", category: "flooring", unit: "m2", basePrice: 120, minPrice: 80, maxPrice: 220, sourceKind: "manual" },
    { name: "Tile installation (labor)", category: "flooring", unit: "m2", basePrice: 75, minPrice: 50, maxPrice: 120, sourceKind: "manual" },
    { name: "Interior paint (material)", category: "paint", unit: "m2", basePrice: 18, minPrice: 10, maxPrice: 30, sourceKind: "manual" },
    { name: "Painting labor", category: "paint", unit: "m2", basePrice: 22, minPrice: 14, maxPrice: 40, sourceKind: "manual" },
    { name: "Plumbing point (rough-in)", category: "hydraulics", unit: "un", basePrice: 450, minPrice: 300, maxPrice: 900, sourceKind: "manual" },
    // more items can be added here
  ];

  for (const item of items) {
    await prisma.catalogItem.upsert({
      where: { sku: item.name }, // cheap unique hack for seed; replace with real sku later
      update: { ...item },
      create: { ...item, sku: item.name },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
