"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Code2, Sparkles, GraduationCap, ArrowDown, BookOpen, Users, Briefcase, Layers, ClipboardCheck, TrendingUp } from "lucide-react";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/lib/services";

export default function Home() {
    useEffect(() => {
        // Restore scroll position if returning from a role link
        const savedScroll = sessionStorage.getItem("homeScrollY");
        if (savedScroll) {
            // slight delay to ensure layout is painted
            setTimeout(() => {
                window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "instant" });
            }, 10);
            sessionStorage.removeItem("homeScrollY");
        }
    }, []);
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-gray-900/0" />

                <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Learning Academy</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                            TensorArena <br />
                            <span className="text-blue-500">The AI Learning Academy</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Role-based tools for teaching, learning, and career growth. From class
                            insights to interview prep, we make AI learning structured, practical,
                            and measurable.
                        </p>

                        <div className="flex flex-col items-center justify-center space-y-4 pt-8">
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/services"
                                    className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
                                >
                                    Explore Services
                                    <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                                </Link>
                                <button
                                    onClick={() => {
                                        document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-8 py-4 rounded-full font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-colors flex items-center gap-2"
                                >
                                    Choose Your Role
                                    <ArrowDown className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 font-medium bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                                Built for classrooms, teams, and self-learners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
                    <p className="text-gray-400 text-lg">A clear, structured academy for every learning journey</p>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {[
                        { icon: ClipboardCheck, title: "Assess", desc: "Exams, grading, and validation at scale." },
                        { icon: BookOpen, title: "Teach", desc: "Lesson tools, content builders, and insights." },
                        { icon: Layers, title: "Learn", desc: "Tutors, study guides, and practice." },
                        { icon: TrendingUp, title: "Advance", desc: "Career paths and interview prep." },
                        { icon: Code2, title: "Build", desc: "Coding arena and system design training." },
                    ].map((pillar) => (
                        <div
                            key={pillar.title}
                            className="p-6 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400">
                                <pillar.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{pillar.title}</h3>
                            <p className="text-sm text-gray-400">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role Explorer */}
            <div id="roles" className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
                    <p className="text-gray-400 text-lg">Everything you need, organized by who you are</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { key: "teacher", icon: BookOpen, link: "/roles/teacher" },
                        { key: "student", icon: GraduationCap, link: "/roles/student" },
                        { key: "parent", icon: Users, link: "/roles/parent" },
                        { key: "professional", icon: Briefcase, link: "/roles/professional" },
                        { key: "coder", icon: Code2, link: "/roles/coder" },
                    ].map((role) => (
                        <Link
                            key={role.key}
                            href={role.link}
                            onClick={() => sessionStorage.setItem("homeScrollY", window.scrollY.toString())}
                            className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/20 group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                <role.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                {ROLE_LABELS[role.key as keyof typeof ROLE_LABELS]}
                            </h3>
                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                {ROLE_DESCRIPTIONS[role.key as keyof typeof ROLE_DESCRIPTIONS]}
                            </p>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-800 text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors"
                    >
                        Browse Full Services Catalog
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div id="how-it-works" className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How TensorArena Works</h2>
                    <p className="text-gray-400 text-lg">A clear, guided flow from intent to outcomes</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Users,
                            title: "Start with your role",
                            desc: "Teachers, students, parents, professionals, and coders each get tailored tools."
                        },
                        {
                            icon: Brain,
                            title: "Use targeted services",
                            desc: "From grading and tutoring to interview prep and coding practice."
                        },
                        {
                            icon: TrendingUp,
                            title: "See measurable progress",
                            desc: "Track learning, identify gaps, and improve outcomes with insights."
                        }
                    ].map((step) => (
                        <div
                            key={step.title}
                            className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    {[
                        { label: "Role-based navigation", value: "5 roles" },
                        { label: "Core learning pillars", value: "Assess · Teach · Learn" },
                        { label: "Services catalog", value: "Growing weekly" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border border-gray-800 bg-black/40 p-6 text-center"
                        >
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-500 mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
