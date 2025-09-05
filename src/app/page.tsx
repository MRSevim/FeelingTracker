import GoogleSignIn from "@/features/auth/components/googleSignIn";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-center mb-20 items-center">
      <GoogleSignIn />
    </div>
  );
}
