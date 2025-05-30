import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RequirementVersion } from "@/lib/types";
import { GitCommit, User, CalendarDays } from "lucide-react";

interface VersionTreeDisplayProps {
  versions: RequirementVersion[];
}

export function VersionTreeDisplay({ versions }: VersionTreeDisplayProps) {
  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No version history available for this requirement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
        <CardDescription>Track changes and evolution of this requirement.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Vertical line for the tree */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {versions.sort((a,b) => b.versionNumber - a.versionNumber).map((version, index) => (
            <div key={version.versionNumber} className="mb-6 relative">
              <div className="absolute -left-[23px] top-1.5 h-4 w-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                <GitCommit className="h-2 w-2 text-primary-foreground" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-md">Version {version.versionNumber}</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-2">{version.changes}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{version.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    <span>{new Date(version.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                 {index < versions.length -1 && <p className="text-xs text-primary mt-1 cursor-pointer hover:underline">Compare with Version {version.versionNumber -1}</p> }
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Visual tree and diff comparisons are advanced features to be implemented.
        </p>
      </CardContent>
    </Card>
  );
}
