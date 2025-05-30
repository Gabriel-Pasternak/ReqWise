import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilePlus, Edit3, Trash2 } from "lucide-react";
import type { Requirement } from "@/lib/types"; // Assuming you have this type

// Mock data - replace with actual data fetching
const mockRequirements: Requirement[] = [
  {
    id: "REQ-001",
    title: "User Authentication System",
    description: "System must allow users to register and log in.",
    priority: "High",
    riskLevel: "Medium",
    owner: "Alice Wonderland",
    status: "Approved",
    tags: ["auth", "security", "phase-1"],
    versions: [{ versionNumber: 1, description: "Initial draft", author: "Alice", timestamp: new Date().toISOString(), changes: "Created" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "REQ-002",
    title: "CSV/Excel Import Functionality",
    description: "Users should be able to import requirements in bulk via CSV or Excel files.",
    priority: "Medium",
    riskLevel: "Low",
    owner: "Bob The Builder",
    status: "In Review",
    tags: ["import", "bulk-ops", "phase-1"],
    versions: [{ versionNumber: 1, description: "Initial draft", author: "Bob", timestamp: new Date().toISOString(), changes: "Created" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
    {
    id: "REQ-003",
    title: "Custom Fields Configuration",
    description: "Admins must be able to define custom attributes for requirements.",
    priority: "High",
    riskLevel: "Medium",
    owner: "Carol Danvers",
    status: "Draft",
    tags: ["customization", "admin", "phase-2"],
    versions: [{ versionNumber: 1, description: "Initial draft", author: "Carol", timestamp: new Date().toISOString(), changes: "Created" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export default function RequirementsPage() {
  const requirements = mockRequirements; // In a real app, fetch this data

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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.id}</TableCell>
                    <TableCell>{req.title}</TableCell>
                    <TableCell><Badge variant={req.status === 'Approved' ? 'default' : req.status === 'In Review' ? 'secondary' : 'outline'}>{req.status}</Badge></TableCell>
                    <TableCell>{req.priority}</TableCell>
                    <TableCell>{req.owner}</TableCell>
                    <TableCell className="space-x-2">
                       <Button variant="outline" size="icon" asChild disabled>
                        <Link href={`/requirements/${req.id}`} title="View/Edit">
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="icon" title="Delete" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
