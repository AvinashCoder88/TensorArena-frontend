"use client";

import React, { useState, useEffect } from 'react';
import { FolderOpen, FileText, Award, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

type View = "subjects" | "papers" | "result-detail";

export default function StudentResultsPage() {
    // const { data: session } = useSession();
    const [view, setView] = useState<View>("subjects");
    const [resultsData, setResultsData] = useState<Record<string, ResultData[]>>({});
    const [loading, setLoading] = useState(true);

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedResult, setSelectedResult] = useState<ResultData | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/student/results");
                const data = await res.json();
                setResultsData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const openSubject = (subject: string) => {
        setSelectedSubject(subject);
        setView("papers");
    };

    const openResult = (result: ResultData) => {
        setSelectedResult(result);
        setView("result-detail");
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-5xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <button onClick={() => setView("subjects")} className="hover:text-white transition-colors">My Subjects</button>
                    {view !== "subjects" && selectedSubject && (
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

                {/* ============ SUBJECTS FOLDER VIEW ============ */}
                {view === "subjects" && (
                    <>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                Graded Papers
                            </h1>
                            <p className="text-gray-400">View your graded answer sheets and teacher feedback organized by subject.</p>
                        </header>

                        {loading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                        ) : Object.keys(resultsData).length === 0 ? (
                            <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl">
                                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-bold text-gray-300 mb-2">No Results Yet</h3>
                                <p className="text-gray-500">Your graded answer sheets will appear here once your teacher uploads them.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-4">
                                {Object.entries(resultsData).map(([subject, papers]) => (
                                    <motion.div key={subject} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all flex flex-col justify-between"
                                        onClick={() => openSubject(subject)}
                                    >
                                        <div>
                                            <div className="p-3 rounded-xl bg-blue-500/10 inline-block mb-4">
                                                <FolderOpen className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <h3 className="font-bold text-xl mb-1">{subject}</h3>
                                            <p className="text-sm text-gray-400">{papers[0]?.grade} — {papers[0]?.division}</p>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-400">{papers.length} {papers.length === 1 ? 'Paper' : 'Papers'}</span>
                                            <span className="flex items-center gap-1 text-blue-400">View All <ChevronRight className="w-4 h-4" /></span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ============ PAPERS VIEW ============ */}
                {view === "papers" && selectedSubject && (
                    <>
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">{selectedSubject}</h1>
                            <p className="text-gray-400">Select a graded paper to view your scores and remarks.</p>
                        </header>

                        <div className="grid md:grid-cols-2 gap-4">
                            {resultsData[selectedSubject]?.map((result) => (
                                <motion.div key={result.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-green-500/40 transition-all"
                                    onClick={() => openResult(result)}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-500/10 p-2 rounded-lg">
                                                <FileText className="w-5 h-5 text-green-400" />
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
                                    <p className="text-sm text-blue-400 flex items-center gap-1">View Details <ChevronRight className="w-3 h-3" /></p>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* ============ RESULT DETAIL VIEW ============ */}
                {view === "result-detail" && selectedResult?.gradedResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                                    <div className="bg-blue-900/10 border border-blue-800/50 rounded-2xl p-6">
                                        <h3 className="font-bold mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-blue-400" /> Teacher&apos;s Remarks</h3>
                                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedResult.gradedResult.overallRemarks}</p>
                                    </div>
                                )}

                                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Your Answer Sheet</h3>
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
                                                backgroundColor: (q.scored / Math.max(q.max_marks, 1)) >= 0.7 ? '#22c55e' : (q.scored / Math.max(q.max_marks, 1)) >= 0.4 ? '#eab308' : '#ef4444'
                                            }}
                                        />

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-bold text-lg">Q{q.q_num}</span>
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

            </div>
        </div>
    );
}

function getScoreColor(percentage: number) {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-blue-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
}
