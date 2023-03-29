import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log("bbbb");
  return NextResponse.redirect(new URL("/about-2", request.url));
}
