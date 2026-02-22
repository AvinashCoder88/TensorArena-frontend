"use client";

import Link from "next/link";
import { ArrowRight, Bot, Target, Play, Shield, Code2, GraduationCap, Video, Users } from "lucide-react";

const HIGHLIGHTED_EXPERIENCES = [
    {
        id: "robotics",
        title: "Grade-Specific Robotics Kits",
        description: "Hands-on, curriculum-aligned robotics kits delivered straight to your classroom or home. Build, code, and deploy physical AI agents.",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop",
        tags: ["Students", "Schools", "Hardware"],
        link: "/services/robotics",
        icon: Bot
    },
    {
        id: "grading",
        title: "AI Grading Assistant",
        description: "Upload question papers and handwritten answer sheets. Our Gemini 1.5 Pro pipeline grades exams instantly with logical reasoning and partial marks.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop",
        tags: ["Teachers", "Schools", "Automation"],
        link: "/teacher",
        icon: Target
    },
    {
        id: "arena",
        title: "Adaptive Coding Arena",
        description: "From Python basics to advanced GenAI agents, we generate the perfect challenge for your skill level in a secure sandbox.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
        tags: ["Coders", "Students", "Practice"],
        link: "/arena",
        icon: Code2
    },
    {
        id: "mentor",
        title: "Adaptive AI Mentor",
        description: "Your personal AI tutor that analyzes your code in real-time, pointing out logic gaps and suggesting optimizations.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
        tags: ["All Roles", "24/7 Support"],
        link: "/mentor",
        icon: Shield
    },
    {
        id: "interview",
        title: "Mock Interview Studio",
        description: "Full-scale simulations of coding, behavioral, and system design interviews with rigorous AI grading.",
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
        tags: ["Professionals", "Career"],
        link: "/mock-interview",
        icon: Video
    },
    {
        id: "tutor",
        title: "Expert Tutor Network",
        description: "Join our network of expert tutors or find the perfect match for your child. Track progress and build fundamental skills.",
        image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?q=80&w=2070&auto=format&fit=crop",
        tags: ["Parents", "Educators"],
        link: "/parents/dashboard",
        icon: Users
    }
];

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Header Section */}
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-gray-900/0 to-black/0" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        About <span className="text-blue-500/90">Us</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        Discover our suite of state-of-the-art tools and services. From instant AI grading to
                        grade-specific physical robotics kits, we are redefining how the world learns AI.
                    </p>
                </div>
            </div>

            {/* Visual Gallery Grid */}
            <div className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {HIGHLIGHTED_EXPERIENCES.map((exp) => (
                        <Link
                            key={exp.id}
                            href={exp.link}
                            className="group block relative rounded-3xl overflow-hidden bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent z-10" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    {exp.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 relative z-20 bg-gray-900/40 backdrop-blur-sm -mt-4 rounded-t-3xl border-t border-white/5">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                                    <exp.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                                    {exp.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {exp.description}
                                </p>
                                <div className="flex items-center text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                                    Explore Service
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-6 pb-32">
                <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 to-gray-900/40 border border-blue-500/20 p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <GraduationCap className="w-16 h-16 mx-auto text-blue-400 mb-6" />
                        <h2 className="text-4xl font-bold mb-4">Ready to start learning?</h2>
                        <p className="text-xl text-blue-100/70 mb-8">
                            Join thousands of students, teachers, and professionals mastering AI engineering one prompt at a time.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-100 transition-all hover:scale-105"
                        >
                            Create Your Free Account
                            <Play className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
