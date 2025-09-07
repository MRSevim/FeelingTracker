import Container from "@/components/Container";
import GoogleSignIn from "@/features/auth/components/googleSignIn";
import { auth } from "@/features/auth/lib/auth";
import MoodSelectorWrapper from "@/features/tracker/components/MoodSelector/MoodSelectorWrapper";
import { routes } from "@/utils/config";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const user = session?.user;
  const { edit } = await searchParams;
  const editing = edit === "true";
  if (!edit && user) {
    redirect(routes.dashboard);
  }
  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      {!user ? (
        <GoogleSignIn />
      ) : (
        <MoodSelectorWrapper editing={editing && !!user} />
      )}
    </Container>
  );
}
