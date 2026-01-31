import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();

    const proposal = await prisma.proposal.findUnique({
      where: { shareToken: token },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (proposal.status === "ACCEPTED" || proposal.status === "DECLINED") {
      return NextResponse.json(
        { error: "Proposal already responded to" },
        { status: 400 }
      );
    }

    const status = body.accepted ? "ACCEPTED" : "DECLINED";

    await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status,
        signatureUrl: body.signature || null,
        signedAt: new Date(),
        signedByName: body.name || null,
        signedByEmail: body.email || null,
      },
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Sign error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
