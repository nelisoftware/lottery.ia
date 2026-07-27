import { auth } from "@/libraries/auth/auth";
import { Route } from "@/libraries/routes";
import { NextResponse } from "next/server";

const ADMIN_ONLY_PATHS = [Route.link.users];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = Boolean(session?.user);
  const isApproved = Boolean(session?.user?.approved);
  const isAdmin = Boolean(session?.user?.isAdmin);

  const isAuthPage = nextUrl.pathname === Route.link.login;
  const isPendingPage = nextUrl.pathname === Route.link.pending;

  if (isAuthPage) {
    if (isLoggedIn && isApproved) {
      return NextResponse.redirect(new URL(Route.link.home, nextUrl));
    }
    return NextResponse.next();
  }

  if (isPendingPage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(Route.link.login, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(Route.link.login, nextUrl));
  }

  if (!isApproved) {
    return NextResponse.redirect(new URL(Route.link.pending, nextUrl));
  }

  if (!isAdmin && ADMIN_ONLY_PATHS.some((path) => nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL(Route.link.home, nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
