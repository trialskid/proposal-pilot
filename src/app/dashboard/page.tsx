"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  clientCompany: string | null;
  status: string;
  total: number | null;
  createdAt: string;
  updatedAt: string;
  shareToken: string | null;
  viewEvents: { viewedAt: string }[];
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  VIEWED: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

export default function Dashboard() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetch("/api/proposals")
        .then((r) => r.json())
        .then((data) => {
          setProposals(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [authStatus]);

  if (authStatus === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  const stats = {
    total: proposals.length,
    draft: proposals.filter((p) => p.status === "DRAFT").length,
    sent: proposals.filter((p) => ["SENT", "VIEWED"].includes(p.status)).length,
    accepted: proposals.filter((p) => p.status === "ACCEPTED").length,
    declined: proposals.filter((p) => p.status === "DECLINED").length,
    totalValue: proposals
      .filter((p) => p.status === "ACCEPTED")
      .reduce((sum, p) => sum + (p.total || 0), 0),
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {session?.user?.name || "there"}
              </p>
            </div>
            <Link
              href="/proposals/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              + New Proposal
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Proposals", value: stats.total, color: "text-gray-900" },
              { label: "Pending", value: stats.sent, color: "text-blue-600" },
              { label: "Accepted", value: stats.accepted, color: "text-green-600" },
              {
                label: "Revenue Won",
                value: `$${stats.totalValue.toLocaleString()}`,
                color: "text-green-600",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
              >
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Proposals List */}
          {proposals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No proposals yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first AI-powered proposal in minutes.
              </p>
              <Link
                href="/proposals/new"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Your First Proposal
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Proposal
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden md:table-cell">
                        Client
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden sm:table-cell">
                        Amount
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 hidden lg:table-cell">
                        Date
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {proposals.map((proposal) => (
                      <tr
                        key={proposal.id}
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => router.push(`/proposals/${proposal.id}`)}
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">
                            {proposal.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-gray-700">{proposal.clientName}</p>
                          {proposal.clientCompany && (
                            <p className="text-sm text-gray-500">
                              {proposal.clientCompany}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${statusColors[proposal.status] || "bg-gray-100 text-gray-700"}`}
                          >
                            {proposal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <p className="font-medium text-gray-900">
                            {proposal.total
                              ? `$${proposal.total.toLocaleString()}`
                              : "—"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">
                          {new Date(proposal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              href={`/proposals/${proposal.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </Link>
                            {proposal.shareToken && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${window.location.origin}/portal/${proposal.shareToken}`
                                  );
                                  alert("Link copied!");
                                }}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                              >
                                Copy Link
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
