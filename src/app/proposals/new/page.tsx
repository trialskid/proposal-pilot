"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { industryTemplates } from "@/lib/templates";

export default function NewProposal() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientPhone: "",
    industry: "",
    jobDescription: "",
  });

  const [proposal, setProposal] = useState<any>(null);

  if (authStatus === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (authStatus === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          businessName: (session?.user as any)?.name,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setProposal(data);
      setStep(3);
    } catch (err) {
      alert("Failed to generate proposal. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (status: string = "DRAFT") => {
    setSaving(true);
    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proposal.title,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          clientCompany: form.clientCompany,
          clientPhone: form.clientPhone,
          industry: form.industry,
          description: form.jobDescription,
          scope: proposal.scope,
          deliverables: proposal.deliverables,
          timeline: proposal.timeline,
          pricing: proposal.pricing,
          terms: proposal.terms,
          subtotal: proposal.pricing?.subtotal,
          tax: proposal.pricing?.tax,
          total: proposal.pricing?.total,
          status,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();
      router.push(`/proposals/${saved.id}`);
    } catch {
      alert("Failed to save proposal.");
    } finally {
      setSaving(false);
    }
  };

  const updateDeliverable = (index: number, field: string, value: any) => {
    const updated = [...proposal.deliverables];
    updated[index] = { ...updated[index], [field]: value };
    const subtotal = updated.reduce((sum: number, d: any) => sum + (Number(d.price) || 0), 0);
    setProposal({
      ...proposal,
      deliverables: updated,
      pricing: { ...proposal.pricing, subtotal, total: subtotal + (proposal.pricing?.tax || 0) },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { n: 1, label: "Client Details" },
              { n: 2, label: "Job Description" },
              { n: 3, label: "Review & Edit" },
            ].map(({ n, label }) => (
              <div key={n} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= n
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {n}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    step >= n ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
                {n < 3 && (
                  <div className="w-12 h-0.5 bg-gray-200 mx-1" />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Client Details */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Client Information
              </h2>
              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(e) =>
                        setForm({ ...form, clientName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={form.clientEmail}
                      onChange={(e) =>
                        setForm({ ...form, clientEmail: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={form.clientCompany}
                      onChange={(e) =>
                        setForm({ ...form, clientCompany: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.clientPhone}
                      onChange={(e) =>
                        setForm({ ...form, clientPhone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Industry Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Industry *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industryTemplates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setForm({ ...form, industry: t.id })}
                        className={`p-4 rounded-xl border-2 text-left transition ${
                          form.industry === t.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-2xl mb-1">{t.icon}</div>
                        <div className="font-medium text-sm text-gray-900">
                          {t.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      if (!form.clientName || !form.industry) {
                        alert("Please fill in client name and select an industry.");
                        return;
                      }
                      setStep(2);
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Describe the Job
              </h2>
              <p className="text-gray-600 mb-6">
                Tell us about the project in plain English. The more detail you provide,
                the better the proposal will be.
              </p>
              <textarea
                value={form.jobDescription}
                onChange={(e) =>
                  setForm({ ...form, jobDescription: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-48 resize-none"
                placeholder={`Example: "We need to renovate a 2,000 sq ft kitchen and bathroom in a residential home. The kitchen needs new cabinets, countertops, flooring, and appliances. The bathroom needs a complete gut renovation including new tile, vanity, and fixtures. The home was built in 1985 and may need some electrical and plumbing updates."`}
              />
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (!form.jobDescription.trim()) {
                      alert("Please describe the job.");
                      return;
                    }
                    handleGenerate();
                  }}
                  disabled={generating}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Generating with AI...
                    </>
                  ) : (
                    "🤖 Generate Proposal"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Edit */}
          {step === 3 && proposal && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Review & Edit Proposal
                </h2>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    value={proposal.title}
                    onChange={(e) =>
                      setProposal({ ...proposal, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg font-semibold"
                  />
                </div>

                {/* Scope */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Scope
                  </label>
                  <textarea
                    value={proposal.scope}
                    onChange={(e) =>
                      setProposal({ ...proposal, scope: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-36 resize-none"
                  />
                </div>

                {/* Deliverables */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Deliverables & Pricing
                  </label>
                  <div className="space-y-3">
                    {proposal.deliverables?.map((d: any, i: number) => (
                      <div
                        key={i}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex gap-3 mb-2">
                          <input
                            type="text"
                            value={d.item}
                            onChange={(e) =>
                              updateDeliverable(i, "item", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                          />
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                            <input
                              type="number"
                              value={d.price}
                              onChange={(e) =>
                                updateDeliverable(
                                  i,
                                  "price",
                                  Number(e.target.value)
                                )
                              }
                              className="w-32 pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                        <textarea
                          value={d.description}
                          onChange={(e) =>
                            updateDeliverable(i, "description", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none h-16"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setProposal({
                        ...proposal,
                        deliverables: [
                          ...(proposal.deliverables || []),
                          { item: "New Item", description: "", price: 0 },
                        ],
                      });
                    }}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add Deliverable
                  </button>
                </div>

                {/* Timeline */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Timeline
                  </label>
                  <div className="space-y-3">
                    {proposal.timeline?.map((t: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row gap-3 border border-gray-200 rounded-lg p-4"
                      >
                        <input
                          type="text"
                          value={t.milestone}
                          onChange={(e) => {
                            const updated = [...proposal.timeline];
                            updated[i] = { ...updated[i], milestone: e.target.value };
                            setProposal({ ...proposal, timeline: updated });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                        />
                        <input
                          type="text"
                          value={t.duration}
                          onChange={(e) => {
                            const updated = [...proposal.timeline];
                            updated[i] = { ...updated[i], duration: e.target.value };
                            setProposal({ ...proposal, timeline: updated });
                          }}
                          className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={proposal.terms}
                    onChange={(e) =>
                      setProposal({ ...proposal, terms: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-28 resize-none"
                  />
                </div>

                {/* Pricing Summary */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Pricing Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        $
                        {(proposal.pricing?.subtotal || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>
                        $
                        {(proposal.pricing?.tax || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>
                        $
                        {(proposal.pricing?.total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
                  >
                    ← Back
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSave("DRAFT")}
                      disabled={saving}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handleSave("SENT")}
                      disabled={saving}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save & Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
