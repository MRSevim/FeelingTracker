"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { AddMood } from "@/features/tracker/utils/types";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface LineChartProps {
  data: { name: string; value?: AddMood }[];
  title?: string;
  primaryColor?: string;
  secondaryColor?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  type: string;
  showGrid?: boolean;
}

export const LineChart = ({
  data,
  title,
  primaryColor = "var(--primary)",
  secondaryColor = "var(--secondary)",
  xAxisKey = "name",
  yAxisKey = "value",
  height = 250,
  showGrid = true,
}: LineChartProps) => {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-2">
        <ResponsiveContainer width="100%" height={height}>
          <ReLineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke={secondaryColor} />
            )}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
