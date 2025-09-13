import { getMoodEntriesByDaysAgo } from "@/features/tracker/lib/database";
import { LineChart } from "./LineChart";
import ErrorMessage from "@/components/ErrorMessage";

const LineChartsWrapper = async () => {
  const { data, error } = await getMoodEntriesByDaysAgo(7);

  if (!data || error) {
    return <ErrorMessage error={error} />;
  }
  console.log(data);
  return <LineChart data={data} type="arousal" title="Last 7 Days Mood" />;
};

export default LineChartsWrapper;
