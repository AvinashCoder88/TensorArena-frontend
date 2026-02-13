"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/arena";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await signIn("credentials", {
                email,
                password,
                callbackUrl,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid credentials");
            } else {
                router.refresh(); // Update client-side session state
                router.replace(result?.url || callbackUrl);
            }
        } catch {
            setError("An error occurred");
        }
    };

    return (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/10">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    Welcome Back
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                    Enter your credentials to access the arena
                </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="group">
                        <label
                            htmlFor="email"
                            className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-blue-400"
                        >
                            Email address
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label
                            htmlFor="password"
                            className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 ml-1 transition-colors group-focus-within:text-blue-400"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-shake">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                >
                    Sign in to Account
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
}
