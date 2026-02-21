"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle, Users, Award, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface TutorProfile {
    id: string;
    fullName: string;
    subjects: string[];
    qualifications: string;
    experience: string;
    bio: string | null;
    status: string;
    createdAt: string;
}

export default function TutorDashboardPage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<TutorProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/tutors/status")
            .then((res) => res.ok ? res.json() : null)
            .then((data) => setProfile(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const isApproved = profile?.status === "APPROVED";
    const isPending = profile?.status === "PENDING";

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{session?.user?.name || "Tutor"}</span>
                    </h1>
                    <p className="text-gray-400">Your tutor dashboard — manage your profile, subjects, and students.</p>
                </header>

                {/* Status Banner */}
                {isPending && (
                    <div className="mb-8 p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-4">
                        <Clock className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-yellow-300">Application Under Review</h3>
                            <p className="text-sm text-gray-400">Your tutor application is being reviewed. You&apos;ll get full access once approved.</p>
                        </div>
                        <Link href="/become-a-tutor/status" className="ml-auto text-sm text-yellow-400 hover:underline flex-shrink-0">
                            View Status <ArrowRight className="inline w-3 h-3" />
                        </Link>
                    </div>
                )}

                {isApproved && (
                    <div className="mb-8 p-5 rounded-xl border border-green-500/30 bg-green-500/5 flex items-center gap-4">
                        <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-green-300">You&apos;re Verified!</h3>
                            <p className="text-sm text-gray-400">Your tutor application has been approved. Students can now find and connect with you.</p>
                        </div>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard icon={<BookOpen className="w-5 h-5 text-blue-400" />} label="Subjects" value={String(profile?.subjects?.length || 0)} />
                    <StatCard icon={<Users className="w-5 h-5 text-purple-400" />} label="Students" value="0" />
                    <StatCard icon={<Award className="w-5 h-5 text-yellow-400" />} label="Sessions" value="0" />
                    <StatCard icon={<Sparkles className="w-5 h-5 text-green-400" />} label="Rating" value="—" />
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Profile Card */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Your Profile</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                                    {profile?.fullName?.charAt(0) || "T"}
                                </div>
                                <div>
                                    <p className="font-semibold">{profile?.fullName || session?.user?.name}</p>
                                    <p className="text-sm text-gray-400">{session?.user?.email}</p>
                                </div>
                            </div>
                            {profile?.bio && (
                                <p className="text-sm text-gray-400 pt-2 border-t border-gray-800">{profile.bio}</p>
                            )}
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Your Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                            {profile?.subjects?.map((s) => (
                                <span key={s} className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                                    {s}
                                </span>
                            )) || (
                                    <p className="text-gray-500 text-sm">No subjects selected yet.</p>
                                )}
                        </div>
                    </div>

                    {/* Getting Started */}
                    <div className="lg:col-span-2 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">Getting Started</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { step: "1", title: "Complete Profile", desc: "Add your bio, photo, and rate", done: !!profile?.bio },
                                { step: "2", title: "Set Availability", desc: "Choose your available time slots", done: false },
                                { step: "3", title: "Start Tutoring", desc: "Accept your first student request", done: false },
                            ].map((item) => (
                                <div key={item.step} className={`p-4 rounded-xl border ${item.done ? "border-green-500/30 bg-green-500/5" : "border-gray-800 bg-gray-800/20"}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.done ? "bg-green-500 text-white" : "bg-gray-700 text-gray-400"}`}>
                                            {item.done ? "✓" : item.step}
                                        </span>
                                        <span className="text-sm font-semibold">{item.title}</span>
                                    </div>
                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                </div>
                            ))}
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
