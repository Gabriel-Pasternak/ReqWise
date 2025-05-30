import { AppShell } from "@/components/AppShell";
import { StatusDashboard } from "@/components/dashboard/StatusDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FilePlus, ListChecks } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
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
                <div className="flex justify-between"><span>Total Requirements:</span> <span className="font-semibold">0</span></div>
                <div className="flex justify-between"><span>Approved:</span> <span className="font-semibold">0</span></div>
                <div className="flex justify-between"><span>In Progress:</span> <span className="font-semibold">0</span></div>
            </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <StatusDashboard />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and additions to your requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity to display.</p>
            {/* Placeholder for recent activity list */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature Spotlight: Context Tagging</CardTitle>
            <CardDescription>Let AI help you organize requirements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Image src="https://placehold.co/600x300.png" alt="AI Tagging illustration" width={600} height={300} className="rounded-md object-cover" data-ai-hint="artificial intelligence network" />
            <p className="text-sm">
              Our NLP-powered context tagging automatically suggests relevant tags for project phase, module, and regulatory standards as you type your requirements.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
