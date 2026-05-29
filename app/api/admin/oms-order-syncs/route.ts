import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { retryOmsOrderSync } from "@/lib/omsOrderSync";
import { requireAdminRole } from "@/lib/auth";

const serialize = (data: unknown) =>
  JSON.parse(JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value)));

export async function GET(req: Request) {
  try {
    await requireAdminRole();
    const { searchParams } = new URL(req.url);
    const status = String(searchParams.get("status") || "FAILED").toUpperCase();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 20)));

    const where = status === "ALL" ? {} : { status };
    const [rows, total, failedCount] = await Promise.all([
      prisma.omsOrderSyncLog.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.omsOrderSyncLog.count({ where }),
      prisma.omsOrderSyncLog.count({ where: { status: "FAILED" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: serialize(rows),
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)), failedCount },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load OMS sync logs";
    return NextResponse.json({ success: false, message }, { status: message === "FORBIDDEN" || message === "UNAUTHORIZED" ? 401 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdminRole();
    const body = await req.json();
    const id = Number(body?.id || body?.omsOrderSyncLogId || 0);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ success: false, message: "Valid OMS sync log id is required" }, { status: 400 });
    }

    const updated = await retryOmsOrderSync(id, prisma);
    return NextResponse.json({
      success: true,
      message: updated.status === "SUCCESS" ? "OMS order posted successfully" : "OMS retry failed and was logged",
      data: serialize(updated),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to retry OMS sync";
    return NextResponse.json({ success: false, message }, { status: message === "FORBIDDEN" || message === "UNAUTHORIZED" ? 401 : 500 });
  }
}
