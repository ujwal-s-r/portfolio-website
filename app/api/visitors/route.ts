import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { trackVisitor, getUniqueVisitorCount } from "@/backend";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "vid";
const FIVE_YEARS_IN_SECONDS = 5 * 365 * 24 * 60 * 60;

export async function GET() {
  const count = await getUniqueVisitorCount();
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  try {
    const incomingVid = request.cookies.get(COOKIE_NAME)?.value;

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const acceptLanguage = request.headers.get("accept-language") || "";

    const fingerprint = crypto
      .createHash("sha256")
      .update(`${ip}::${userAgent}::${acceptLanguage}::ujwal_salt_2026`)
      .digest("hex");

    const { visitorId, totalCount } = await trackVisitor(incomingVid, fingerprint);

    const response = NextResponse.json({ count: totalCount });

    // Set httpOnly persistent cookie
    response.cookies.set(COOKIE_NAME, visitorId, {
      maxAge: FIVE_YEARS_IN_SECONDS,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Error in /api/visitors:", err);
    const count = await getUniqueVisitorCount();
    return NextResponse.json({ count });
  }
}
