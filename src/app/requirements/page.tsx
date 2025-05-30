
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilePlus } from "lucide-react"; // Removed Edit3, Trash2 as they are in RequirementActions
import type { Requirement } from "@/lib/types";
import { getRequirementsAction } from "@/lib/actions";
import { RequirementActions } from "@/components/requirements/RequirementActions";

export const revalidate = 0; // Ensures the page is always dynamically rendered

export default async function RequirementsPage() {
  const requirements = await getRequirementsAction();

  return (
    <AppShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Requirements</h1>
          <p className="text-muted-foreground">Manage and track all project requirements.</p>
        </div>
        <Button asChild>
          <Link href="/requirements/new">
            <FilePlus className="mr-2 h-4 w-4" /> Add New Requirement
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requirement List</CardTitle>
          <CardDescription>A list of all current requirements in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {requirements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      <Link href={`/requirements/${req.id}`} className="hover:underline">
                        {req.id}
                      </Link>
                    </TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell><Badge variant={req.status === 'Approved' ? 'default' : req.status === 'In Review' ? 'secondary' : 'outline'}>{req.status}</Badge></TableCell>
                    <TableCell>{req.priority}</TableCell>
                    <TableCell>{req.owner}</TableCell>
                    <TableCell className="text-right">
                      <RequirementActions requirementId={req.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No requirements found. Get started by adding a new one!</p>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
