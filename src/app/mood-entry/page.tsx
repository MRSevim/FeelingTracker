import Container from "@/components/Container";
import { auth } from "@/features/auth/lib/auth";
import MoodSelector from "@/features/tracker/components/MoodSelector/MoodSelector";
import { getTodaysMood } from "@/features/tracker/lib/database";
import { routes } from "@/utils/config";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await auth();
  const user = session?.user;
  const { edit } = await searchParams;
  let editedEntry;
  const editing = edit === "true";

  if (user) {
    const { entry, error } = await getTodaysMood();
    if (entry && !editing) {
      redirect(routes.dashboard);
    }
    if (editing) {
      if (!entry || error) {
        throw error || "Could not get today's mood";
      }
      editedEntry = {
        valence: entry.valence,
        arousal: entry.arousal,
        note: entry.note || undefined,
      };
    }
  }

  return (
    <Container className="flex-1 flex flex-col justify-center items-center">
      <MoodSelector editedEntry={editedEntry} />
    </Container>
  );
}
