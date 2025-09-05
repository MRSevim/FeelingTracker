import Link from "next/link";

import Container from "../Container";
import { Suspense } from "react";
import UserMenu from "./UserMenu";
import { Skeleton } from "../shadcn/skeleton";

export default function Header() {
  return (
    <header className="border-b">
      <Container>
        <div className=" flex h-16 items-center justify-between ">
          {/* Left */}
          <div className="text-2xl font-bold">FeelingTracker</div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <Link
              href="/about"
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
