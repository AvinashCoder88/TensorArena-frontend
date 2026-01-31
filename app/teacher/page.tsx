"use client";

import React, { useState } from 'react';
import { ExamUploader } from '@/components/teacher/ExamUploader';
import { Users, Award, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Submission {
    student_name: string;
    score: number;
    status: string;
    summary: string;
    details?: string;
}

interface Ranking {
    name: string;
    score: number;
}

interface ClassInsights {
    average_score: number;
    highest_score: number;
    lowest_score: number;
    ranking: Ranking[];
    recommendations: string;
    common_mistakes?: string[];
}

export default function TeacherPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [insights, setInsights] = useState<ClassInsights | null>(null);
    const [generatingInsights, setGeneratingInsights] = useState(false);

    const handleUploadSuccess = async (result: Submission) => {
        setSubmissions(prev => [...prev, result]);

        // Auto-refresh insights if we have enough data (e.g., > 2) or manual trigger
        // For UX, let's keep it manual or auto?
        // Let's prompt user to "Analyze Class" once they are done uploading.
    };

    const generateClassInsights = async () => {
        setGeneratingInsights(true);
        try {
            const response = await fetch("http://localhost:8000/teacher/analyze-batch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ submissions })
            });
            const data = await response.json();
            setInsights(data);
        } catch (e: unknown) {
            console.error(e);
        } finally {
            setGeneratingInsights(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-7xl">

                <header className="mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Teacher Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Upload exam papers to automatically grade, rank students, and generate class-wide insights.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Upload & List */}
                    <div className="lg:col-span-1 space-y-6">
                        <ExamUploader onUploadSuccess={handleUploadSuccess} />

                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <FileTextIcon /> Uploaded Papers ({submissions.length})
                                </h3>
                                {submissions.length > 1 && (
                                    <button
                                        onClick={generateClassInsights}
                                        disabled={generatingInsights}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                                    >
                                        {generatingInsights ? "Analyzing..." : "Analyze Class"}
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                <AnimatePresence>
                                    {submissions.map((sub, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-semibold text-white">{sub.student_name || "Unknown"}</p>
                                                    <p className="text-xs text-gray-400">Status: {sub.status}</p>
                                                </div>
                                                <span className={`text - lg font - bold ${getScoreColor(sub.score)} `}>
                                                    {sub.score}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2">{sub.summary}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {submissions.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        No papers uploaded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Insights */}
                    <div className="lg:col-span-2">
                        {insights ? (
                            <div className="space-y-6 animate-fade-in">
                                {/* Top Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <StatCard
                                        label="Class Average"
                                        value={`${Math.round(insights.average_score)}% `}
                                        icon={<TrendingUp className="w-5 h-5 text-green-400" />}
                                    />
                                    <StatCard
                                        label="Highest Score"
                                        value={`${Math.round(insights.highest_score)}% `}
                                        icon={<Award className="w-5 h-5 text-yellow-400" />}
                                    />
                                    <StatCard
                                        label="Lowest Score"
                                        value={`${Math.round(insights.lowest_score)}% `}
                                        icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                                    />
                                </div>

                                {/* Ranking Table */}
                                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-400" />
                                        Class Leaderboard
                                    </h3>
                                    <div className="space-y-2">
                                        {insights.ranking?.map((student: Ranking, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className={`w - 6 h - 6 flex items - center justify - center rounded - full text - xs font - bold ${idx < 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'} `}>
                                                        {idx + 1}
                                                    </span>
                                                    <span>{student.name}</span>
                                                </div>
                                                <span className="font-mono text-blue-300">{student.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-purple-400" />
                                        AI Recommendations
                                    </h3>
                                    <div className="prose prose-invert max-w-none text-gray-300">
                                        <p>{insights.recommendations}</p>
                                    </div>

                                    {insights.common_mistakes && (
                                        <div className="mt-6">
                                            <h4 className="font-semibold text-red-300 mb-2">Common Mistakes</h4>
                                            <ul className="list-disc list-inside space-y-1 text-gray-400">
                                                {insights.common_mistakes.map((m: string, i: number) => (
                                                    <li key={i}>{m}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                                <div className="text-center max-w-md p-6">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <TrendingUp className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Insights Yet</h3>
                                    <p className="text-gray-500">
                                        Upload verified exam papers and click &quot;Analyze Class&quot; to generate detailed performance metrics and learning recommendations.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm text-gray-400">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

function FileTextIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
    )
}

function getScoreColor(score: number) {
    if (score >= 90) return "text-green-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
}
