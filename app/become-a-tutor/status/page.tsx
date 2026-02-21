"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Clock, CheckCircle, XCircle, ArrowLeft, Loader2 } from "lucide-react";

interface ApplicationStatus {
    id: string;
    fullName: string;
    email: string;
    subjects: string[];
    status: string; // PENDING | APPROVED | REJECTED
    reviewNote: string | null;
    createdAt: string;
    updatedAt: string;
}

export default function TutorStatusPage() {
    const { status: sessionStatus } = useSession();
    const [application, setApplication] = useState<ApplicationStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            fetch("/api/tutors/status")
                .then((res) => {
                    if (!res.ok) throw new Error("No application found");
                    return res.json();
                })
                .then((data) => setApplication(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        } else if (sessionStatus === "unauthenticated") {
            setLoading(false);
            setError("Please sign in to view your application status.");
        }
    }, [sessionStatus]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "APPROVED":
                return {
                    icon: <CheckCircle className="w-12 h-12 text-green-400" />,
                    color: "text-green-400",
                    bg: "bg-green-500/10 border-green-500/30",
                    label: "Approved",
                    description: "Congratulations! Your tutor application has been approved. You can now access your tutor dashboard.",
                };
            case "REJECTED":
                return {
                    icon: <XCircle className="w-12 h-12 text-red-400" />,
                    color: "text-red-400",
                    bg: "bg-red-500/10 border-red-500/30",
                    label: "Not Approved",
                    description: "Unfortunately, your application was not approved at this time. See the review note below for details.",
                };
            default:
                return {
                    icon: <Clock className="w-12 h-12 text-yellow-400" />,
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10 border-yellow-500/30",
                    label: "Under Review",
                    description: "Your application is being reviewed by our team. This usually takes 2-3 business days.",
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || !application) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-4 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-bold">No Application Found</h2>
                    <p className="text-gray-400">{error || "You haven't submitted a tutor application yet."}</p>
                    <Link
                        href="/become-a-tutor"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        );
    }

    const config = getStatusConfig(application.status);

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-24">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className={`p-8 rounded-2xl border ${config.bg} text-center mb-8`}>
                    <div className="flex justify-center mb-4">{config.icon}</div>
                    <h2 className={`text-2xl font-bold ${config.color}`}>{config.label}</h2>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">{config.description}</p>
                </div>

                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6 space-y-4">
                    <h3 className="text-lg font-bold mb-4">Application Details</h3>
                    <DetailRow label="Name" value={application.fullName} />
                    <DetailRow label="Email" value={application.email} />
                    <DetailRow label="Subjects" value={application.subjects.join(", ")} />
                    <DetailRow label="Applied" value={new Date(application.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} />
                    {application.reviewNote && (
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 mt-4">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Review Note</p>
                            <p className="text-sm text-gray-300">{application.reviewNote}</p>
                        </div>
                    )}
                </div>

                {application.status === "APPROVED" && (
                    <div className="mt-6 text-center">
                        <Link
                            href="/tutor/dashboard"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                            Go to Tutor Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-start py-2 border-b border-gray-800 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm text-gray-200 text-right max-w-[60%]">{value}</span>
        </div>
    );
}
