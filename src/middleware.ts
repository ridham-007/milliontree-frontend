"use server"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import {
  ResponseCookies,
  RequestCookies,
} from "next/dist/server/web/spec-extension/cookies";
import { cookies } from "next/headers";

const checkTokenExpiry = (token: any) => {
  try {
    const decoded: any = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return { valid: false, message: "Invalid token" };
    }

    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return { valid: false, message: "Token has expired" };
    }

    return { valid: true, message: "Token is valid" };
  } catch (error) {
    return { valid: false, message: "Error decoding token" };
  }
};

function applySetCookie(req: NextRequest, res: NextResponse): void {
  const setCookies = new ResponseCookies(res.headers);
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function middleware(request: NextRequest) {
  
  const pathname = request.nextUrl.pathname;
  const baseUrl = request.nextUrl.origin;
  const res = NextResponse.next();
  res.cookies.set("curr_path", pathname);
  const token = cookies().get("access_token");
  const response = checkTokenExpiry(token?.value);
  if (response.valid) {
    if (pathname?.includes("login") || pathname?.includes("signup")) {
      const res = NextResponse.redirect(`${baseUrl}/`);
      applySetCookie(request, res);
      return res;
    } else {
      applySetCookie(request, res);
      return res;
    }
  } else {
    if (pathname?.includes("login")) {
        // cookies().set("access_token", "");
        // cookies().set("userId", "");
      NextResponse.redirect(new URL(`${baseUrl}/login`))
      return res;
    }
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|/assets/|_next/image|favicon.ico).*)"],
};