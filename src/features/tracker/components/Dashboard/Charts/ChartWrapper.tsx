import { getMoodEntriesByDays } from "@/features/tracker/lib/database";
import Chart from "./Chart";
import ErrorMessage from "@/components/ErrorMessage";

const ChartWrapper = async () => {
  const { data, error } = await getMoodEntriesByDays();

  if (!data || error) {
    return <ErrorMessage error={error} />;
  }

  return <Chart data={data} />;
};

export default ChartWrapper;
