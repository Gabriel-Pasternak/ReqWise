
"use client";

import type { Requirement, RequirementStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

interface StatusDashboardProps {
  requirements: Requirement[];
}

const chartConfig = {
  Draft: { label: "Draft", color: "hsl(var(--chart-1))" },
  "In Review": { label: "In Review", color: "hsl(var(--chart-2))" },
  Approved: { label: "Approved", color: "hsl(var(--chart-3))" },
  Implemented: { label: "Implemented", color: "hsl(var(--chart-4))" },
  Verified: { label: "Verified", color: "hsl(var(--chart-5))" },
  Obsolete: { label: "Obsolete", color: "hsl(var(--muted))" }, // Using a muted color for Obsolete
} satisfies ChartConfig;

export function StatusDashboard({ requirements }: StatusDashboardProps) {
  const processChartData = (data: Requirement[]) => {
    const statusCounts: Record<RequirementStatus, number> = {
      Draft: 0,
      "In Review": 0,
      Approved: 0,
      Implemented: 0,
      Verified: 0,
      Obsolete: 0,
    };

    data.forEach(req => {
      if (statusCounts.hasOwnProperty(req.status)) {
        statusCounts[req.status]++;
      }
    });
    
    // For BarChart, data needs to be an array of objects.
    // We can represent this as a single "Overall" category.
    return [{ 
      milestone: "Overall Project", // Single category for all requirements
      ...statusCounts 
    }];
  };

  const chartData = processChartData(requirements);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirement Status Dashboard</CardTitle>
        <CardDescription>Overview of requirement statuses across the project.</CardDescription>
      </CardHeader>
      <CardContent>
        {requirements.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="milestone" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {Object.keys(chartConfig).map((statusKey) => (
                  <Bar 
                    key={statusKey} 
                    dataKey={statusKey} 
                    fill={`var(--color-${statusKey.replace(/\s/g, '')})`} // CSS variable friendly key
                    radius={4} 
                    stackId="a" // Stack bars if desired, or remove for grouped
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            No requirement data available to display the status dashboard. Add some requirements first!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
