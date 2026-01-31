export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultTerms: string;
  sampleDeliverables: string[];
  promptContext: string;
}

export const industryTemplates: IndustryTemplate[] = [
  {
    id: "general-contractor",
    name: "General Contractor",
    icon: "🏗️",
    description: "Construction, renovation, and building projects",
    defaultTerms:
      "50% deposit required before work begins. Balance due upon completion. All work warranted for 1 year. Permits and inspections included unless otherwise noted. Change orders must be approved in writing and may affect timeline and cost.",
    sampleDeliverables: [
      "Site preparation and cleanup",
      "Material procurement",
      "Labor and installation",
      "Final inspection and walkthrough",
    ],
    promptContext:
      "You are generating a proposal for a general contractor. Include specific construction terminology, material specifications where relevant, warranty information, permit considerations, and realistic timelines for construction work.",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    icon: "🌿",
    description: "Lawn care, garden design, and outdoor projects",
    defaultTerms:
      "50% deposit required to schedule work. Balance due upon completion. Plant material warranted for 90 days with proper care. Seasonal maintenance available as add-on. Weather delays will be communicated promptly.",
    sampleDeliverables: [
      "Design consultation",
      "Plant and material selection",
      "Installation and planting",
      "Initial maintenance setup",
    ],
    promptContext:
      "You are generating a proposal for a landscaping company. Include plant species recommendations, seasonal considerations, maintenance plans, and outdoor design elements. Consider drainage, irrigation, and soil conditions.",
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    icon: "✨",
    description: "Residential and commercial cleaning",
    defaultTerms:
      "Payment due upon completion of service. Recurring services billed monthly. 24-hour cancellation notice required. All cleaning supplies and equipment provided. Satisfaction guaranteed or we will re-clean at no charge.",
    sampleDeliverables: [
      "Deep cleaning of all rooms",
      "Kitchen and bathroom sanitization",
      "Floor cleaning and polishing",
      "Window cleaning",
    ],
    promptContext:
      "You are generating a proposal for a cleaning service. Include specific areas to be cleaned, frequency of service, products used, and square footage considerations. Address any special requirements like eco-friendly products or allergy considerations.",
  },
  {
    id: "it-services",
    name: "IT Services",
    icon: "💻",
    description: "Technology consulting, development, and support",
    defaultTerms:
      "30% deposit to begin work. Milestone payments as defined in timeline. Final payment upon delivery and acceptance. Source code ownership transfers upon full payment. 30-day bug fix warranty included. Support available at hourly rate after warranty period.",
    sampleDeliverables: [
      "Requirements analysis and planning",
      "Development and implementation",
      "Testing and quality assurance",
      "Deployment and training",
      "Documentation",
    ],
    promptContext:
      "You are generating a proposal for an IT services company. Include technical specifications, technology stack recommendations, development methodology (agile/waterfall), testing procedures, deployment strategy, and ongoing support options.",
  },
  {
    id: "marketing-agency",
    name: "Marketing Agency",
    icon: "📈",
    description: "Digital marketing, branding, and advertising",
    defaultTerms:
      "Monthly retainer billed at the beginning of each month. Minimum 3-month commitment. Ad spend is billed separately. All creative assets and copy are owned by the client. Monthly performance reports included. 30-day notice required to cancel.",
    sampleDeliverables: [
      "Strategy development",
      "Content creation",
      "Campaign setup and management",
      "Analytics and reporting",
      "Monthly optimization",
    ],
    promptContext:
      "You are generating a proposal for a marketing agency. Include specific marketing channels (SEO, PPC, social media, email), KPIs and metrics to track, content deliverables, campaign strategies, and expected ROI or growth targets.",
  },
  {
    id: "consulting",
    name: "Consulting",
    icon: "💼",
    description: "Business strategy, management, and advisory",
    defaultTerms:
      "Engagement fees billed monthly. Travel expenses billed at cost. Confidentiality maintained per NDA. Deliverables remain client property. 2-week notice required for scope changes. Recommendations are advisory; implementation is client's responsibility.",
    sampleDeliverables: [
      "Initial assessment and discovery",
      "Research and analysis",
      "Strategy recommendations",
      "Implementation roadmap",
      "Follow-up review",
    ],
    promptContext:
      "You are generating a proposal for a consulting engagement. Include assessment methodology, key stakeholder interviews, analysis framework, deliverable documents (reports, presentations), and measurable outcomes or success criteria.",
  },
];
