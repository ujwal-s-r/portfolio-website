import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { recordVisitor, getUniqueVisitorCount } from "@/backend";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getUniqueVisitorCount();
  return NextResponse.json({ count });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";
    const acceptLanguage = request.headers.get("accept-language") || "";

    const raw = `${ip}::${userAgent}::${acceptLanguage}::ujwal_secret_visitor_salt_2026`;
    const deviceHash = crypto.createHash("sha256").update(raw).digest("hex");

    const count = await recordVisitor(deviceHash);
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Error in visitors endpoint:", err);
    const count = await getUniqueVisitorCount();
    return NextResponse.json({ count });
  }
}
