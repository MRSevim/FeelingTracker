import Container from "@/components/Container";
import Dashboard from "@/features/tracker/components/Dashboard/Dashboard";
import { DashboardSearchParams } from "@/features/tracker/utils/types";

export default function Page({ searchParams }: DashboardSearchParams) {
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <Dashboard searchParams={searchParams} />
    </Container>
  );
}
