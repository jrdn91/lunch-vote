import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      console.log("beep 1");
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // create user in DB
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: "POST",
      body: JSON.stringify({
        id: auth.userId as string,
        name: auth.user?.emailAddresses?.[0].emailAddress || "",
      }),
    })
      .then(() => {
        return NextResponse.next();
      })
      .catch((err) => {
        console.log(err);
        console.log("beep 3");
        return redirectToSignIn({ returnBackUrl: req.url });
      });
  },
  publicRoutes: ["/:locale/sign-in", "/:locale/sign-up"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
