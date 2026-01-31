import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateShareToken } from "@/lib/utils";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposals = await prisma.proposal.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: "desc" },
      include: {
        viewEvents: {
          orderBy: { viewedAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error("Get proposals error:", error);
    return NextResponse.json(
      { error: "Failed to get proposals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const shareToken = generateShareToken();

    const proposal = await prisma.proposal.create({
      data: {
        userId: (session.user as any).id,
        title: body.title,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientCompany: body.clientCompany,
        clientPhone: body.clientPhone,
        industry: body.industry,
        description: body.description,
        scope: body.scope,
        deliverables: body.deliverables,
        timeline: body.timeline,
        pricing: body.pricing,
        terms: body.terms,
        notes: body.notes,
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        shareToken,
        status: body.status || "DRAFT",
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Create proposal error:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
