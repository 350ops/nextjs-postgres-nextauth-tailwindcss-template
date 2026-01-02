import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EstimateLine = {
    room: string;
    item: string;
    qty: number;
    unit: string;
    unitPrice: number;
    subtotal: number;
};

type Estimate = {
    currency: string;
    total: number;
    lines: EstimateLine[];
    byCategory: Record<string, number>;
};

export default function CostBreakdownTable({ estimate }: { estimate: Estimate }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estimate.lines.map((line, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-medium">{line.room}</TableCell>
                                    <TableCell>{line.item}</TableCell>
                                    <TableCell className="text-right">
                                        {line.qty.toFixed(2)} {line.unit}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: estimate.currency }).format(line.unitPrice)}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: estimate.currency }).format(line.subtotal)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4} className="font-bold text-right text-lg">Total</TableCell>
                                <TableCell className="font-bold text-right text-lg">
                                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: estimate.currency }).format(estimate.total)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
