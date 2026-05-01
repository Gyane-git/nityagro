import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// CREATE user
export async function POST(req: Request) {
  const body = await req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
    },
  });

  return NextResponse.json(user);
}