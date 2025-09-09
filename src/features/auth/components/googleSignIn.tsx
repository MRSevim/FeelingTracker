import { Button } from "@/components/shadcn/button";
import { signIn } from "../lib/auth";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button
        type="submit"
        variant="outline"
        size="lg"
        className="w-full flex items-center justify-center gap-2 rounded-xl shadow-sm hover:shadow-md transition-all"
      >
        <FcGoogle className="w-5 h-5" />
        <span className="font-medium">Sign in with Google</span>
      </Button>
    </form>
  );
}
