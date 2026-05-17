import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s-]{7,20}$/;

function safeInquiry(row: {
  inquiryId: bigint;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string | null;
  inquiryStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    inquiryId: row.inquiryId.toString(),
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    inquiryStatus: row.inquiryStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: inquiries.map(safeInquiry),
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>;

    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const phone = String(body.phone || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();
    const inquiryStatus =
      typeof body.inquiryStatus === "boolean" ? body.inquiryStatus : true;

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (phone && !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Invalid phone number" },
        { status: 400, headers: corsHeaders },
      );
    }

    const created = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message: message || null,
        inquiryStatus,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry saved successfully",
        data: safeInquiry(created),
      },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

