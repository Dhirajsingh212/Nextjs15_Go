import { NextRequest, NextResponse } from "next/server";
import { BACEND_URL } from "./lib/config";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Cookie: `token=${token.value}` } : {}),
  };
  const response = await fetch(`${BACEND_URL}/verify`, {
    method: "GET",
    headers,
    credentials: "include",
  });

  if (response.status !== 200) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home"],
};
