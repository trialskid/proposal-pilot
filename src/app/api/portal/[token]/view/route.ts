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

    // Update status to VIEWED if currently SENT
    if (proposal.status === "SENT") {
      await prisma.proposal.update({
        where: { id: proposal.id },
        data: { status: "VIEWED" },
      });
    }

    // Record view event
    await prisma.viewEvent.create({
      data: {
        proposalId: proposal.id,
        duration: body.duration || null,
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
