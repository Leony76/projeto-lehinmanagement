import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const origin = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : request.nextUrl.origin;

  const sessionResponse = await fetch(
    `${origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const session = await sessionResponse.json();

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/orders/:path*",
  ],
};