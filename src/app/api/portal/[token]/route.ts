import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    const proposal = await prisma.proposal.findUnique({
      where: { shareToken: token },
      include: {
        user: {
          select: {
            name: true,
            businessName: true,
            email: true,
            phone: true,
            address: true,
            website: true,
            logoUrl: true,
          },
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
    console.error("Portal error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
