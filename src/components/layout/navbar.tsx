"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ProposalPilot
              </span>
            </Link>
          </div>

          {session ? (
            <>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/proposals/new"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  New Proposal
                </Link>
                <Link
                  href="/settings"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign Out
                </button>
              </div>
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="text-gray-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && session && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link href="/dashboard" className="block py-3 text-gray-700 font-medium text-base min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
            <Link href="/proposals/new" className="block py-3 text-gray-700 font-medium text-base min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
              New Proposal
            </Link>
            <Link href="/settings" className="block py-3 text-gray-700 font-medium text-base min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
              Settings
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="block py-3 text-gray-700 font-medium w-full text-left text-base min-h-[44px]"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
