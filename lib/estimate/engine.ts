type CatalogItem = {
    name: string;
    category: string;
    unit: string;
    basePrice: number;
    minPrice?: number | null;
    maxPrice?: number | null;
};

export function computeEstimate(inputs: any, catalog: CatalogItem[]) {
    // inputs example:
    // { rooms: [{type:"kitchen", areaM2:12, flooring:"Porcelain tile", paint:true, ...}] }

    const lines: any[] = [];
    let total = 0;

    for (const room of inputs.rooms ?? []) {
        const area = Number(room.areaM2 ?? 0);

        if (room.flooring) {
            const mat = catalog.find(i => i.category === "flooring" && i.name.includes("(material)") && room.flooring.toLowerCase().includes("porcelain"));
            const lab = catalog.find(i => i.category === "flooring" && i.name.includes("(labor)"));
            // simple fallback if specific match fails but generic flooring labor exists
            const genericLab = catalog.find(i => i.category === "flooring" && i.name.includes("labor"));

            const materialItem = mat;
            const laborItem = lab || genericLab;

            if (materialItem) {
                const cost = area * materialItem.basePrice;
                lines.push({ room: room.type, item: materialItem.name, qty: area, unit: "m2", unitPrice: materialItem.basePrice, subtotal: cost });
                total += cost;
            }
            if (laborItem) {
                const cost = area * laborItem.basePrice;
                lines.push({ room: room.type, item: laborItem.name, qty: area, unit: "m2", unitPrice: laborItem.basePrice, subtotal: cost });
                total += cost;
            }
        }

        if (room.paint) {
            const pmat = catalog.find(i => i.category === "paint" && i.name.includes("(material)"));
            const plab = catalog.find(i => i.category === "paint" && i.name.includes("labor"));
            // rough: paintable wall area = 3x floor area (MVP heuristic)
            const paintArea = area * 3;

            if (pmat) {
                const cost = paintArea * pmat.basePrice;
                lines.push({ room: room.type, item: pmat.name, qty: paintArea, unit: "m2", unitPrice: pmat.basePrice, subtotal: cost });
                total += cost;
            }
            if (plab) {
                const cost = paintArea * plab.basePrice;
                lines.push({ room: room.type, item: plab.name, qty: paintArea, unit: "m2", unitPrice: plab.basePrice, subtotal: cost });
                total += cost;
            }
        }
    }

    return {
        currency: "BRL",
        total,
        lines,
        byCategory: lines.reduce((acc, l) => {
            acc[l.item] = (acc[l.item] ?? 0) + l.subtotal;
            return acc;
        }, {} as Record<string, number>),
    };
}
