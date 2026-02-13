"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function GlobalHeader() {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            TensorArena
                        </span>
                    </Link>

                    {!isHome && (
                        <nav>
                            <Link
                                href="/"
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Back to Home
                            </Link>
                        </nav>
                    )}
                </div>
            </header>
            <div className="h-16" aria-hidden />
        </>
    );
}
