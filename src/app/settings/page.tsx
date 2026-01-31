"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

export default function Settings() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    businessType: "",
    phone: "",
    address: "",
    website: "",
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") router.push("/auth/signin");
  }, [authStatus, router]);

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        businessName: "",
        businessType: "",
        phone: "",
        address: "",
        website: "",
      });
      // Fetch full profile
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data && !data.error) {
            setForm({
              name: data.name || "",
              businessName: data.businessName || "",
              businessType: data.businessType || "",
              phone: data.phone || "",
              address: data.address || "",
              website: data.website || "",
            });
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Business Profile
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              This information appears on your proposals.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  value={form.businessType}
                  onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select</option>
                  <option value="general-contractor">General Contractor</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="cleaning">Cleaning Services</option>
                  <option value="it-services">IT Services</option>
                  <option value="marketing-agency">Marketing Agency</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {saved && (
                  <span className="text-green-600 font-medium">✓ Saved!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
