import Container from "@/components/Container";
import { Button } from "@/components/shadcn/button";
import { routes } from "@/utils/config";
import Link from "next/link";

export default async function Home() {
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <Button asChild className="mb-30">
        <Link href={routes.signIn}>Try it out</Link>
      </Button>
    </Container>
  );
}
