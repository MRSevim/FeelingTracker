import Container from "@/components/Container";
import { Spinner } from "@/components/shadcn/shadcn-io/spinner";

export default function Loading() {
  return (
    <Container className="mt-20">
      <Spinner size={50} />
    </Container>
  );
}
