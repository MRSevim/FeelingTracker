import GoogleSignIn from "@/features/auth/components/googleSignIn";
import { auth } from "@/features/auth/lib/auth";
import MoodSelector from "@/features/tracker/components/MoodSelector/MoodSelector";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex-1 flex flex-col justify-center mb-30 items-center">
      {!user ? <GoogleSignIn /> : <MoodSelector />}
    </div>
  );
}
