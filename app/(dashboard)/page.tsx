import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Renovai MVP</h1>
      <p className="text-muted-foreground">Start by creating a new cost estimate.</p>
      <Link href="/projects/new">
        <Button>Create New Estimate</Button>
      </Link>
    </div>
  );
}
