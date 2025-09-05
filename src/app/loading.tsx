import Container from "@/components/Container";
import { Spinner } from "@/components/shadcn/shadcn-io/spinner";

export default function Loading() {
  return (
    <Container>
      <Spinner size={50} className="mt-30" />
    </Container>
  );
}
