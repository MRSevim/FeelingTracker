import { Button } from "@/components/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import Link from "next/link";
import { auth, signOut } from "@/features/auth/lib/auth";
import { routes } from "@/utils/config";

const UserMenu = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} alt="User" />
                <AvatarFallback>U</AvatarFallback>
                <span className="sr-only">Profile image</span>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-center">
            <DropdownMenuLabel>Welcome {user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.dashboard}>Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.settings}>Settings </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button
                onClick={async () => {
                  "use server";
                  await signOut();
                }}
              >
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={routes.signIn}>
          <Button variant="default" size="sm">
            Sign in
          </Button>
        </Link>
      )}
    </>
  );
};

export default UserMenu;
