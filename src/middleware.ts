import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

// Security headers
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "geolocation=(), microphone=()",
};

// CORS config
const allowedOrigins = ["https://yourdomain.com", "http://localhost:3000"];

// Export a single middleware function for Next.js
export function middleware(req, event) {
  try {
    // Run Clerk authentication first
    const clerk = clerkMiddleware();
    const res = clerk(req, event);
    if (!(res instanceof NextResponse)) {
      // If not a NextResponse, return as-is (skip further processing)
      return res;
    }

    // Security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    // CORS headers
    const origin = req.headers.get("origin");
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
      res.headers.set("Vary", "Origin");
      res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
      res.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-CSRF-Token");
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }

    // Secure cookie flags for session cookies
    const sessionCookie = req.cookies.get("sessionToken");
    if (sessionCookie) {
      res.cookies.set("sessionToken", sessionCookie.value, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    // CSRF protection for state-changing requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const csrfToken = req.headers.get("x-csrf-token");
      const sessionCsrf = req.cookies.get("csrfToken");
      if (!csrfToken || !sessionCsrf || csrfToken !== sessionCsrf.value) {
        return NextResponse.json({ error: "CSRF token missing or invalid" }, { status: 403 });
      }
    }

    // Basic rate limiting (memory-based, per IP)
    const ip = req.headers.get("x-forwarded-for") || req.ip || "unknown";
    if (!global.rateLimitStore) global.rateLimitStore = {};
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requests per minute
    if (!global.rateLimitStore[ip]) global.rateLimitStore[ip] = [];
    // Remove old requests
    global.rateLimitStore[ip] = global.rateLimitStore[ip].filter(ts => now - ts < windowMs);
    if (global.rateLimitStore[ip].length >= maxRequests) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }
    global.rateLimitStore[ip].push(now);

    return res;
  } catch (err) {
    // Catch all errors and return a generic error response
    return NextResponse.json({ error: "Middleware error" }, { status: 500 });
  }
}

// Chain Clerk and security middleware in config
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
