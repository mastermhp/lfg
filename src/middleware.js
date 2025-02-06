import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/admin']);

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin routes to specific email addresses
  if (isProtectedRoute(req)) {
    await auth.protect((user) => {
      if (user?.primaryEmailAddress?.emailAddress !== "parashmehedihasan@gmail.com") {
        // Send a 403 Forbidden response if the user is not the admin
        return new Response('Forbidden', { status: 403 });
      }
    });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
