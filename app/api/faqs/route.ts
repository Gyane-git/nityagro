import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const VALID_SECTIONS = new Set([
  "products-quality",
  "orders-payment",
  "shipping-delivery",
  "returns-refunds",
  "health-usage",
]);

function toSortNumber(value: unknown, fallback = 0) {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? Math.max(0, Math.trunc(num)) : fallback;
}

function normalizeSection(value: unknown) {
  const section = String(value || "products-quality").trim();
  return VALID_SECTIONS.has(section) ? section : "products-quality";
}

function serializeFaq(item: any) {
  return {
    faqsId: item.faqsId.toString(),
    id: item.faqsId.toString(),
    question: item.question,
    answer: item.answer || "",
    faqSection: item.faqSection || "products-quality",
    showOnHome: Boolean(item.showOnHome),
    sortOrder: Number(item.sortOrder || 0),
    faqStatus: Boolean(item.faqStatus),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");
    const activeOnly = searchParams.get("activeOnly") === "true";
    const homeOnly = searchParams.get("homeOnly") === "true";
    const limit = Number(searchParams.get("limit") || 0);

    const conditions: string[] = [];
    const values: any[] = [];

    if (section && section !== "all") {
      conditions.push("faqSection = ?");
      values.push(normalizeSection(section));
    }
    if (activeOnly) {
      conditions.push("faqStatus = ?");
      values.push(true);
    }
    if (homeOnly) {
      conditions.push("faqStatus = ?");
      values.push(true);
      conditions.push("showOnHome = ?");
      values.push(true);
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const limitSql = limit > 0 ? " LIMIT ?" : "";
    if (limit > 0) values.push(limit);

    const faqs = await prisma.$queryRawUnsafe(
      `SELECT faqsId, question, answer, faqSection, showOnHome, sortOrder, faqStatus, createdAt, updatedAt
       FROM faqs
       ${whereSql}
       ORDER BY sortOrder ASC, createdAt DESC${limitSql}`,
      ...values,
    );

    return NextResponse.json(
      { success: true, data: Array.isArray(faqs) ? faqs.map(serializeFaq) : [] },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch FAQs",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = String(body?.question || "").trim();
    const answer = String(body?.answer || "").trim();

    if (question.length < 3) {
      return NextResponse.json(
        { success: false, message: "Question must be at least 3 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (answer.length < 3) {
      return NextResponse.json(
        { success: false, message: "Answer must be at least 3 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    await prisma.$executeRaw`
      INSERT INTO faqs
        (question, answer, faqSection, showOnHome, sortOrder, faqStatus, createdAt, updatedAt)
      VALUES
        (${question}, ${answer}, ${normalizeSection(body?.faqSection)}, ${Boolean(body?.showOnHome)}, ${toSortNumber(body?.sortOrder)}, ${body?.faqStatus === undefined ? true : Boolean(body.faqStatus)}, NOW(3), NOW(3))
    `;
    const rows = await prisma.$queryRaw`
      SELECT faqsId, question, answer, faqSection, showOnHome, sortOrder, faqStatus, createdAt, updatedAt
      FROM faqs
      WHERE faqsId = LAST_INSERT_ID()
      LIMIT 1
    `;
    const created = Array.isArray(rows) ? rows[0] : null;

    return NextResponse.json(
      {
        success: true,
        message: "FAQ added successfully",
        data: serializeFaq(created),
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add FAQ",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
