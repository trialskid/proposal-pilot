"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";

export default function EditProposal() {
  const { status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin");
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated" && params.id) {
      fetch(`/api/proposals/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          setProposal(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [authStatus, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const deliverables = proposal.deliverables || [];
      const subtotal = deliverables.reduce((sum: number, d: any) => sum + (Number(d.price) || 0), 0);

      const res = await fetch(`/api/proposals/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...proposal,
          subtotal,
          total: subtotal + (proposal.tax || 0),
          pricing: {
            ...(proposal.pricing || {}),
            subtotal,
            total: subtotal + (proposal.tax || 0),
          },
        }),
      });

      if (res.ok) {
        router.push(`/proposals/${params.id}`);
      }
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (!proposal) return null;

  const updateDeliverable = (index: number, field: string, value: any) => {
    const updated = [...(proposal.deliverables || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProposal({ ...proposal, deliverables: updated });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Link href={`/proposals/${params.id}`} className="text-sm text-gray-500 hover:text-gray-700">
                ← Back to Proposal
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">Edit Proposal</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={proposal.title || ""}
                    onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={proposal.clientName || ""}
                      onChange={(e) => setProposal({ ...proposal, clientName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      value={proposal.clientEmail || ""}
                      onChange={(e) => setProposal({ ...proposal, clientEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Scope</h3>
              <textarea
                value={proposal.scope || ""}
                onChange={(e) => setProposal({ ...proposal, scope: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-36 resize-none"
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Deliverables</h3>
              <div className="space-y-3">
                {(proposal.deliverables as any[])?.map((d: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex gap-3 mb-2">
                      <input
                        type="text"
                        value={d.item}
                        onChange={(e) => updateDeliverable(i, "item", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium"
                      />
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                        <input
                          type="number"
                          value={d.price}
                          onChange={(e) => updateDeliverable(i, "price", Number(e.target.value))}
                          className="w-32 pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updated = (proposal.deliverables as any[]).filter((_: any, idx: number) => idx !== i);
                          setProposal({ ...proposal, deliverables: updated });
                        }}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={d.description}
                      onChange={(e) => updateDeliverable(i, "description", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-16"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setProposal({
                    ...proposal,
                    deliverables: [...(proposal.deliverables || []), { item: "", description: "", price: 0 }],
                  });
                }}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Deliverable
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
              <textarea
                value={proposal.terms || ""}
                onChange={(e) => setProposal({ ...proposal, terms: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-28 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
