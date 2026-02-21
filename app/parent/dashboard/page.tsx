"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, TrendingUp, BookOpen, Search, UserPlus } from "lucide-react";

export default function ParentDashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{session?.user?.name || "Parent"}</span>
                    </h1>
                    <p className="text-gray-400">Track your child&apos;s progress and connect with tutors.</p>
                </header>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard icon={<Users className="w-5 h-5 text-emerald-400" />} label="Children Linked" value="0" />
                    <StatCard icon={<TrendingUp className="w-5 h-5 text-blue-400" />} label="Avg. Progress" value="—" />
                    <StatCard icon={<BookOpen className="w-5 h-5 text-purple-400" />} label="Active Courses" value="0" />
                    <StatCard icon={<Search className="w-5 h-5 text-yellow-400" />} label="Tutors Connected" value="0" />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Link Child */}
                    <div className="bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Link Your Child</h3>
                        <p className="text-sm text-gray-400 mb-4 max-w-sm">
                            Connect your child&apos;s TensorArena account to monitor their learning progress and activity in real-time.
                        </p>
                        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Add Child Account
                        </button>
                    </div>

                    {/* Find Tutors */}
                    <div className="bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Find a Tutor</h3>
                        <p className="text-sm text-gray-400 mb-4 max-w-sm">
                            Browse our network of verified tutors. Filter by subject, rating, and availability to find the perfect match.
                        </p>
                        <Link href="/tutors" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <Search className="w-4 h-4" /> Browse Tutors
                        </Link>
                    </div>

                    {/* Activity Feed */}
                    <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Activity Feed
                        </h3>
                        <div className="h-48 flex items-center justify-center border border-dashed border-gray-800 rounded-xl">
                            <div className="text-center">
                                <p className="text-gray-500 text-sm">No activity yet</p>
                                <p className="text-gray-600 text-xs mt-1">Link a child account to see their learning activity here.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs text-gray-400">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}
