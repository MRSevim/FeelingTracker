import Link from "next/link";

import Container from "../Container";
import { Suspense } from "react";
import UserMenu from "./UserMenu";
import { Skeleton } from "../shadcn/skeleton";
import { routes } from "@/utils/config";

export default function Header() {
  return (
    <header className="border-b">
      <Container>
        <div className="flex flex-col p-4 items-center justify-between sm:flex-row">
          {/* Left */}
          <div className="text-2xl font-bold mb-2 sm:mb-0">
            <Link href={routes.homepage} className="cursor-pointer">
              MoodTracker
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <Link
              href={routes.about}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>

            <Suspense fallback={<UserMenuSkeleton />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </Container>
    </header>
  );
}

export const UserMenuSkeleton = () => {
  return (
    <div>
      {/* Avatar-style skeleton */}
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>
  );
};
