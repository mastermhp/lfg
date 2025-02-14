import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/admin']);

const adminEmails = [
  "mehediparash0720@gmail.com",
  "minhazimran143@gmail.com",
  "minhazimran143@gmail.com"
];

export default clerkMiddleware(async (auth, req) => {
  // Restrict admin routes to specific email addresses
  if (isProtectedRoute(req)) {
    await auth.protect((user) => {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail || !adminEmails.includes(userEmail)) {
        // Send a 403 Forbidden response if the user is not the admin
        return new Response('Forbidden', { status: 403 });
      }
    });
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
