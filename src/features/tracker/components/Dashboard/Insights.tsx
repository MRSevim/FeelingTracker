import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/shadcn/card";
import { CheckCircle } from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import { getInsightsByDays } from "../../lib/database";
import { Skeleton } from "@/components/shadcn/skeleton";

const Insights = async () => {
  const { insights, error, insufficientData } = await getInsightsByDays();

  if (!insights || error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <CardContent>
      {insufficientData ? (
        <div className="flex flex-col items-center justify-center gap-2 p-6 text-center border rounded-lg bg-muted/30">
          <span className="text-sm text-muted-foreground">{insights[0]}</span>
        </div>
      ) : (
        <ul className="grid gap-2 grid-cols-1 xs:grid-cols-2">
          {insights.map((insight, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/10 transition"
            >
              <CheckCircle className="w-5 h-5 text-primary mt-1" />
              <span className="text-sm">{insight}</span>
            </li>
          ))}
          {insights.length === 0 && (
            <div className="w-full text-center text-sm text-muted-foreground py-4">
              No insights to display
            </div>
          )}
        </ul>
      )}
    </CardContent>
  );
};

export const InsightsWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Insights and Patterns</CardTitle>
        <CardDescription>Last 90 days</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
};

export const InsightsSkeleton = () => {
  return (
    <CardContent>
      <ul className="flex gap-2 flex-wrap">
        {Array.from({ length: 3 }).map((_, idx) => (
          <li key={idx} className="flex items-start gap-2 p-2 rounded-md">
            <Skeleton className="w-5 h-5 rounded-full mt-1" />
            <Skeleton className="h-4 w-60 rounded" />
          </li>
        ))}
      </ul>
    </CardContent>
  );
};

export default Insights;
