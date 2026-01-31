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
      where: { id, userId: (session.user as any).id },
      include: {
        user: {
          select: {
            name: true,
            businessName: true,
            email: true,
            phone: true,
            address: true,
            website: true,
          },
        },
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Return proposal data for client-side PDF generation
    return NextResponse.json(proposal);
  } catch (error) {
    console.error("PDF error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
