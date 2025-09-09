import { auth } from "@/features/auth/lib/auth";
import { routes } from "@/utils/config";
import { NextResponse } from "next/server";

const authenticatedRoutes = [routes.dashboard, routes.settings];

export default auth((request) => {
  const requiresAuth = authenticatedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!request.auth && requiresAuth) {
    return NextResponse.redirect(new URL(routes.homepage, request.url));
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
