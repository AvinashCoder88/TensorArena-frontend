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
            <div className="relative overflow-hidden min-h-screen flex items-center">
                {/* Background Video/Motion Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-50"
                    >
                        <source src="https://cdn.pixabay.com/video/2020/09/25/51152-464522851_large.mp4" type="video/mp4" />
                    </video>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-gray-900/0 z-5" />

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Learning Academy</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                            TensorArena <br />
                            <span className="text-blue-500">The Power of AI</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Role-based tools for teaching, learning, and career growth. From class
                            insights to interview prep, we make AI learning structured.
                        </p>

                        <div className="flex flex-col items-center justify-center space-y-6 pt-8">
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <Link
                                    href="/about"
                                    className="group relative px-10 py-5 bg-white text-black rounded-full font-black text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                                >
                                    About Us
                                    <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <button
                                    onClick={() => {
                                        document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-10 py-5 rounded-full font-black text-xl border-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all flex items-center gap-3"
                                >
                                    Choose Your Role
                                    <ArrowDown className="w-6 h-6 animate-bounce" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-24 relative max-w-6xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
                            alt="High-tech AI learning environment"
                            className="w-full object-cover h-[400px] md:h-[700px] opacity-70 hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute bottom-10 left-10 right-10 z-20 flex flex-wrap gap-6 justify-between items-end">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] max-w-sm">
                                <div className="text-blue-400 font-black text-lg mb-2">Grade-Specific Kits</div>
                                <div className="text-gray-300 leading-relaxed">Physical robotics hardware synchronized with our online AI curriculum for grades 1-12.</div>
                            </div>
                            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] max-w-sm hidden md:block">
                                <div className="text-purple-400 font-black text-lg mb-2">Instant AI Grading</div>
                                <div className="text-gray-300 leading-relaxed">Upload paper exams and let Gemini 1.5 evaluate logic, steps, and reasoning.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Pillars / Services */}
            <div className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Our Core Services</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">A high-tech approach to every stage of the learning lifecycle</p>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {[
                        {
                            icon: ClipboardCheck,
                            title: "Assess",
                            desc: "Exams, grading, and validation at scale.",
                            color: "text-blue-400",
                            image: "https://images.unsplash.com/photo-1454165833767-0266b19672cd?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            icon: BookOpen,
                            title: "Teach",
                            desc: "Lesson tools, content builders, and insights.",
                            color: "text-purple-400",
                            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            icon: Layers,
                            title: "Learn",
                            desc: "Tutors, study guides, and practice.",
                            color: "text-emerald-400",
                            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            icon: TrendingUp,
                            title: "Advance",
                            desc: "Career paths and interview prep.",
                            color: "text-orange-400",
                            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            icon: Code2,
                            title: "Build",
                            desc: "Coding arena and system design training.",
                            color: "text-blue-500",
                            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
                        },
                    ].map((pillar) => (
                        <div
                            key={pillar.title}
                            className="group relative h-[320px] rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={pillar.image}
                                alt={pillar.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                            <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                                <div className={`w-12 h-12 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-4 ${pillar.color}`}>
                                    <pillar.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                                <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                                    {pillar.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Role Explorer */}
            <div id="roles" className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Choose Your Role</h2>
                    <p className="text-gray-400 text-lg">Everything you need, organized by who you are</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            key: "teacher",
                            icon: BookOpen,
                            link: "/roles/teacher",
                            image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            key: "student",
                            icon: GraduationCap,
                            link: "/roles/student",
                            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            key: "parent",
                            icon: Users,
                            link: "/roles/parent",
                            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                        },
                        {
                            key: "professional",
                            icon: Briefcase,
                            link: "/roles/professional",
                            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
                        },
                        {
                            key: "coder",
                            icon: Code2,
                            link: "/roles/coder",
                            image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop"
                        },
                    ].map((role) => (
                        <Link
                            key={role.key}
                            href={role.link}
                            onClick={() => sessionStorage.setItem("homeScrollY", window.scrollY.toString())}
                            className="group flex flex-col overflow-hidden rounded-3xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/20"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={role.image}
                                    alt={ROLE_LABELS[role.key as keyof typeof ROLE_LABELS]}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 z-20">
                                    <div className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-blue-400">
                                        <role.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col relative z-20">
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                    {ROLE_LABELS[role.key as keyof typeof ROLE_LABELS]}
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-6 flex-1 group-hover:text-gray-300 transition-colors">
                                    {ROLE_DESCRIPTIONS[role.key as keyof typeof ROLE_DESCRIPTIONS]}
                                </p>
                                <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-white transition-colors">
                                    Continue as {ROLE_LABELS[role.key as keyof typeof ROLE_LABELS]}
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    >
                        Browse Full Services Catalog
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* How it Works Section */}
            <div id="how-it-works" className="relative container mx-auto px-6 py-32 border-t border-gray-900 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
                </div>

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">How TensorArena Works</h2>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">A clear, guided flow from intent to outcomes</p>
                </div>

                <div className="relative z-10 grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Users,
                            title: "Start with your role",
                            desc: "Teachers, students, parents, professionals, and coders each get tailored tools.",
                            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
                            num: "01"
                        },
                        {
                            icon: Brain,
                            title: "Use targeted services",
                            desc: "From AI-assisted grading and personalized tutoring to professional interview prep.",
                            image: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2070&auto=format&fit=crop",
                            num: "02"
                        },
                        {
                            icon: TrendingUp,
                            title: "See measurable progress",
                            desc: "Identify learning gaps instantly and track real-world results with deep-dive insights.",
                            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
                            num: "03"
                        }
                    ].map((step, idx) => (
                        <div
                            key={step.title}
                            className="group relative flex flex-col"
                        >
                            <div className="relative h-72 rounded-3xl overflow-hidden mb-8 border border-white/5 shadow-2xl transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-blue-500/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                                <div className="absolute top-6 left-6 text-5xl font-black text-white/10 group-hover:text-blue-500/30 transition-colors">
                                    {step.num}
                                </div>
                                <div className="absolute bottom-6 left-6 w-12 h-12 rounded-xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-blue-400 border border-white/10">
                                    <step.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {step.desc}
                            </p>

                            {idx < 2 && (
                                <div className="hidden lg:block absolute -right-6 top-1/4 translate-x-1/2 z-20">
                                    <ArrowRight className="w-8 h-8 text-gray-800" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-6">
                    {[
                        { label: "Role-based navigation", value: "5 roles" },
                        { label: "Core learning pillars", value: "Assess · Teach · Learn" },
                        { label: "Services catalog", value: "Growing weekly" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="text-center p-6 rounded-2xl bg-white/5 border border-white/5"
                        >
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">{stat.label}</div>
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
