"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Users, BookOpen, Award, TrendingUp, AlertTriangle, Plus, ChevronRight, FileText, Loader2, CheckCircle, FolderOpen, GraduationCap, X, UserPlus, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface AnswerSheetData {
    id: string;
    fileUrl: string;
    student: { id: string; name: string | null; email: string | null };
    gradedResult: GradedResult | null;
    createdAt: string;
}

interface QuestionPaperData {
    id: string;
    title: string;
    fileUrl: string;
    totalMarks: number;
    markScheme: string | null;
    extractedText: string | null;
    answerSheets: AnswerSheetData[];
    createdAt: string;
}

interface ClassroomData {
    id: string;
    division: { id: string; name: string; grade: { id: string; name: string } };
    subject: { id: string; name: string };
    questionPapers: QuestionPaperData[];
}

type View = "classes" | "class-detail" | "paper-detail" | "grade-result";

export default function TeacherPage() {
    // const { data: session } = useSession();
    const [view, setView] = useState<View>("classes");
    const [classrooms, setClassrooms] = useState<ClassroomData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClassroom, setSelectedClassroom] = useState<ClassroomData | null>(null);
    const [selectedPaper, setSelectedPaper] = useState<QuestionPaperData | null>(null);
    const [selectedResult, setSelectedResult] = useState<AnswerSheetData | null>(null);

    // Create classroom modal
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [gradeName, setGradeName] = useState("");
    const [divisionName, setDivisionName] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [creating, setCreating] = useState(false);

    // Enroll student modal
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollEmail, setEnrollEmail] = useState("");
    const [enrolling, setEnrolling] = useState(false);
    const [enrollMsg, setEnrollMsg] = useState("");
    const [syncingERP, setSyncingERP] = useState(false);
    const [syncMsg, setSyncMsg] = useState("");
    const [importingCSV, setImportingCSV] = useState(false);
    const [importMsg, setImportMsg] = useState("");

    // Upload states
    const [uploadingPaper, setUploadingPaper] = useState(false);
    const [uploadingAnswer, setUploadingAnswer] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [students, setStudents] = useState<{ id: string; name: string | null; email: string | null }[]>([]);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const fetchClassrooms = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/teacher/classes");
            const data = await res.json();
            setClassrooms(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchClassrooms(); }, [fetchClassrooms]);

    const fetchStudents = useCallback(async (divisionId: string) => {
        try {
            const res = await fetch(`/api/teacher/students?divisionId=${divisionId}`);
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    }, []);

    const handleCreateClassroom = async () => {
        setCreating(true);
        try {
            await fetch("/api/teacher/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gradeName, divisionName, subjectName }),
            });
            setShowCreateModal(false);
            setGradeName(""); setDivisionName(""); setSubjectName("");
            fetchClassrooms();
        } catch (err) { console.error(err); }
        finally { setCreating(false); }
    };

    const handleEnrollStudent = async () => {
        if (!selectedClassroom) return;
        setEnrolling(true);
        setEnrollMsg("");
        try {
            const res = await fetch("/api/teacher/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentEmail: enrollEmail, divisionId: selectedClassroom.division.id }),
            });
            const data = await res.json();
            setEnrollMsg(data.message);
            if (res.ok) {
                setEnrollEmail("");
                fetchStudents(selectedClassroom.division.id);
            }
        } catch (err) { console.error(err); }
        finally { setEnrolling(false); }
    };

    const handleSyncERP = async () => {
        setSyncingERP(true);
        setSyncMsg("");
        try {
            const res = await fetch("/api/integrations/erp", { method: "POST" });
            const data = await res.json();
            setSyncMsg(data.message || "Sync complete.");
            if (selectedClassroom) {
                fetchStudents(selectedClassroom.division.id);
            }
        } catch (err) {
            console.error(err);
            setSyncMsg("Sync failed.");
        } finally {
            setSyncingERP(false);
        }
    };

    const parseCsv = (text: string) => {
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length === 0) return [];
        const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const nameIndex = header.indexOf("name");
        const emailIndex = header.indexOf("email");
        if (emailIndex === -1) return [];
        return lines.slice(1).map((line) => {
            const parts = line.split(",").map((p) => p.trim());
            return {
                name: nameIndex >= 0 ? parts[nameIndex] : "",
                email: parts[emailIndex],
            };
        }).filter((s) => s.email);
    };

    const handleImportCSV = async (file: File) => {
        if (!selectedClassroom) return;
        setImportingCSV(true);
        setImportMsg("");
        try {
            const text = await file.text();
            const roster = parseCsv(text);
            if (roster.length === 0) {
                setImportMsg("No valid students found. CSV must include an email column.");
                return;
            }
            const res = await fetch("/api/teacher/roster/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ divisionId: selectedClassroom.division.id, students: roster }),
            });
            const data = await res.json();
            setImportMsg(`Imported ${data.imported || 0} students.`);
            fetchStudents(selectedClassroom.division.id);
        } catch (err) {
            console.error(err);
            setImportMsg("CSV import failed.");
        } finally {
            setImportingCSV(false);
        }
    };

    const handleUploadQuestionPaper = async (file: File) => {
        if (!selectedClassroom) return;
        setUploadingPaper(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`${API_URL}/teacher/extract-paper`, { method: "POST", body: formData });
            const extraction = await res.json();

            if (!res.ok) throw new Error(extraction.detail || "Failed to extract paper");

            // Save to DB
            await fetch("/api/teacher/papers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    classroomId: selectedClassroom.id,
                    title: extraction.title || "Untitled Exam",
                    fileUrl: extraction.file_url,
                    extractedText: extraction.full_text,
                    markScheme: extraction.mark_scheme,
                    totalMarks: extraction.total_marks,
                }),
            });
            fetchClassrooms();
        } catch (err) { console.error(err); }
        finally { setUploadingPaper(false); }
    };

    const handleGradeAnswer = async (file: File) => {
        if (!selectedPaper || !selectedStudentId) return;
        setUploadingAnswer(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("question_paper_text", selectedPaper.extractedText || "");
            formData.append("mark_scheme", selectedPaper.markScheme || "[]");
            formData.append("total_marks", String(selectedPaper.totalMarks));
            formData.append("student_id", selectedStudentId);
            formData.append("question_paper_id", selectedPaper.id);

            const res = await fetch(`${API_URL}/teacher/grade-answer`, { method: "POST", body: formData });
            const result = await res.json();

            if (!res.ok) throw new Error(result.detail || "Failed to grade");

            // Save to DB
            await fetch("/api/teacher/results", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionPaperId: selectedPaper.id,
                    studentId: selectedStudentId,
                    fileUrl: result.file_url,
                    grading: result.grading,
                }),
            });
            fetchClassrooms();
        } catch (err) { console.error(err); }
        finally { setUploadingAnswer(false); }
    };

    const openClassDetail = (classroom: ClassroomData) => {
        setSelectedClassroom(classroom);
        fetchStudents(classroom.division.id);
        setView("class-detail");
    };

    const openPaperDetail = (paper: QuestionPaperData) => {
        setSelectedPaper(paper);
        setView("paper-detail");
    };

    const openResult = (sheet: AnswerSheetData) => {
        setSelectedResult(sheet);
        setView("grade-result");
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-7xl">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <button onClick={() => setView("classes")} className="hover:text-white transition-colors">Classes</button>
                    {view !== "classes" && selectedClassroom && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <button onClick={() => setView("class-detail")} className="hover:text-white transition-colors">
                                {selectedClassroom.division.grade.name} / {selectedClassroom.division.name} / {selectedClassroom.subject.name}
                            </button>
                        </>
                    )}
                    {(view === "paper-detail" || view === "grade-result") && selectedPaper && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <button onClick={() => setView("paper-detail")} className="hover:text-white transition-colors">
                                {selectedPaper.title}
                            </button>
                        </>
                    )}
                    {view === "grade-result" && selectedResult && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-white">{selectedResult.student.name || selectedResult.student.email}</span>
                        </>
                    )}
                </div>

                {/* ============ CLASSES VIEW ============ */}
                {view === "classes" && (
                    <>
                        <header className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                    Teacher Dashboard
                                </h1>
                                <p className="text-gray-400">Manage your classes, upload papers, and grade answer sheets with AI.</p>
                            </div>
                            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition-colors">
                                <Plus className="w-4 h-4" /> New Class
                            </button>
                        </header>

                        {loading ? (
                            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
                        ) : classrooms.length === 0 ? (
                            <div className="text-center py-24 border border-dashed border-gray-800 rounded-2xl">
                                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <h3 className="text-xl font-bold text-gray-300 mb-2">No Classes Yet</h3>
                                <p className="text-gray-500 mb-6">Create your first class to start uploading question papers and grading answer sheets.</p>
                                <button onClick={() => setShowCreateModal(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium transition-colors">Create Class</button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {classrooms.map((c) => (
                                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500/50 transition-all"
                                        onClick={() => openClassDetail(c)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-2.5 rounded-xl bg-blue-500/10"><BookOpen className="w-5 h-5 text-blue-400" /></div>
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <h3 className="font-bold text-lg mb-1">{c.subject.name}</h3>
                                        <p className="text-sm text-gray-400">{c.division.grade.name} — {c.division.name}</p>
                                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {c.questionPapers.length} papers</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {c.questionPapers.reduce((acc, p) => acc + p.answerSheets.length, 0)} graded</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ============ CLASS DETAIL VIEW ============ */}
                {view === "class-detail" && selectedClassroom && (
                    <>
                        <header className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {selectedClassroom.subject.name}
                                    <span className="text-gray-400 font-normal ml-2 text-lg">
                                        {selectedClassroom.division.grade.name} — {selectedClassroom.division.name}
                                    </span>
                                </h1>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSyncERP}
                                    disabled={syncingERP}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors disabled:opacity-60"
                                >
                                    {syncingERP ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    Sync from ERP
                                </button>
                                <button onClick={() => setShowEnrollModal(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm transition-colors">
                                    <UserPlus className="w-4 h-4" /> Add Student
                                </button>
                            </div>
                        </header>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left: Students + Upload */}
                            <div className="space-y-4">
                                {/* Students list */}
                                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
                                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Students ({students.length})</h3>
                                    {syncMsg && <p className="text-xs text-gray-500 mb-2">{syncMsg}</p>}
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                        {students.map((s) => (
                                            <div key={s.id} className="text-sm p-2 bg-gray-800/50 rounded-lg flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                    {(s.name || s.email || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <span className="truncate">{s.name || s.email}</span>
                                            </div>
                                        ))}
                                        {students.length === 0 && <p className="text-xs text-gray-500">No students enrolled yet.</p>}
                                    </div>
                                </div>

                                {/* CSV import */}
                                <div
                                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${importingCSV ? "border-blue-500 bg-blue-500/5" : "border-gray-700 hover:border-blue-500/50"}`}
                                    onClick={() => !importingCSV && document.getElementById("csv-upload")?.click()}
                                >
                                    <input
                                        type="file"
                                        id="csv-upload"
                                        className="hidden"
                                        accept=".csv"
                                        onChange={(e) => { if (e.target.files?.[0]) handleImportCSV(e.target.files[0]); }}
                                    />
                                    {importingCSV ? <Loader2 className="w-6 h-6 mx-auto text-blue-500 animate-spin mb-2" /> : <Upload className="w-6 h-6 mx-auto text-blue-400 mb-2" />}
                                    <p className="text-sm font-semibold">Import Students via CSV</p>
                                    <p className="text-xs text-gray-500 mt-1">CSV with columns: name,email</p>
                                    {importMsg && <p className="text-xs text-gray-500 mt-2">{importMsg}</p>}
                                </div>

                                {/* Upload question paper */}
                                <div className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${uploadingPaper ? "border-blue-500 bg-blue-500/5" : "border-gray-700 hover:border-blue-500/50"}`}
                                    onClick={() => !uploadingPaper && document.getElementById("qp-upload")?.click()}>
                                    <input type="file" id="qp-upload" className="hidden" accept=".pdf,image/*"
                                        onChange={(e) => { if (e.target.files?.[0]) handleUploadQuestionPaper(e.target.files[0]); }} />
                                    {uploadingPaper ? <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin mb-2" /> : <Upload className="w-8 h-8 mx-auto text-blue-400 mb-2" />}
                                    <p className="text-sm font-semibold">{uploadingPaper ? "Extracting Questions..." : "Upload Question Paper"}</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF or image — AI will extract questions & marks</p>
                                </div>
                            </div>

                            {/* Right: Question Papers */}
                            <div className="lg:col-span-2">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400" /> Question Papers</h3>
                                {selectedClassroom.questionPapers.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl text-gray-500">
                                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                        <p>No question papers uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedClassroom.questionPapers.map((paper) => (
                                            <div key={paper.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-purple-500/40 transition-all"
                                                onClick={() => openPaperDetail(paper)}>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold">{paper.title}</h4>
                                                        <p className="text-xs text-gray-400 mt-1">Total: {paper.totalMarks} marks · {paper.answerSheets.length} sheets graded</p>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ============ PAPER DETAIL VIEW ============ */}
                {view === "paper-detail" && selectedPaper && selectedClassroom && (
                    <>
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold mb-1">{selectedPaper.title}</h1>
                            <p className="text-gray-400 text-sm">Total marks: {selectedPaper.totalMarks} · {selectedPaper.answerSheets.length} answer sheets graded</p>
                        </header>

                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left: Upload answer sheet */}
                            <div className="space-y-4">
                                <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
                                    <h3 className="font-bold text-sm mb-3">Grade Answer Sheet</h3>
                                    <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="">Select student...</option>
                                        {students.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name || s.email}</option>
                                        ))}
                                    </select>
                                    <div className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${!selectedStudentId ? "opacity-50 cursor-not-allowed" : uploadingAnswer ? "border-green-500 bg-green-500/5" : "border-gray-700 hover:border-green-500/50"}`}
                                        onClick={() => selectedStudentId && !uploadingAnswer && document.getElementById("as-upload")?.click()}>
                                        <input type="file" id="as-upload" className="hidden" accept=".pdf,image/*"
                                            onChange={(e) => { if (e.target.files?.[0]) handleGradeAnswer(e.target.files[0]); }} />
                                        {uploadingAnswer ? <Loader2 className="w-6 h-6 mx-auto text-green-400 animate-spin mb-2" /> : <Upload className="w-6 h-6 mx-auto text-green-400 mb-2" />}
                                        <p className="text-sm font-semibold">{uploadingAnswer ? "AI Grading..." : "Upload Answer Sheet"}</p>
                                        <p className="text-xs text-gray-500 mt-1">Select a student first, then upload their answer sheet</p>
                                    </div>
                                </div>

                                {/* Mark scheme preview */}
                                {selectedPaper.markScheme && (
                                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-5">
                                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-yellow-400" /> Mark Scheme</h3>
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                            {JSON.parse(selectedPaper.markScheme).map((q: { q_num: number; question_text: string; max_marks: number }) => (
                                                <div key={q.q_num} className="p-2 bg-gray-800/40 rounded-lg text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-300">Q{q.q_num}</span>
                                                        <span className="text-yellow-400 font-mono">{q.max_marks} marks</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{q.question_text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right: Graded answer sheets */}
                            <div className="lg:col-span-2">
                                <h3 className="font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400" /> Graded Sheets</h3>
                                {selectedPaper.answerSheets.length === 0 ? (
                                    <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl text-gray-500">
                                        <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                        <p>No answer sheets graded yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {selectedPaper.answerSheets.map((sheet) => (
                                            <div key={sheet.id} className="bg-gray-900/40 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-green-500/40 transition-all"
                                                onClick={() => openResult(sheet)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-xs font-bold">
                                                            {(sheet.student.name || "?").charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{sheet.student.name || sheet.student.email}</p>
                                                            <p className="text-xs text-gray-500">{new Date(sheet.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {sheet.gradedResult && (
                                                        <div className="text-right">
                                                            <span className={`text-lg font-bold ${getScoreColor(sheet.gradedResult.percentage)}`}>
                                                                {sheet.gradedResult.totalScore}/{sheet.gradedResult.maxScore}
                                                            </span>
                                                            <p className="text-xs text-gray-500">{Math.round(sheet.gradedResult.percentage)}%</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* ============ GRADE RESULT VIEW ============ */}
                {view === "grade-result" && selectedResult?.gradedResult && (
                    <>
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold mb-1">
                                {selectedResult.student.name || selectedResult.student.email}
                                <span className={`ml-3 text-xl ${getScoreColor(selectedResult.gradedResult.percentage)}`}>
                                    {selectedResult.gradedResult.totalScore}/{selectedResult.gradedResult.maxScore} ({Math.round(selectedResult.gradedResult.percentage)}%)
                                </span>
                            </h1>
                        </header>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <StatCard label="Score" value={`${selectedResult.gradedResult.totalScore}/${selectedResult.gradedResult.maxScore}`} icon={<Award className="w-5 h-5 text-yellow-400" />} />
                            <StatCard label="Percentage" value={`${Math.round(selectedResult.gradedResult.percentage)}%`} icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
                            <StatCard label="Questions" value={String(JSON.parse(selectedResult.gradedResult.questionsJson).length)} icon={<FileText className="w-5 h-5 text-blue-400" />} />
                        </div>

                        {/* Per-question breakdown */}
                        <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 mb-6">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-400" /> Per-Question Breakdown</h3>
                            <div className="space-y-3">
                                {(JSON.parse(selectedResult.gradedResult.questionsJson) as GradedQuestion[]).map((q, idx) => (
                                    <div key={idx} className="p-4 bg-gray-800/40 rounded-xl border border-gray-700/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold">Question {q.q_num}</span>
                                            <span className={`font-mono font-bold ${getScoreColor((q.scored / Math.max(q.max_marks, 1)) * 100)}`}>
                                                {q.scored}/{q.max_marks}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-2">
                                            <div className={`h-1.5 rounded-full ${q.scored / q.max_marks >= 0.7 ? "bg-green-500" : q.scored / q.max_marks >= 0.4 ? "bg-yellow-500" : "bg-red-500"}`}
                                                style={{ width: `${(q.scored / Math.max(q.max_marks, 1)) * 100}%` }} />
                                        </div>
                                        <p className="text-sm text-gray-400">{q.remarks}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overall remarks */}
                        {selectedResult.gradedResult.overallRemarks && (
                            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                                <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-purple-400" /> Overall Assessment</h3>
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedResult.gradedResult.overallRemarks}</p>
                            </div>
                        )}
                    </>
                )}

                {/* ============ CREATE CLASS MODAL ============ */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowCreateModal(false)}>
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold">Create New Class</h2>
                                    <button onClick={() => setShowCreateModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                                </div>
                                <div className="space-y-3">
                                    <input value={gradeName} onChange={(e) => setGradeName(e.target.value)} placeholder="Grade (e.g., 10th Grade)"
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <input value={divisionName} onChange={(e) => setDivisionName(e.target.value)} placeholder="Division (e.g., Division A)"
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <input value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder="Subject (e.g., Mathematics)"
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button onClick={handleCreateClassroom} disabled={creating || !gradeName || !divisionName || !subjectName}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
                                        {creating ? "Creating..." : "Create Class"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ============ ENROLL STUDENT MODAL ============ */}
                <AnimatePresence>
                    {showEnrollModal && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setShowEnrollModal(false)}>
                            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-lg font-bold">Add Student</h2>
                                    <button onClick={() => setShowEnrollModal(false)}><X className="w-5 h-5 text-gray-400 hover:text-white" /></button>
                                </div>
                                <div className="space-y-3">
                                    <input value={enrollEmail} onChange={(e) => setEnrollEmail(e.target.value)} placeholder="Student email address"
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                    {enrollMsg && <p className="text-xs text-yellow-400">{enrollMsg}</p>}
                                    <button onClick={handleEnrollStudent} disabled={enrolling || !enrollEmail}
                                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors">
                                        {enrolling ? "Adding..." : "Add Student"}
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

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
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

function getScoreColor(percentage: number) {
    if (percentage >= 90) return "text-green-400";
    if (percentage >= 70) return "text-blue-400";
    if (percentage >= 50) return "text-yellow-400";
    return "text-red-400";
}
