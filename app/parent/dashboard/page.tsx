"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Users, BookOpen, Search, UserPlus, FolderOpen, FileText, ChevronRight, Award, CheckCircle, Loader2, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GradedQuestion {
    q_num: string;
    max_marks: number;
    scored: number;
    remarks: string;
}

interface GradedResult {
    id: string;
    totalScore: number;
    maxScore: number;
    percentage: number;
    questionsJson: string;
    overallRemarks: string | null;
}

interface ResultData {
    id: string;
    examTitle: string;
    grade: string;
    division: string;
    fileUrl: string;
    gradedResult: GradedResult | null;
    createdAt: string;
}

interface ChildData {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
}

type View = "dashboard" | "subjects" | "papers" | "result-detail";

export default function ParentDashboardPage() {
    const { data: session } = useSession();

    const [children, setChildren] = useState<ChildData[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<string>("");

    const [view, setView] = useState<View>("dashboard");
    const [resultsData, setResultsData] = useState<Record<string, ResultData[]>>({});
    const [loadingResults, setLoadingResults] = useState(false);

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);

    // Link Child Modal
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [childEmail, setChildEmail] = useState("");
    const [linking, setLinking] = useState(false);
    const [linkMsg, setLinkMsg] = useState("");

    const fetchChildren = useCallback(async () => {
        try {
            const res = await fetch("/api/parent/children");
            const data = await res.json();
            if (Array.isArray(data)) {
                setChildren(data);
                if (data.length > 0 && !selectedChildId) {
                    setSelectedChildId(data[0].id);
                }
            }
        } catch (err) { console.error(err); }
    }, [selectedChildId]);

    useEffect(() => { fetchChildren(); }, [fetchChildren]);

    useEffect(() => {
        if (!selectedChildId) return;
        const fetchResults = async () => {
            setLoadingResults(true);
            try {
                const res = await fetch(`/api/parent/results?childId=${selectedChildId}`);
                const data = await res.json();
                setResultsData(data);
            } catch (err) { console.error(err); }
            finally { setLoadingResults(false); }
        };
        fetchResults();
    }, [selectedChildId]);

    const handleLinkChild = async () => {
        setLinking(true);
        setLinkMsg("");
        try {
            const res = await fetch("/api/parent/children", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ childEmail }),
            });
            const data = await res.json();
            setLinkMsg(data.message);
            if (res.ok) {
                setChildEmail("");
                fetchChildren();
                setTimeout(() => setShowLinkModal(false), 1500);
            }
        } catch (err) { console.error(err); }
        finally { setLinking(false); }
    };

    const openSubject = (subject: string) => {
        setSelectedSubject(subject);
        setView("papers");
    };

    const openResult = (result: ResultData) => {
        setSelectedResult(result);
        setView("result-detail");
    };

    const selectedChild = children.find(c => c.id === selectedChildId);

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-5xl">

                {/* Header & Child Selector */}
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{session?.user?.name || "Parent"}</span>
                        </h1>
                        <p className="text-gray-400">Track your child&apos;s progress and view graded answer sheets.</p>
                    </div>

                    {children.length > 0 && (
                        <div className="flex items-center gap-3 bg-gray-900/60 p-2 rounded-xl border border-gray-800">
                            <Users className="w-5 h-5 text-emerald-400 ml-2" />
                            <select
                                value={selectedChildId}
                                onChange={(e) => {
                                    setSelectedChildId(e.target.value);
                                    setView("dashboard");
                                }}
                                className="bg-transparent text-white text-sm font-medium focus:outline-none pr-4 py-1 border-none cursor-pointer"
                            >
                                {children.map(c => (
                                    <option key={c.id} value={c.id} className="bg-gray-900">{c.name || c.email}</option>
                                ))}
                            </select>
                            <button onClick={() => setShowLinkModal(true)} className="p-1.5 hover:bg-gray-800 rounded-md transition-colors" title="Link another child">
                                <PlusIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    )}
                </header>

                {/* Breadcrumb Navigation */}
                {children.length > 0 && view !== "dashboard" && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 pb-4 border-b border-gray-800/50">
                        <button onClick={() => setView("dashboard")} className="hover:text-white transition-colors">Dashboard</button>
                        {selectedSubject && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <button onClick={() => setView("papers")} className="hover:text-white transition-colors">
                                    {selectedSubject}
                                </button>
                            </>
                        )}
                        {view === "result-detail" && selectedResult && (
                            <>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-white">{selectedResult.examTitle}</span>
                            </>
                        )}
                    </div>
                )}

                {/* ============ NO CHILDREN VIEW ============ */}
                {children.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                        <UserPlus className="w-12 h-12 mx-auto mb-4 text-emerald-500 opacity-80" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Connect Your Child</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Link your child&apos;s TensorArena account to monitor their graded answer sheets, academic progress, and teacher feedback in real-time.
                        </p>
                        <button onClick={() => setShowLinkModal(true)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20">
                            Link Child Account
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ============ DASHBOARD VIEW ============ */}
                        {view === "dashboard" && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <StatCard icon={<FolderOpen className="w-5 h-5 text-emerald-400" />} label="Subjects" value={String(Object.keys(resultsData).length)} />
                                    <StatCard icon={<FileText className="w-5 h-5 text-blue-400" />} label="Graded Papers" value={String(Object.values(resultsData).flat().length)} />
                                    <StatCard icon={<Award className="w-5 h-5 text-purple-400" />} label="Overall Avg" value="—" />
                                    <StatCard icon={<Search className="w-5 h-5 text-yellow-400" />} label="Tutors" value="0" />
                                </div>

                                {/* Subjects Folders */}
                                <div className="mb-6 flex justify-between items-center">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-blue-400" />
                                        {selectedChild?.name?.split(' ')[0] || "Child"}&apos;s Subjects
                                    </h2>
                                </div>

                                {loadingResults ? (
                                    <div className="flex justify-center py-12 border border-gray-800 border-dashed rounded-2xl"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                                ) : Object.keys(resultsData).length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-gray-900/20">
                                        <p className="text-gray-500">No graded papers available for this student yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-3 gap-4 mb-10">
                                        {Object.entries(resultsData).map(([subject, papers]) => (
                                            <div key={subject}
                                                className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-emerald-500/50 transition-all flex flex-col justify-between group"
                                                onClick={() => openSubject(subject)}
                                            >
                                                <div>
                                                    <div className="p-3 rounded-xl bg-emerald-500/10 inline-block mb-4 group-hover:scale-110 transition-transform">
                                                        <FolderOpen className="w-6 h-6 text-emerald-400" />
                                                    </div>
                                                    <h3 className="font-bold text-xl mb-1">{subject}</h3>
                                                    <p className="text-sm text-gray-400">{papers[0]?.grade} — {papers[0]?.division}</p>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-sm font-medium">
                                                    <span className="text-gray-400">{papers.length} Papers</span>
                                                    <span className="flex items-center gap-1 text-emerald-400">View <ChevronRight className="w-4 h-4" /></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Find Tutors Banner */}
                                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800/50 rounded-2xl p-6  flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <Search className="w-5 h-5 text-blue-400" /> Find a Tutor for {selectedChild?.name?.split(' ')[0] || "your child"}
                                        </h3>
                                        <p className="text-sm text-blue-200/70 max-w-md">
                                            Need extra help? Browse our network of verified experts to provide personalized 1-on-1 tutoring.
                                        </p>
                                    </div>
                                    <Link href="/tutors" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors whitespace-nowrap shadow-lg shadow-blue-500/20">
                                        Browse Tutors
                                    </Link>
                                </div>
                            </motion.div>
                        )}

                        {/* ============ PAPERS VIEW ============ */}
                        {view === "papers" && selectedSubject && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <header className="mb-8">
                                    <h1 className="text-2xl font-bold mb-1">{selectedSubject} Papers</h1>
                                    <p className="text-gray-400">Review {selectedChild?.name || "your child"}&apos;s graded submissions.</p>
                                </header>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {resultsData[selectedSubject]?.map((result) => (
                                        <div key={result.id}
                                            className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-emerald-500/40 transition-all"
                                            onClick={() => openResult(result)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                                                        <FileText className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-lg">{result.examTitle}</h4>
                                                        <p className="text-xs text-gray-500">{new Date(result.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {result.gradedResult && (
                                                    <div className="text-right">
                                                        <span className={`text-xl font-bold ${getScoreColor(result.gradedResult.percentage)}`}>
                                                            {result.gradedResult.totalScore}/{result.gradedResult.maxScore}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-sm text-emerald-400 flex items-center gap-1">Detailed Report <ChevronRight className="w-3 h-3" /></p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ============ RESULT DETAIL VIEW ============ */}
                        {view === "result-detail" && selectedResult?.gradedResult && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <header className="mb-6 border-b border-gray-800 pb-6 flex justify-between items-end">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">{selectedResult.examTitle}</h1>
                                        <p className="text-gray-400">{selectedSubject} · {new Date(selectedResult.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 mb-1">Final Score</p>
                                        <span className={`text-3xl font-bold ${getScoreColor(selectedResult.gradedResult.percentage)}`}>
                                            {selectedResult.gradedResult.totalScore}/{selectedResult.gradedResult.maxScore}
                                            <span className="text-xl ml-2">({Math.round(selectedResult.gradedResult.percentage)}%)</span>
                                        </span>
                                    </div>
                                </header>

                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Left: Remarks */}
                                    <div className="space-y-6">
                                        {selectedResult.gradedResult.overallRemarks && (
                                            <div className="bg-emerald-900/10 border border-emerald-800/50 rounded-2xl p-6">
                                                <h3 className="font-bold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-400" /> Teacher&apos;s Feedback</h3>
                                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedResult.gradedResult.overallRemarks}</p>
                                            </div>
                                        )}

                                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                                            <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-blue-400" /> Scanned Answer Sheet</h3>
                                            <a href={selectedResult.fileUrl} target="_blank" rel="noreferrer" className="block text-center p-4 border border-gray-700 border-dashed rounded-xl hover:bg-gray-800 transition-colors">
                                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <span className="text-sm text-blue-400">View Uploaded Image/PDF</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right: Question Breakdown */}
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">Question Breakdown</h3>
                                        {(JSON.parse(selectedResult.gradedResult.questionsJson) as GradedQuestion[]).map((q, idx) => (
                                            <div key={idx} className="p-5 bg-gray-900/60 rounded-xl border border-gray-800 relative overflow-hidden">
                                                {/* Progress background bar */}
                                                <div className="absolute inset-0 opacity-10"
                                                    style={{
                                                        width: `${(q.scored / Math.max(q.max_marks, 1)) * 100}%`,
                                                        backgroundColor: (q.scored / Math.max(q.max_marks, 1)) >= 0.7 ? '#10b981' : (q.scored / Math.max(q.max_marks, 1)) >= 0.4 ? '#eab308' : '#ef4444'
                                                    }}
                                                />

                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-bold text-lg">Question {q.q_num}</span>
                                                        <span className={`font-mono text-lg font-bold ${getScoreColor((q.scored / Math.max(q.max_marks, 1)) * 100)}`}>
                                                            {q.scored} / {q.max_marks}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 leading-relaxed bg-black/40 p-3 rounded-lg border border-gray-800/50">
                                                        {q.remarks}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}


                {/* ============ LINK CHILD MODAL ============ */}
                <AnimatePresence>
                    {showLinkModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowLinkModal(false)}>
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold">Link Child Account</h2>
                                    <button onClick={() => setShowLinkModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-400">Enter the email address your child uses to log into TensorArena.</p>
                                    <input value={childEmail} onChange={(e) => setChildEmail(e.target.value)} placeholder="student@example.com"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />

                                    {linkMsg && (
                                        <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${linkMsg.includes("success") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                            {linkMsg.includes("success") ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {linkMsg}
                                        </div>
                                    )}

                                    <button onClick={handleLinkChild} disabled={linking || !childEmail}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors shadow-lg shadow-emerald-500/20">
                                        {linking ? "Linking..." : "Connect Account"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-gray-900/60 border border-gray-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm text-gray-400">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    );
}

function getScoreColor(percentage: number) {
    if (percentage >= 90) return "text-emerald-400";
    if (percentage >= 70) return "text-blue-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
}
