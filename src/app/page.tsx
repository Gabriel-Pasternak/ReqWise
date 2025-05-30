
import { AppShell } from "@/components/AppShell";
import { StatusDashboard } from "@/components/dashboard/StatusDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePlus, ListChecks } from "lucide-react";
import Image from "next/image";
import { getRequirementsAction } from "@/lib/actions";
import type { Requirement } from "@/lib/types";

export const revalidate = 0; // Ensures the page is always dynamically rendered

export default async function DashboardPage() {
  const requirements = await getRequirementsAction();

  const totalRequirements = requirements.length;
  const approvedRequirements = requirements.filter(r => r.status === 'Approved').length;
  const inProgressRequirements = requirements.filter(r => ['Draft', 'In Review'].includes(r.status)).length;

  const recentActivity = requirements
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5); // Show up to 5 recent items

  return (
    <AppShell>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Welcome to ReqWise!</CardTitle>
            <CardDescription>
              Streamline your requirement capture and management process with AI-powered insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ReqWise helps you define, track, and manage project requirements efficiently.
              Use the navigation on the left to get started.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/requirements/new"><FilePlus className="mr-2 h-4 w-4" /> Add New Requirement</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/requirements"><ListChecks className="mr-2 h-4 w-4" /> View Requirements</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Overview of your project requirements.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm">
                <div className="flex justify-between"><span>Total Requirements:</span> <span className="font-semibold">{totalRequirements}</span></div>
                <div className="flex justify-between"><span>Approved:</span> <span className="font-semibold">{approvedRequirements}</span></div>
                <div className="flex justify-between"><span>In Progress:</span> <span className="font-semibold">{inProgressRequirements}</span></div>
            </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <StatusDashboard requirements={requirements} />
      </div>

      <div className="mt-6 grid gap-6"> {/* md:grid-cols-2 removed here */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and additions to your requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <ul className="space-y-2">
                {recentActivity.map(req => (
                  <li key={req.id} className="text-sm">
                    <Link href={`/requirements/${req.id}`} className="hover:underline text-primary">
                      {req.title}
                    </Link>
                    <span className="text-xs text-muted-foreground ml-2">
                      (ID: {req.id}, Updated: {new Date(req.updatedAt).toLocaleDateString()})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            )}
          </CardContent>
        </Card>
        {/* Feature Spotlight Card has been removed */}
      </div>
    </AppShell>
  );
}
