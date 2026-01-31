import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateProposal } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { jobDescription, industry, clientName, clientCompany, businessName } = body;

    if (!jobDescription || !industry || !clientName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const proposal = await generateProposal({
      jobDescription,
      industry,
      clientName,
      clientCompany,
      businessName,
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Generate proposal error:", error);
    return NextResponse.json(
      { error: "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
