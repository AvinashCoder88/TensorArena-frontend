"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle, Clock, Filter, Loader2, UserCheck, Mail, BookOpen, Calendar, ChevronDown, ChevronUp } from "lucide-react";

interface TutorApp {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
    subjects: string[];
    qualifications: string;
    experience: string;
    bio: string | null;
    linkedinUrl: string | null;
    status: string;
    reviewNote: string | null;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string | null;
        createdAt: string;
    };
}

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

export default function AdminTutorsPage() {
    const [applications, setApplications] = useState<TutorApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<StatusFilter>("ALL");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [reviewNote, setReviewNote] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = filter !== "ALL" ? `?status=${filter}` : "";
            const res = await fetch(`/api/admin/tutors${params}`);
            const data = await res.json();
            setApplications(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    const handleAction = async (applicationId: string, status: "APPROVED" | "REJECTED") => {
        setActionLoading(applicationId);
        try {
            await fetch("/api/admin/tutors", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId, status, reviewNote }),
            });
            setReviewNote("");
            setExpandedId(null);
            fetchApplications();
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const statusCounts = {
        ALL: applications.length,
        PENDING: applications.filter((a) => a.status === "PENDING").length,
        APPROVED: applications.filter((a) => a.status === "APPROVED").length,
        REJECTED: applications.filter((a) => a.status === "REJECTED").length,
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs"><CheckCircle className="w-3 h-3" /> Approved</span>;
            case "REJECTED":
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-xs"><XCircle className="w-3 h-3" /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs"><Clock className="w-3 h-3" /> Pending</span>;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Tutor Applications
                    </h1>
                    <p className="text-gray-400">Review, approve, or reject tutor applications</p>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {(["ALL", "PENDING", "APPROVED", "REJECTED"] as StatusFilter[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`p-4 rounded-xl border transition-all ${filter === s
                                ? "border-blue-500/50 bg-blue-500/10"
                                : "border-gray-800 bg-gray-900/30 hover:border-gray-700"
                                }`}
                        >
                            <p className="text-2xl font-bold">{statusCounts[s]}</p>
                            <p className="text-xs text-gray-400 capitalize">{s.toLowerCase()}</p>
                        </button>
                    ))}
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No applications found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div key={app.id} className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
                                {/* Header row */}
                                <div
                                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-900/60 transition-colors"
                                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                                            {app.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{app.fullName}</h3>
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Mail className="w-3 h-3" /> {app.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {app.subjects.slice(0, 3).map((s) => (
                                                <span key={s} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{s}</span>
                                            ))}
                                            {app.subjects.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">+{app.subjects.length - 3}</span>
                                            )}
                                        </div>
                                        {getStatusBadge(app.status)}
                                        {expandedId === app.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expandedId === app.id && (
                                    <div className="border-t border-gray-800 p-5 space-y-4 bg-gray-950/50">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <DetailSection icon={<BookOpen className="w-4 h-4 text-blue-400" />} title="Qualifications" content={app.qualifications} />
                                            <DetailSection icon={<UserCheck className="w-4 h-4 text-purple-400" />} title="Experience" content={app.experience} />
                                        </div>
                                        {app.bio && <DetailSection icon={<Mail className="w-4 h-4 text-green-400" />} title="Bio" content={app.bio} />}

                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                            {app.phone && <span>Phone: {app.phone}</span>}
                                            {app.linkedinUrl && <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>}
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
                                            <Filter className="w-3 h-3" /> All subjects:
                                            {app.subjects.map((s) => (
                                                <span key={s} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-300">{s}</span>
                                            ))}
                                        </div>

                                        {app.status === "PENDING" && (
                                            <div className="pt-4 border-t border-gray-800 space-y-3">
                                                <textarea
                                                    rows={2}
                                                    value={reviewNote}
                                                    onChange={(e) => setReviewNote(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                                    placeholder="Optional review note..."
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleAction(app.id, "APPROVED")}
                                                        disabled={actionLoading === app.id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(app.id, "REJECTED")}
                                                        disabled={actionLoading === app.id}
                                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {app.reviewNote && (
                                            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Review Note</p>
                                                <p className="text-sm text-gray-300">{app.reviewNote}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailSection({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
    return (
        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-sm font-semibold text-gray-300">{title}</span>
            </div>
            <p className="text-sm text-gray-400 whitespace-pre-wrap">{content}</p>
        </div>
    );
}
