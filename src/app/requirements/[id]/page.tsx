import { AppShell } from "@/components/AppShell";
import { VersionTreeDisplay } from "@/components/requirements/VersionTreeDisplay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getRequirementByIdAction } from "@/lib/actions"; // Mock action
import type { Requirement } from "@/lib/types";
import { ArrowLeft, Edit, Trash2, CalendarDays, User, Tag, ShieldCheck, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// This is a Server Component
export default async function RequirementDetailPage({ params }: { params: { id: string } }) {
  // In a real app, fetch the requirement data based on params.id
  // For now, using a mock or assuming it comes from a source
  const requirement: Requirement | undefined = await getRequirementByIdAction(params.id);

  if (!requirement) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full">
          <Image src="https://placehold.co/300x300.png" alt="Not Found" width={300} height={300} data-ai-hint="error document" className="mb-4 rounded-lg"/>
          <h1 className="text-2xl font-bold">Requirement Not Found</h1>
          <p className="text-muted-foreground">The requirement with ID "{params.id}" could not be found.</p>
          <Button asChild className="mt-4">
            <Link href="/requirements"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Requirements</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/requirements"><ArrowLeft className="mr-2 h-4 w-4"/> Back to List</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" disabled><Edit className="mr-2 h-4 w-4"/> Edit</Button>
          <Button variant="destructive" disabled><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{requirement.title}</CardTitle>
                  <CardDescription>ID: {requirement.id}</CardDescription>
                </div>
                <Badge variant={requirement.status === 'Approved' ? 'default' : 'secondary'}>{requirement.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">{requirement.description}</p>
              
              {requirement.customFields && Object.keys(requirement.customFields).length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-md font-semibold mb-2">Additional Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(requirement.customFields).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className="text-muted-foreground">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <Separator className="my-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div><span className="font-medium">Priority:</span> {requirement.priority}</div>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div><span className="font-medium">Risk Level:</span> {requirement.riskLevel}</div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div><span className="font-medium">Owner:</span> {requirement.owner}</div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div><span className="font-medium">Created:</span> {new Date(requirement.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <div><span className="font-medium">Updated:</span> {new Date(requirement.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>

              {requirement.tags && requirement.tags.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-start gap-2">
                    <Tag className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {requirement.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {(requirement.dependencies && requirement.dependencies.length > 0 || requirement.affectedDocs && requirement.affectedDocs.length > 0) && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-md font-semibold mb-2">Traceability</h3>
                  {requirement.dependencies && requirement.dependencies.length > 0 && (
                    <div className="mb-2">
                      <span className="font-medium text-sm">Dependencies:</span>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {requirement.dependencies.map(dep => <li key={dep}>{dep}</li>)}
                      </ul>
                    </div>
                  )}
                  {requirement.affectedDocs && requirement.affectedDocs.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Affected Documents/Test Cases:</span>
                       <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {requirement.affectedDocs.map(doc => <li key={doc}>{doc}</li>)}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Impact analysis showing affected test cases/docs will be automated here.</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <VersionTreeDisplay versions={requirement.versions} />
        </div>
      </div>
    </AppShell>
  );
}
