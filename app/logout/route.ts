import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("session", "", { expires: new Date(0), path: "/" });
  return response;
}

export async function POST(request: NextRequest) {
  return GET(request);
}
