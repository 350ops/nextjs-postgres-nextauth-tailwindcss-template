import EstimateWizard from "@/components/EstimateWizard";

export default function NewProjectPage() {
    return (
        <div className="flex flex-col gap-8 p-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
                <p className="text-muted-foreground">
                    Create a renovation estimate by defining your rooms and finishes.
                </p>
            </div>
            <EstimateWizard />
        </div>
    );
}
