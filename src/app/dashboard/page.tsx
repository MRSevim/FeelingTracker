import Container from "@/components/Container";
import Dashboard from "@/features/tracker/components/Dashboard/Dashboard";

export default function Page() {
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <Dashboard />
    </Container>
  );
}
