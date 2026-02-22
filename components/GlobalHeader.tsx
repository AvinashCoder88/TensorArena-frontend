"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";

const ROLE_NAV: Record<string, { label: string; href: string }[]> = {
    TEACHER: [{ label: "Teacher Dashboard", href: "/teacher" }],
    TUTOR: [{ label: "Tutor Dashboard", href: "/tutor/dashboard" }],
    PARENT: [{ label: "Parent Dashboard", href: "/parent/dashboard" }],
    STUDENT: [],
};

const ROLE_COLORS: Record<string, string> = {
    STUDENT: "bg-blue-500/20 text-blue-300",
    TEACHER: "bg-purple-500/20 text-purple-300",
    PARENT: "bg-emerald-500/20 text-emerald-300",
    TUTOR: "bg-yellow-500/20 text-yellow-300",
};

export function GlobalHeader() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const role = session?.user?.role || "STUDENT";
    const roleNavItems = ROLE_NAV[role] || [];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            TensorArena
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {!isHome && (
                            <Link
                                href="/"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Home
                            </Link>
                        )}
                        <Link
                            href="/about"
                            className={`text-sm transition-colors ${pathname === "/about" ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            About Us
                        </Link>
                        <Link
                            href="/services"
                            className={`text-sm transition-colors ${pathname === "/services" ? "text-white" : "text-gray-400 hover:text-white"}`}
                        >
                            Catalog
                        </Link>

                        {/* Role-specific nav links */}
                        {session && roleNavItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm transition-colors ${pathname === item.href ? "text-white" : "text-gray-400 hover:text-white"}`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {!session && (
                            <Link
                                href="/become-a-tutor"
                                className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                            >
                                Become a Tutor
                            </Link>
                        )}

                        {session ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                        {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="text-sm text-gray-300 hidden sm:inline">{session.user?.name?.split(" ")[0]}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full hidden sm:inline ${ROLE_COLORS[role]}`}>
                                        {role.toLowerCase()}
                                    </span>
                                    <ChevronDown className="w-3 h-3 text-gray-500" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-800 shadow-xl py-1 z-50">
                                        <div className="px-4 py-2 border-b border-gray-800">
                                            <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                            <p className="text-xs text-gray-400">{session.user?.email}</p>
                                        </div>
                                        <Link
                                            href="/arena"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" /> Arena
                                        </Link>
                                        {roleNavItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={() => { signOut(); setMenuOpen(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="h-16" aria-hidden />
        </>
    );
}
