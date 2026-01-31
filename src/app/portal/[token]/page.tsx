"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function ClientPortal() {
  const params = useParams();
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSign, setShowSign] = useState(false);
  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signed, setSigned] = useState(false);
  const [declined, setDeclined] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    if (params.token) {
      fetch(`/api/portal/${params.token}`)
        .then((r) => r.json())
        .then((data) => {
          setProposal(data);
          setLoading(false);
          // Track view
          fetch(`/api/portal/${params.token}/view`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ duration: 0 }),
          });
        })
        .catch(() => setLoading(false));
    }

    // Track duration on leave
    return () => {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      if (params.token && duration > 2) {
        navigator.sendBeacon(
          `/api/portal/${params.token}/view`,
          JSON.stringify({ duration })
        );
      }
    };
  }, [params.token]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = "#1e40af";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      isDrawing.current = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const end = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", end);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", end);
    };
  }, [showSign]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAccept = async () => {
    if (!signName.trim()) {
      alert("Please enter your name");
      return;
    }

    const signature = canvasRef.current?.toDataURL("image/png") || null;

    try {
      const res = await fetch(`/api/portal/${params.token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accepted: true,
          name: signName,
          email: signEmail,
          signature,
        }),
      });

      if (res.ok) {
        setSigned(true);
        setShowSign(false);
      }
    } catch {
      alert("Failed to submit. Please try again.");
    }
  };

  const handleDecline = async () => {
    if (!confirm("Are you sure you want to decline this proposal?")) return;

    try {
      const res = await fetch(`/api/portal/${params.token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: false }),
      });

      if (res.ok) {
        setDeclined(true);
      }
    } catch {
      alert("Failed to submit. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!proposal || proposal.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal not found</h2>
          <p className="text-gray-600">This link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Accepted!</h2>
          <p className="text-gray-600">
            Thank you for accepting. {proposal.user?.businessName || "We"} will be in touch shortly.
          </p>
        </div>
      </div>
    );
  }

  if (declined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Declined</h2>
          <p className="text-gray-600">
            Thank you for your response. If you change your mind, please reach out.
          </p>
        </div>
      </div>
    );
  }

  const alreadyResponded = ["ACCEPTED", "DECLINED"].includes(proposal.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Proposal from</p>
            <p className="font-semibold text-gray-900">
              {proposal.user?.businessName || proposal.user?.name || "Business"}
            </p>
          </div>
          {proposal.user?.email && (
            <a
              href={`mailto:${proposal.user.email}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Contact
            </a>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status banner */}
        {proposal.status === "ACCEPTED" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-800 font-medium">
            ✅ This proposal has been accepted
          </div>
        )}
        {proposal.status === "DECLINED" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-800 font-medium">
            This proposal has been declined
          </div>
        )}

        {/* Proposal Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Title Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{proposal.title}</h1>
            <p className="mt-2 text-blue-100">
              Prepared for {proposal.clientName}
              {proposal.clientCompany && ` — ${proposal.clientCompany}`}
            </p>
            <p className="mt-1 text-blue-200 text-sm">
              {new Date(proposal.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Scope */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Project Scope
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {proposal.scope}
              </p>
            </section>

            {/* Deliverables */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Deliverables
              </h2>
              <div className="space-y-4">
                {(proposal.deliverables as any[])?.map((d: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{d.item}</p>
                      <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                    </div>
                    <p className="font-bold text-gray-900 ml-4 text-lg">
                      ${Number(d.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Timeline */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Timeline
              </h2>
              <div className="space-y-4">
                {(proposal.timeline as any[])?.map((t: any, i: number) => (
                  <div key={i} className="flex gap-4">
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
            </section>

            {/* Pricing */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Investment
              </h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-2">
                  {(proposal.deliverables as any[])?.map((d: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>{d.item}</span>
                      <span>${Number(d.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-xl text-gray-900">
                    <span>Total</span>
                    <span>${(proposal.total || 0).toLocaleString()}</span>
                  </div>
                </div>
                {(proposal.pricing as any)?.notes && (
                  <p className="mt-3 text-sm text-gray-500">
                    {(proposal.pricing as any).notes}
                  </p>
                )}
              </div>
            </section>

            {/* Terms */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Terms & Conditions
              </h2>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{proposal.terms}</p>
            </section>
          </div>
        </div>

        {/* Accept/Decline Actions */}
        {!alreadyResponded && !showSign && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to move forward?
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSign(true)}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition"
              >
                ✅ Accept Proposal
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* Signature Modal */}
        {showSign && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Sign to Accept
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={signEmail}
                  onChange={(e) => setSignEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature
                </label>
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                </div>
                <button
                  onClick={clearSignature}
                  className="mt-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear signature
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Accept & Sign
                </button>
                <button
                  onClick={() => setShowSign(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-sm text-gray-400">
          Powered by <span className="font-medium">ProposalPilot</span>
        </p>
      </div>
    </div>
  );
}
