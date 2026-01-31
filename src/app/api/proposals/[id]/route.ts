import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const proposal = await prisma.proposal.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
      },
      include: {
        user: {
          select: {
            name: true,
            businessName: true,
            businessType: true,
            email: true,
            phone: true,
            address: true,
            website: true,
            logoUrl: true,
          },
        },
        viewEvents: {
          orderBy: { viewedAt: "desc" },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Get proposal error:", error);
    return NextResponse.json(
      { error: "Failed to get proposal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const existing = await prisma.proposal.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    const proposal = await prisma.proposal.update({
      where: { id },
      data: {
        title: body.title,
        clientName: body.clientName,
        clientEmail: body.clientEmail,
        clientCompany: body.clientCompany,
        clientPhone: body.clientPhone,
        scope: body.scope,
        deliverables: body.deliverables,
        timeline: body.timeline,
        pricing: body.pricing,
        terms: body.terms,
        notes: body.notes,
        subtotal: body.subtotal,
        tax: body.tax,
        total: body.total,
        status: body.status,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
      },
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Update proposal error:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.proposal.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    await prisma.proposal.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete proposal error:", error);
    return NextResponse.json(
      { error: "Failed to delete proposal" },
      { status: 500 }
    );
  }
}
