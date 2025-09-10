import Container from "@/components/Container";
import Settings from "@/features/settings/components/Settings";

export default function Page() {
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <Settings />
    </Container>
  );
}
