import { getMoodEntriesByDays } from "@/features/tracker/lib/database";
import Chart from "./Chart";
import ErrorMessage from "@/components/ErrorMessage";
import { getUserLocale } from "@/features/tracker/utils/helpers";
import { headers } from "next/headers";

const ChartWrapper = async () => {
  const { data, error } = await getMoodEntriesByDays(90);

  if (!data || error) {
    return <ErrorMessage error={error} />;
  }
  const locale = await getUserLocale(headers);

  return <Chart data={data} locale={locale} />;
};

export default ChartWrapper;
