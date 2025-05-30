import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";

const chartData = [
  { milestone: "Alpha Release", draft: 5, inReview: 2, approved: 10, implemented: 8 },
  { milestone: "Beta Release", draft: 2, inReview: 3, approved: 15, implemented: 10 },
  { milestone: "GA Release", draft: 1, inReview: 1, approved: 20, implemented: 18 },
];

const chartConfig = {
  draft: { label: "Draft", color: "hsl(var(--chart-1))" },
  inReview: { label: "In Review", color: "hsl(var(--chart-2))" },
  approved: { label: "Approved", color: "hsl(var(--chart-3))" },
  implemented: { label: "Implemented", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;


export function StatusDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requirement Status Dashboard</CardTitle>
        <CardDescription>Real-time heatmap showing requirement completion vs. project milestones.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="milestone" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="draft" fill="var(--color-draft)" radius={4} />
              <Bar dataKey="inReview" fill="var(--color-inReview)" radius={4} />
              <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
              <Bar dataKey="implemented" fill="var(--color-implemented)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          This is a placeholder for the heatmap visualization. Actual heatmap implementation will require more detailed data and potentially a different chart type or custom SVG rendering.
        </p>
      </CardContent>
    </Card>
  );
}
