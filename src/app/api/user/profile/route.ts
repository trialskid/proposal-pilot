import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: {
      name: true,
      email: true,
      businessName: true,
      businessType: true,
      phone: true,
      address: true,
      website: true,
      logoUrl: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const user = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: {
      name: body.name,
      businessName: body.businessName,
      businessType: body.businessType,
      phone: body.phone,
      address: body.address,
      website: body.website,
    },
  });

  return NextResponse.json(user);
}
