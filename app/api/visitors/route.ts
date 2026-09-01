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
    let clientId = "";
    try {
      const body = await request.json();
      if (body && typeof body.clientId === "string" && body.clientId.length > 5) {
        clientId = body.clientId;
      }
    } catch {
      // body is optional
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    // Bulletproof device deduplication using client device ID or IP+UA fallback
    const raw = clientId
      ? `client::${clientId}::ujwal_secret_visitor_salt_2026`
      : `${ip}::${userAgent}::ujwal_secret_visitor_salt_2026`;

    const deviceHash = crypto.createHash("sha256").update(raw).digest("hex");

    const count = await recordVisitor(deviceHash);
    return NextResponse.json({ count });
  } catch (err) {
    console.error("Error in visitors endpoint:", err);
    const count = await getUniqueVisitorCount();
    return NextResponse.json({ count });
  }
}
