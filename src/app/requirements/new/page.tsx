import { AppShell } from "@/components/AppShell";
import { RequirementForm } from "@/components/requirements/RequirementForm";

export default function NewRequirementPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Requirement</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new requirement.
        </p>
      </div>
      <RequirementForm />
    </AppShell>
  );
}
