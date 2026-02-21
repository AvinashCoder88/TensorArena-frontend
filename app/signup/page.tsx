"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, Users, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

type RoleOption = {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    gradient: string;
    border: string;
};

const ROLES: RoleOption[] = [
    {
        value: "STUDENT",
        label: "Student",
        description: "Practice coding, prepare for interviews, and level up your AI engineering skills.",
        icon: <GraduationCap className="w-8 h-8" />,
        gradient: "from-blue-500/20 to-blue-600/5",
        border: "border-blue-500/50",
    },
    {
        value: "TEACHER",
        label: "Teacher",
        description: "Upload exams, grade papers automatically, and track class-wide performance.",
        icon: <BookOpen className="w-8 h-8" />,
        gradient: "from-purple-500/20 to-purple-600/5",
        border: "border-purple-500/50",
    },
    {
        value: "PARENT",
        label: "Parent",
        description: "Monitor your child's learning progress and connect them with qualified tutors.",
        icon: <Users className="w-8 h-8" />,
        gradient: "from-emerald-500/20 to-emerald-600/5",
        border: "border-emerald-500/50",
    },
];

export default function SignupPage() {
    const [step, setStep] = useState<"role" | "details">("role");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
        setStep("details");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role: selectedRole }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Signup failed");
            }

            router.push("/login?callbackUrl=/arena");
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-8 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                {step === "role" ? (
                    <>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">Join TensorArena</h2>
                            <p className="mt-2 text-gray-400">Choose how you want to use the platform</p>
                        </div>

                        <div className="grid gap-4 mt-8">
                            {ROLES.map((role) => (
                                <button
                                    key={role.value}
                                    onClick={() => handleRoleSelect(role.value)}
                                    className={`group relative p-6 rounded-xl border border-gray-800 bg-gradient-to-r ${role.gradient} hover:${role.border} transition-all duration-300 hover:scale-[1.02] text-left`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-lg bg-gray-800/50 text-white group-hover:scale-110 transition-transform">
                                            {role.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-1">{role.label}</h3>
                                            <p className="text-sm text-gray-400">{role.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1" />
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Tutor CTA */}
                        <div className="mt-6 p-4 rounded-xl border border-dashed border-yellow-500/30 bg-yellow-500/5 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-yellow-400" />
                                <span className="text-sm font-semibold text-yellow-300">Want to teach on TensorArena?</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">Join our network of expert tutors and start earning by teaching AI, ML, and coding.</p>
                            <Link
                                href="/become-a-tutor"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm font-medium hover:bg-yellow-500/20 transition-colors"
                            >
                                Apply as a Tutor <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:text-blue-400">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <button
                                onClick={() => setStep("role")}
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to role selection
                            </button>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">Create Your Account</h2>
                                <p className="mt-2 text-gray-400">
                                    Signing up as a <span className="text-blue-400 font-semibold capitalize">{selectedRole.toLowerCase()}</span>
                                </p>
                            </div>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="mt-1 block w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="mt-1 block w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}

                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 rounded border-gray-800 bg-gray-950 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-900"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-400">
                                        I agree to the{" "}
                                        <Link href="/terms" className="font-medium text-blue-500 hover:text-blue-400">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="font-medium text-blue-500 hover:text-blue-400">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !agreedToTerms}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating account..." : "Sign up"}
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/login" className="text-blue-500 hover:text-blue-400">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
