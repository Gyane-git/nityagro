import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const VALID_SECTIONS = new Set([
  "products-quality",
  "orders-payment",
  "shipping-delivery",
  "returns-refunds",
  "health-usage",
]);

function normalizeSection(value: unknown) {
  const section = String(value || "products-quality").trim();
  return VALID_SECTIONS.has(section) ? section : "products-quality";
}

function toSortNumber(value: unknown, fallback = 0) {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? Math.max(0, Math.trunc(num)) : fallback;
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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await prisma.$queryRaw`
      SELECT faqsId, question, answer, faqSection, showOnHome, sortOrder, faqStatus, createdAt, updatedAt
      FROM faqs
      WHERE faqsId = ${BigInt(id)}
      LIMIT 1
    `;
    const faq = Array.isArray(rows) ? rows[0] : null;
    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404, headers: corsHeaders },
      );
    }
    return NextResponse.json(
      { success: true, data: serializeFaq(faq) },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch FAQ",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
      UPDATE faqs
      SET
        question = ${question},
        answer = ${answer},
        faqSection = ${normalizeSection(body?.faqSection)},
        showOnHome = ${Boolean(body?.showOnHome)},
        sortOrder = ${toSortNumber(body?.sortOrder)},
        faqStatus = ${Boolean(body?.faqStatus)},
        updatedAt = NOW(3)
      WHERE faqsId = ${BigInt(id)}
    `;
    const rows = await prisma.$queryRaw`
      SELECT faqsId, question, answer, faqSection, showOnHome, sortOrder, faqStatus, createdAt, updatedAt
      FROM faqs
      WHERE faqsId = ${BigInt(id)}
      LIMIT 1
    `;
    const updated = Array.isArray(rows) ? rows[0] : null;

    return NextResponse.json(
      {
        success: true,
        message: "FAQ updated successfully",
        data: serializeFaq(updated),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update FAQ",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.$executeRaw`DELETE FROM faqs WHERE faqsId = ${BigInt(id)}`;
    return NextResponse.json(
      { success: true, message: "FAQ deleted successfully" },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete FAQ",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
