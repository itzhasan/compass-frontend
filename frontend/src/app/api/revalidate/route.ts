import { createHmac, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { env } from "@/env";

/**
 * Cache-revalidation webhook target. Laravel POSTs { tags: [...] } with an
 * X-Signature: HMAC-SHA256(body, REVALIDATE_SECRET) header on publish/update/unpublish.
 * We verify the signature in constant time, then revalidate each tag.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("X-Signature") ?? "";

  const expected = createHmac("sha256", env.REVALIDATE_SECRET).update(body).digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let tags: unknown;
  try {
    tags = (JSON.parse(body) as { tags?: unknown }).tags;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
    return NextResponse.json({ error: "tags must be a string array" }, { status: 400 });
  }

  for (const tag of tags as string[]) {
    // Next 16 requires a cacheLife profile; "max" expires the tag immediately.
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: true, tags });
}
