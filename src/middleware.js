// import { clerkMiddleware } from "@clerk/nextjs/server"

// const adminEmails = ["parashmehedihasan@gmail.com"] // Replace with your admin email

// export default clerkMiddleware({
//   publicRoutes: ["/", "/api/admin/users"],
//   afterAuth(auth, req) {
//     const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
//     const isAdminUser = auth.userId && adminEmails.includes(auth.sessionClaims?.email)

//     if (isAdminRoute && !isAdminUser) {
//       const homeUrl = new URL("/", req.url)
//       return Response.redirect(homeUrl)
//     }
//   },
// })

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// }



import { clerkMiddleware } from "@clerk/nextjs/server";

const adminEmails = ["parashmehedihasan@gmail.com"]; // Admin email

export default clerkMiddleware({
  publicRoutes: ["/", "/api/admin/users"], // Only public routes
  afterAuth(auth, req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const userEmail = auth.sessionClaims?.email;
    const isAdminUser = auth.userId && adminEmails.includes(userEmail);

    // ❌ Block access if not an admin
    if (isAdminRoute && !isAdminUser) {
      return Response.redirect(new URL("/", req.url)); // Redirect to home
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
