import OpenAI from "openai";
import { industryTemplates } from "./templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateProposalInput {
  jobDescription: string;
  industry: string;
  clientName: string;
  clientCompany?: string;
  businessName?: string;
  businessType?: string;
}

export interface GeneratedProposal {
  title: string;
  scope: string;
  deliverables: { item: string; description: string; price: number }[];
  timeline: { milestone: string; duration: string; description: string }[];
  pricing: {
    subtotal: number;
    tax: number;
    total: number;
    notes: string;
  };
  terms: string;
}

export async function generateProposal(
  input: GenerateProposalInput
): Promise<GeneratedProposal> {
  const template = industryTemplates.find((t) => t.id === input.industry);
  const templateContext = template?.promptContext || "";
  const defaultTerms = template?.defaultTerms || "";

  const prompt = `${templateContext}

Generate a detailed, professional business proposal based on the following information:

Client Name: ${input.clientName}
${input.clientCompany ? `Client Company: ${input.clientCompany}` : ""}
${input.businessName ? `Our Business: ${input.businessName}` : ""}
Industry: ${input.industry}

Job Description:
${input.jobDescription}

Generate a complete proposal with the following JSON structure. Be specific, detailed, and professional. Pricing should be realistic for the industry. Each deliverable should have an individual price that adds up to the subtotal.

{
  "title": "A professional proposal title",
  "scope": "Detailed project scope and description (2-3 paragraphs)",
  "deliverables": [
    {
      "item": "Deliverable name",
      "description": "Detailed description of this deliverable",
      "price": 0
    }
  ],
  "timeline": [
    {
      "milestone": "Milestone name",
      "duration": "e.g., Week 1-2",
      "description": "What happens in this phase"
    }
  ],
  "pricing": {
    "subtotal": 0,
    "tax": 0,
    "total": 0,
    "notes": "Any pricing notes or payment terms"
  },
  "terms": "${defaultTerms}"
}

Return ONLY valid JSON, no markdown or extra text.`;

  // Check if API key is available, if not return demo data
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY === "sk-your-openai-api-key"
  ) {
    return getDemoProposal(input);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert business proposal writer. Generate detailed, professional proposals. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from AI");

    // Clean potential markdown wrapping
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(cleaned) as GeneratedProposal;
  } catch (error) {
    console.error("OpenAI error, falling back to demo:", error);
    return getDemoProposal(input);
  }
}

function getDemoProposal(input: GenerateProposalInput): GeneratedProposal {
  const template = industryTemplates.find((t) => t.id === input.industry);

  return {
    title: `${input.industry === "general-contractor" ? "Construction" : input.industry === "landscaping" ? "Landscaping" : input.industry === "cleaning" ? "Cleaning" : input.industry === "it-services" ? "IT" : input.industry === "marketing-agency" ? "Marketing" : "Consulting"} Proposal for ${input.clientName}`,
    scope: `We are pleased to present this proposal for ${input.clientCompany || input.clientName}. Based on our discussion regarding "${input.jobDescription.substring(0, 100)}...", we have prepared a comprehensive plan to deliver exceptional results.\n\nOur team at ${input.businessName || "our company"} brings extensive experience in this area. We will apply industry best practices and proven methodologies to ensure your project is completed on time, within budget, and to the highest standards of quality.\n\nThis proposal outlines the full scope of work, timeline, deliverables, and investment required to bring your vision to life.`,
    deliverables: [
      {
        item: "Discovery & Planning",
        description:
          "Initial consultation, requirements gathering, and detailed project planning to ensure alignment on goals and expectations.",
        price: 1500,
      },
      {
        item: "Core Implementation",
        description:
          "Primary execution of the project scope, including all labor, materials, and coordination required.",
        price: 5500,
      },
      {
        item: "Quality Assurance & Review",
        description:
          "Thorough review and testing of all deliverables to ensure they meet our quality standards and your requirements.",
        price: 1200,
      },
      {
        item: "Final Delivery & Handoff",
        description:
          "Complete project delivery with documentation, training if applicable, and a thorough walkthrough.",
        price: 800,
      },
    ],
    timeline: [
      {
        milestone: "Project Kickoff",
        duration: "Week 1",
        description:
          "Initial meeting, requirements finalization, and project planning.",
      },
      {
        milestone: "Phase 1 - Foundation",
        duration: "Weeks 2-3",
        description:
          "Core groundwork and initial implementation begins.",
      },
      {
        milestone: "Phase 2 - Execution",
        duration: "Weeks 4-6",
        description:
          "Primary work execution with regular progress updates.",
      },
      {
        milestone: "Review & Completion",
        duration: "Week 7-8",
        description:
          "Final review, adjustments, and project handoff.",
      },
    ],
    pricing: {
      subtotal: 9000,
      tax: 0,
      total: 9000,
      notes:
        "Payment terms: 50% due upon acceptance, 50% due upon project completion. Prices valid for 30 days.",
    },
    terms:
      template?.defaultTerms ||
      "50% deposit required to begin work. Balance due upon completion. All deliverables become property of the client upon full payment. Changes to scope may require a revised estimate.",
  };
}
