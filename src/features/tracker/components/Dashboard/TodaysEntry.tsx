import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import { Edit3, PlusCircle } from "lucide-react";
import { getColor } from "../../utils/helpers";
import Link from "next/link";
import { routes } from "@/utils/config";
import { getTodaysMood } from "../../lib/database";
import ErrorMessage from "@/components/ErrorMessage";
import { Skeleton } from "@/components/shadcn/skeleton";
import { getMoodFromValenceArousal } from "../../utils/MoodInsight-utils";

const TodaysEntry = async () => {
  const { entry: todaysEntry, error } = await getTodaysMood();

  let content: React.ReactNode;

  if (error) {
    content = <ErrorMessage error={error} />;
  } else if (!todaysEntry) {
    content = (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          You have not submitted your mood today.
        </p>
        <Button variant="outline" className="gap-2" asChild>
          <Link href={routes.moodEntry}>
            <PlusCircle className="h-4 w-4" />
            Wanna submit?
          </Link>
        </Button>
      </div>
    );
  } else {
    const valence = todaysEntry.valence;
    const arousal = todaysEntry.arousal;
    content = (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border"
            style={{
              backgroundColor: getColor(valence, arousal),
            }}
          />
          <div>
            <p className="font-medium">
              You were {getMoodFromValenceArousal(valence, arousal)} today.
            </p>
            {todaysEntry.note && (
              <p className="text-sm text-muted-foreground">
                {todaysEntry.note}
              </p>
            )}
          </div>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href={routes.moodEntry + "?edit=true"}>
            <Edit3 className="h-4 w-4" />
            Wanna change it?
          </Link>
        </Button>
      </div>
    );
  }

  return <>{content}</>;
};

export const TodaysEntryWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Today’s Mood</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export const TodaysEntrySkeleton = () => (
  <div className="space-y-4 w-full">
    <div className="h-6 w-34">
      <Skeleton className="h-full w-full" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
    <Skeleton className="h-9 w-40 rounded-md" />
  </div>
);

export default TodaysEntry;
