import { NextResponse } from "next/server";
import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  apiAuthPrefix,
  authRoutes,
} from "./route";


export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log(pathname);

  const accessToken = req.cookies.get('accessToken')?.value;

  // Check if it's an API authentication route (skip authentication for these routes)
  const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    console.log('Skipping API auth route');
    return NextResponse.next(); // Skip further processing for API auth routes
  };

  // Check if it's an auth route (login, register)
  const isAuthRoute = authRoutes.includes(pathname);
  const isLoggedIn = accessToken;

  if (isAuthRoute) {
    console.log('Handling auth route');
    if (isLoggedIn) {
      console.log('User is logged in, redirecting to /');
      // Avoid redirect loop if already at the login page
      if (pathname === DEFAULT_LOGIN_REDIRECT) {
        console.log('Skipping middleware for DEFAULT_LOGIN_REDIRECT');
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url)); // Redirect to homepage or dashboard
    }
    return NextResponse.next(); // Allow access to login/register if not logged in
  };

  // Check if it's a public route
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect unauthenticated users from protected routes to the login page
  if (!isLoggedIn && !isPublicRoute) {
    console.log('User is not logged in, redirecting to /auth/login');
    // Prevent redirect loop if already at the login page
    if (pathname === '/auth/login') {
      console.log('Skipping middleware for /auth/login');
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/login', req.url)); // Redirect to login page
  };

  // If everything is fine, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    '/',
  ],
};