import Container from "@/components/Container";
import { Button } from "@/components/shadcn/button";
import { routes } from "@/utils/config";
import Link from "next/link";

export default async function Home() {
  return (
    <Container className="flex-1 w-full gap-5 flex flex-col justify-center items-center sm:flex-row mb-30 mt-10 sm:mt-0">
      {/* Left side content */}
      <div className="flex flex-col items-center gap-6 shrink sm:flex-1 ">
        <h2 className="text-2xl font-semibold text-gray-800">
          Track your day to day mood
        </h2>
        <Button
          asChild
          className="py-6 px-10 text-lg rounded-xl transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Link href={routes.signIn}>Start Tracking</Link>
        </Button>
      </div>

      {/* Right side video */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-foreground border-2 shrink h-auto sm:flex-2">
        <video
          src="/MoodTracker.webm"
          autoPlay
          loop
          muted
          controls
          playsInline
          className="w-full rounded-2xl"
        />
      </div>
    </Container>
  );
}
