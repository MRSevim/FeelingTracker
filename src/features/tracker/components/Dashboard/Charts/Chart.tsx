"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/shadcn/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Skeleton } from "@/components/shadcn/skeleton";

const chartConfig = {
  valence: {
    label: "Valence",
    color: "var(--color-primary)",
  },
  arousal: {
    label: "Arousal",
    color: "var(--color-destructive)",
  },
} satisfies ChartConfig;

const timeRanges = [7, 14, 30, 90];

const Title = () => <CardTitle>Mood Tracker</CardTitle>;

function Chart({
  data,
  locale,
}: {
  data: {
    day: Date;
    valence?: number;
    arousal?: number;
  }[];
  locale?: string;
}) {
  const [timeRange, setTimeRange] = React.useState("7");
  const filteredData = data.slice(-timeRange);

  const formatDate = (value: Date) => {
    return new Date(value).toLocaleDateString(locale);
  };
  return (
    <Card className="flex-2 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 md:flex-row">
        <div className="grid flex-1 gap-1">
          <Title />
          <CardDescription>
            Showing your valence and arousal for the last {timeRange} days
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select days ago" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {timeRanges.map((range) => {
              return (
                <SelectItem
                  key={range}
                  value={range.toString()}
                  className="rounded-lg"
                >
                  Last {range} days
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillValence" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillArousal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-destructive)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-destructive)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis
              type="number"
              domain={[-5, 5]} // set min and max
              tickCount={11} // optional: number of ticks (from -5 to 5)
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={formatDate}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="valence"
              type="monotone"
              fill="url(#fillValence)"
              stroke="var(--color-primary)"
              dot={{ r: 4 }}
            />
            <Area
              dataKey="arousal"
              type="monotone"
              fill="url(#fillArousal)"
              stroke="var(--color-destructive)"
              dot={{ r: 4 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export const ChartSkeleton = () => {
  return (
    <Card className="flex-2 w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 md:flex-row">
        <div className="grid flex-1 gap-1">
          <Title />
          <Skeleton className="h-6 w-full rounded-md" /> {/* Description */}
        </div>
        <Skeleton className="h-8 w-16 rounded-md" /> {/* Select */}
      </CardHeader>
      <CardContent>
        {/* Chart placeholder */}
        <div className="aspect-auto w-full h-[250px] rounded-md overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Legend placeholder */}
        <div className="flex gap-4 mt-2 justify-center items-center">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
