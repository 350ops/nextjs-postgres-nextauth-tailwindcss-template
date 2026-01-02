"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import CostBreakdownTable from "./CostBreakdownTable";

type RoomInput = {
    id: string;
    type: string;
    areaM2: number;
    flooring: string;
    paint: boolean;
};

export default function EstimateWizard() {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<RoomInput[]>([
        { id: "1", type: "Kitchen", areaM2: 10, flooring: "Porcelain tile", paint: true },
    ]);
    const [estimate, setEstimate] = useState<any>(null);

    const addRoom = () => {
        setRooms([
            ...rooms,
            { id: Math.random().toString(), type: "Bedroom", areaM2: 12, flooring: "Laminate", paint: true },
        ]);
    };

    const removeRoom = (id: string) => {
        setRooms(rooms.filter((r) => r.id !== id));
    };

    const updateRoom = (id: string, field: keyof RoomInput, value: any) => {
        setRooms(
            rooms.map((r) => {
                if (r.id === id) {
                    return { ...r, [field]: value };
                }
                return r;
            })
        );
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/estimate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "My Renovation",
                    city: "São Paulo",
                    state: "SP",
                    rooms,
                }),
            });
            const data = await res.json();
            setEstimate(data.estimate);
        } catch (error) {
            console.error(error);
            alert("Failed to calculate estimate");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>
                        Add rooms and specify their details to get an instant cost estimate.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rooms.map((room, index) => (
                        <div key={room.id} className="grid sm:grid-cols-12 gap-4 items-end border p-4 rounded-lg bg-slate-50 relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeRoom(room.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>

                            <div className="sm:col-span-3">
                                <label className="text-sm font-medium">Room Name</label>
                                <Input
                                    value={room.type}
                                    onChange={(e) => updateRoom(room.id, "type", e.target.value)}
                                    placeholder="e.g. Master Bedroom"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="text-sm font-medium">Area (m²)</label>
                                <Input
                                    type="number"
                                    value={room.areaM2}
                                    onChange={(e) => updateRoom(room.id, "areaM2", Number(e.target.value))}
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="text-sm font-medium">Flooring</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={room.flooring}
                                    onChange={(e) => updateRoom(room.id, "flooring", e.target.value)}
                                >
                                    <option value="">None</option>
                                    <option value="Porcelain tile">Porcelain Tile</option>
                                    <option value="Laminate">Laminate</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2 flex items-center h-10 pb-2">
                                <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={room.paint}
                                        onChange={(e) => updateRoom(room.id, "paint", e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span>Paint Walls</span>
                                </label>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" onClick={addRoom} className="w-full border-dashed">
                        <Plus className="mr-2 h-4 w-4" /> Add Room
                    </Button>

                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleCalculate} disabled={loading} size="lg">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Calculating..." : "Calculate Estimate"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {estimate && <CostBreakdownTable estimate={estimate} />}
        </div>
    );
}
