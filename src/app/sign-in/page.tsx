import Container from "@/components/Container";
import SignIn from "@/features/auth/components/SignIn";

export default async function Home() {
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <SignIn />
    </Container>
  );
}
