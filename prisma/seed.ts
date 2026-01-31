import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("demo123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@proposalpilot.com" },
    update: {},
    create: {
      email: "demo@proposalpilot.com",
      name: "Demo User",
      password: hashedPassword,
      businessName: "Acme Services LLC",
      businessType: "general-contractor",
      phone: "(555) 123-4567",
      address: "123 Main Street, Anytown, USA",
      website: "https://acmeservices.com",
    },
  });

  // Create sample proposals
  const proposals = [
    {
      title: "Kitchen Renovation Proposal",
      clientName: "Sarah Johnson",
      clientEmail: "sarah@example.com",
      clientCompany: "Johnson Residence",
      industry: "general-contractor",
      status: "ACCEPTED" as const,
      scope:
        "Complete kitchen renovation including demolition of existing kitchen, new custom cabinetry, quartz countertops, tile backsplash, hardwood flooring, and all new appliances. Electrical and plumbing updates as needed to meet current code.",
      deliverables: [
        {
          item: "Demolition & Prep",
          description: "Remove existing cabinets, countertops, flooring, and appliances. Dispose of all debris.",
          price: 2500,
        },
        {
          item: "Custom Cabinetry",
          description: "Supply and install custom shaker-style cabinets in white with soft-close hardware.",
          price: 12000,
        },
        {
          item: "Countertops & Backsplash",
          description: "Quartz countertops with undermount sink and subway tile backsplash.",
          price: 5500,
        },
        {
          item: "Flooring",
          description: "Engineered hardwood flooring throughout kitchen area.",
          price: 3200,
        },
        {
          item: "Electrical & Plumbing",
          description: "Update electrical to code, relocate plumbing for new layout.",
          price: 4800,
        },
      ],
      timeline: [
        { milestone: "Design & Planning", duration: "Week 1-2", description: "Finalize design, order materials" },
        { milestone: "Demolition", duration: "Week 3", description: "Remove existing kitchen" },
        { milestone: "Rough-in", duration: "Week 4-5", description: "Electrical and plumbing work" },
        { milestone: "Installation", duration: "Week 6-8", description: "Cabinets, countertops, flooring" },
        { milestone: "Final Touches", duration: "Week 9", description: "Backsplash, hardware, cleanup" },
      ],
      pricing: { subtotal: 28000, tax: 0, total: 28000, notes: "50% deposit, 50% on completion" },
      terms: "50% deposit required before work begins. Balance due upon completion. All work warranted for 1 year.",
      subtotal: 28000,
      total: 28000,
      signedAt: new Date("2025-01-15"),
      signedByName: "Sarah Johnson",
    },
    {
      title: "Office Landscape Design",
      clientName: "Mike Chen",
      clientEmail: "mike@techcorp.io",
      clientCompany: "TechCorp Inc",
      industry: "landscaping",
      status: "SENT" as const,
      scope:
        "Design and install a modern corporate landscape for the TechCorp headquarters. Includes native plantings, hardscape walkways, automated irrigation, and outdoor seating area for employees.",
      deliverables: [
        { item: "Landscape Design", description: "Full design with 3D renderings", price: 3500 },
        { item: "Native Plantings", description: "Drought-resistant native plants and trees", price: 8500 },
        { item: "Hardscape", description: "Stone walkways and patio area", price: 6000 },
        { item: "Irrigation System", description: "Automated smart irrigation system", price: 4200 },
      ],
      timeline: [
        { milestone: "Design Phase", duration: "Week 1-2", description: "Design and approval" },
        { milestone: "Site Prep", duration: "Week 3", description: "Grading and preparation" },
        { milestone: "Installation", duration: "Week 4-6", description: "Planting and hardscape" },
        { milestone: "Systems", duration: "Week 7", description: "Irrigation and lighting" },
      ],
      pricing: { subtotal: 22200, tax: 0, total: 22200, notes: "Net 30 terms available" },
      terms: "50% deposit required to schedule work. Balance due upon completion.",
      subtotal: 22200,
      total: 22200,
    },
    {
      title: "Website Redesign & Development",
      clientName: "Lisa Park",
      clientEmail: "lisa@startupxyz.com",
      clientCompany: "StartupXYZ",
      industry: "it-services",
      status: "VIEWED" as const,
      scope:
        "Complete redesign and development of the StartupXYZ website. Modern, responsive design with improved UX, CMS integration, SEO optimization, and performance enhancements.",
      deliverables: [
        { item: "UX Research & Design", description: "User research, wireframes, and high-fidelity mockups", price: 5000 },
        { item: "Frontend Development", description: "React/Next.js development with responsive design", price: 8000 },
        { item: "CMS Integration", description: "Headless CMS setup for content management", price: 3000 },
        { item: "SEO & Performance", description: "Technical SEO, Core Web Vitals optimization", price: 2500 },
        { item: "QA & Launch", description: "Testing, staging, and production deployment", price: 1500 },
      ],
      timeline: [
        { milestone: "Discovery", duration: "Week 1", description: "Requirements and research" },
        { milestone: "Design", duration: "Week 2-3", description: "UI/UX design and approval" },
        { milestone: "Development", duration: "Week 4-7", description: "Frontend and CMS build" },
        { milestone: "Testing & Launch", duration: "Week 8", description: "QA, fixes, and deployment" },
      ],
      pricing: { subtotal: 20000, tax: 0, total: 20000, notes: "30% deposit, 40% at design approval, 30% at launch" },
      terms: "30% deposit to begin. Source code ownership transfers upon full payment. 30-day bug fix warranty.",
      subtotal: 20000,
      total: 20000,
    },
    {
      title: "Q1 Digital Marketing Campaign",
      clientName: "David Williams",
      clientEmail: "david@retailbrand.com",
      clientCompany: "RetailBrand Co",
      industry: "marketing-agency",
      status: "DRAFT" as const,
      scope: "Comprehensive Q1 digital marketing campaign including social media management, Google Ads, email marketing, and content creation to drive brand awareness and sales.",
      deliverables: [
        { item: "Social Media Management", description: "Daily posting on 3 platforms, community management", price: 3000 },
        { item: "Google Ads Campaign", description: "Search and display campaign setup and management", price: 2500 },
        { item: "Email Marketing", description: "4 email campaigns with segmentation", price: 1500 },
        { item: "Content Creation", description: "8 blog posts, 12 social graphics, 2 videos", price: 4000 },
      ],
      timeline: [
        { milestone: "Strategy", duration: "Week 1", description: "Campaign strategy and planning" },
        { milestone: "Month 1", duration: "Week 2-5", description: "Campaign launch and initial optimization" },
        { milestone: "Month 2", duration: "Week 6-9", description: "Scale and optimize performing channels" },
        { milestone: "Month 3", duration: "Week 10-13", description: "Final push and reporting" },
      ],
      pricing: { subtotal: 11000, tax: 0, total: 11000, notes: "Monthly retainer. Ad spend billed separately." },
      terms: "Monthly retainer billed at beginning of each month. Minimum 3-month commitment. Ad spend billed separately.",
      subtotal: 11000,
      total: 11000,
    },
  ];

  for (const p of proposals) {
    const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
    await prisma.proposal.create({
      data: {
        userId: user.id,
        title: p.title,
        clientName: p.clientName,
        clientEmail: p.clientEmail,
        clientCompany: p.clientCompany,
        industry: p.industry,
        status: p.status,
        scope: p.scope,
        deliverables: p.deliverables,
        timeline: p.timeline,
        pricing: p.pricing,
        terms: p.terms,
        subtotal: p.subtotal,
        total: p.total,
        shareToken,
        signedAt: (p as any).signedAt || null,
        signedByName: (p as any).signedByName || null,
      },
    });
  }

  // Add some view events
  const sentProposal = await prisma.proposal.findFirst({
    where: { userId: user.id, status: "VIEWED" },
  });
  if (sentProposal) {
    await prisma.viewEvent.createMany({
      data: [
        { proposalId: sentProposal.id, duration: 45, ipAddress: "192.168.1.1", userAgent: "Chrome" },
        { proposalId: sentProposal.id, duration: 120, ipAddress: "192.168.1.1", userAgent: "Chrome" },
        { proposalId: sentProposal.id, duration: 30, ipAddress: "10.0.0.1", userAgent: "Safari" },
      ],
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
