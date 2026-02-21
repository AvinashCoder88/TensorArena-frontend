"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles, BookOpen, Award, Clock } from "lucide-react";

const SUBJECT_OPTIONS = [
    "Python", "Machine Learning", "Deep Learning", "Natural Language Processing",
    "Computer Vision", "Data Science", "Mathematics", "Statistics",
    "TensorFlow", "PyTorch", "LLM Engineering", "Prompt Engineering",
    "System Design", "Data Structures & Algorithms", "Web Development",
    "Cloud Computing", "MLOps", "Reinforcement Learning",
];

type FormStep = 1 | 2 | 3 | 4;

export default function BecomeATutorPage() {
    const { data: session } = useSession();

    const [step, setStep] = useState<FormStep>(1);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [fullName, setFullName] = useState(session?.user?.name || "");
    const [email, setEmail] = useState(session?.user?.email || "");
    const [phone, setPhone] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [qualifications, setQualifications] = useState("");
    const [experience, setExperience] = useState("");
    const [bio, setBio] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
        );
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/tutors/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    subjects: selectedSubjects,
                    qualifications,
                    experience,
                    bio,
                    linkedinUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to submit application");
            }

            setSubmitted(true);
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-6 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold">Application Submitted!</h2>
                    <p className="text-gray-400">
                        Thank you for applying to be a tutor on TensorArena. Our team will review your application
                        and get back to you within 2-3 business days.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <Link
                            href="/become-a-tutor/status"
                            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Check Application Status
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 rounded-lg border border-gray-800 hover:bg-gray-900 transition-colors text-sm font-medium text-gray-400"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-24">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Become a Tutor
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Share Your Expertise</h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Join TensorArena&apos;s network of expert tutors. Set your own schedule, choose your subjects, and help shape the next generation of AI engineers.
                    </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { icon: <Award className="w-5 h-5 text-yellow-400" />, label: "Earn on your terms" },
                        { icon: <BookOpen className="w-5 h-5 text-blue-400" />, label: "Teach what you love" },
                        { icon: <Clock className="w-5 h-5 text-green-400" />, label: "Flexible schedule" },
                    ].map((b, i) => (
                        <div key={i} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800 text-center">
                            <div className="flex justify-center mb-2">{b.icon}</div>
                            <span className="text-sm text-gray-300">{b.label}</span>
                        </div>
                    ))}
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-500"
                                }`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`w-12 h-0.5 ${step > s ? "bg-blue-600" : "bg-gray-800"}`} />}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Personal Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone (optional)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">LinkedIn Profile (optional)</label>
                                <input
                                    type="url"
                                    value={linkedinUrl}
                                    onChange={(e) => setLinkedinUrl(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Subjects You Want to Teach</h3>
                            <p className="text-sm text-gray-400">Select all subjects you&apos;re qualified to teach:</p>
                            <div className="flex flex-wrap gap-2">
                                {SUBJECT_OPTIONS.map((subject) => (
                                    <button
                                        key={subject}
                                        type="button"
                                        onClick={() => toggleSubject(subject)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubjects.includes(subject)
                                            ? "bg-blue-600 text-white border border-blue-500"
                                            : "bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600"
                                            }`}
                                    >
                                        {subject}
                                    </button>
                                ))}
                            </div>
                            {selectedSubjects.length > 0 && (
                                <p className="text-sm text-blue-400">{selectedSubjects.length} subject(s) selected</p>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Qualifications & Experience</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Qualifications *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={qualifications}
                                    onChange={(e) => setQualifications(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="E.g., M.S. Computer Science, Stanford University; Google ML Certification..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Teaching / Industry Experience *</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="E.g., 5 years as ML Engineer at Google; TA for CS229 at Stanford..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Short Bio (optional)</label>
                                <textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Tell students a bit about yourself..."
                                />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Review Your Application</h3>
                            <div className="space-y-4">
                                <ReviewItem label="Name" value={fullName} />
                                <ReviewItem label="Email" value={email} />
                                {phone && <ReviewItem label="Phone" value={phone} />}
                                {linkedinUrl && <ReviewItem label="LinkedIn" value={linkedinUrl} />}
                                <ReviewItem label="Subjects" value={selectedSubjects.join(", ")} />
                                <ReviewItem label="Qualifications" value={qualifications} />
                                <ReviewItem label="Experience" value={experience} />
                                {bio && <ReviewItem label="Bio" value={bio} />}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 text-red-500 text-sm text-center">{error}</div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep((step - 1) as FormStep)}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : (
                            <Link href="/signup" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Sign up instead
                            </Link>
                        )}

                        {step < 4 ? (
                            <button
                                onClick={() => setStep((step + 1) as FormStep)}
                                disabled={
                                    (step === 1 && (!fullName || !email)) ||
                                    (step === 2 && selectedSubjects.length === 0) ||
                                    (step === 3 && (!qualifications || !experience))
                                }
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? "Submitting..." : "Submit Application"} {!loading && <CheckCircle className="w-4 h-4" />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Login prompt */}
                {!session && (
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-500 hover:text-blue-400">Sign in</Link>
                        {" "}first, then apply.
                    </p>
                )}
            </div>
        </div>
    );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className="text-sm text-gray-200">{value || "—"}</p>
        </div>
    );
}
