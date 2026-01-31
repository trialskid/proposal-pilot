"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  VIEWED: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
};

export default function ProposalDetail() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const params = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`/api/proposals/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...proposal, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProposal({ ...proposal, ...updated });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    const res = await fetch(`/api/proposals/${params.id}`, { method: "DELETE" });
    if (res.ok) router.push("/dashboard");
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

  if (!proposal || proposal.error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal not found</h2>
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  const portalUrl = proposal.shareToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/portal/${proposal.shareToken}`
    : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Link
                href="/dashboard"
                className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusColors[proposal.status] || "bg-gray-100"}`}
                >
                  {proposal.status}
                </span>
                <span className="text-gray-500 text-sm">
                  Created {new Date(proposal.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {proposal.status === "DRAFT" && (
                <button
                  onClick={() => handleStatusChange("SENT")}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                >
                  Mark as Sent
                </button>
              )}
              {portalUrl && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(portalUrl);
                    alert("Portal link copied to clipboard!");
                  }}
                  className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                >
                  📋 Copy Portal Link
                </button>
              )}
              <Link
                href={`/proposals/${proposal.id}/edit`}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              >
                ✏️ Edit
              </Link>
              <button
                onClick={handleDelete}
                className="bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-lg font-medium hover:bg-red-50 transition text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Client Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{proposal.clientName}</p>
                  </div>
                  {proposal.clientCompany && (
                    <div>
                      <p className="text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{proposal.clientCompany}</p>
                    </div>
                  )}
                  {proposal.clientEmail && (
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{proposal.clientEmail}</p>
                    </div>
                  )}
                  {proposal.clientPhone && (
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{proposal.clientPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Project Scope</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{proposal.scope}</p>
              </div>

              {/* Deliverables */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Deliverables</h3>
                <div className="space-y-4">
                  {(proposal.deliverables as any[])?.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{d.item}</p>
                        <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                      </div>
                      <p className="font-semibold text-gray-900 ml-4">
                        ${Number(d.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  {(proposal.timeline as any[])?.map((t: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-24 shrink-0">
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {t.duration}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t.milestone}</p>
                        <p className="text-sm text-gray-600">{t.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{proposal.terms}</p>
              </div>

              {/* Signature Info */}
              {proposal.signedAt && (
                <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Signed</h3>
                  <p className="text-green-700 text-sm">
                    Signed by {proposal.signedByName || "Client"} on{" "}
                    {new Date(proposal.signedAt).toLocaleString()}
                  </p>
                  {proposal.signatureUrl && (
                    <img
                      src={proposal.signatureUrl}
                      alt="Signature"
                      className="mt-3 max-h-20 border border-green-200 rounded bg-white p-2"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${(proposal.subtotal || 0).toLocaleString()}</span>
                  </div>
                  {proposal.tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${(proposal.tax || 0).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>${(proposal.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Portal Link */}
              {portalUrl && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Client Portal</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Share this link with your client to view and accept the proposal.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 break-all mb-3">
                    {portalUrl}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(portalUrl);
                      alert("Copied!");
                    }}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              )}

              {/* View Analytics */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
                {proposal.viewEvents?.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-900">
                        {proposal.viewEvents.length}
                      </span>{" "}
                      total views
                    </p>
                    <div className="space-y-2">
                      {proposal.viewEvents.slice(0, 5).map((v: any) => (
                        <div
                          key={v.id}
                          className="text-xs text-gray-500 border-b border-gray-50 pb-2 last:border-0"
                        >
                          Viewed {new Date(v.viewedAt).toLocaleString()}
                          {v.duration && ` (${v.duration}s)`}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No views yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
