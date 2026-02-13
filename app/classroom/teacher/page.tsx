"use client";

import { useState } from "react";
import { gradeAnswerSheet } from "@/app/actions/classroom";
import { Loader2, Upload, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("studentName", "Student"); // Could maximize this later

        try {
            const res = await gradeAnswerSheet(formData);
            if (res.success) {
                setResult(res);
            } else {
                setError(res.error || "Unknown error occurred");
            }
        } catch (err) {
            setError("Network error or server issue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                            Teacher Dashboard
                        </h1>
                        <p className="text-gray-400">Upload answer sheets for instant AI grading.</p>
                    </div>
                    <Link href="/classroom" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Back to Classroom
                    </Link>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-blue-500" />
                            Upload Answer Sheet
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*,application/pdf"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <FileText className="w-12 h-12 text-gray-500 mb-4" />
                                <p className="font-medium text-gray-300">
                                    {file ? file.name : "Drag & drop or packet to upload"}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, PDF</p>
                            </div>

                            <button
                                type="submit"
                                disabled={!file || loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                {loading ? "Grading..." : "Grade Paper"}
                            </button>

                            {error && (
                                <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {result ? (
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl animate-fade-in-up">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Grading Complete
                                    </h2>
                                    <div className="text-2xl font-bold text-white bg-green-500/20 px-3 py-1 rounded-lg border border-green-500/50">
                                        {result.grade}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Remarks</h3>
                                    <p className="text-gray-300 leading-relaxed bg-black/30 p-4 rounded-lg border border-gray-800">
                                        {result.remarks}
                                    </p>
                                </div>

                                {result.reportUrl && (
                                    <a
                                        href={result.reportUrl}
                                        target="_blank"
                                        className="block w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download Full Report (DOCX)
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div className="h-full bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 flex items-center justify-center text-gray-500 text-center">
                                <div>
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Loader2 className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p>Upload a paper to see AI grading analysis here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
