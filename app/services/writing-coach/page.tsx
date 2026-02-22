"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function WritingCoachPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    interface LineEdit {
        issue: string;
        suggestion: string;
    }

    interface WritingCoachResult {
        strengths?: string[];
        improvements?: string[];
        line_edits?: LineEdit[];
        overall_summary?: string;
    }

    const [result, setResult] = useState<WritingCoachResult | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/run`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    service_id: "writing_coach",
                    input: { text },
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.detail || "Request failed");
            setResult(data.result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Request failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Writing Coach</h1>
                <p className="text-gray-400 mb-6">Paste an essay or draft to get structured feedback.</p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Paste your draft here..."
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading || text.trim().length < 50}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Get Feedback"}
                </button>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                {result && (
                    <div className="mt-8 space-y-4">
                        <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                            <h3 className="font-semibold mb-2">Strengths</h3>
                            <ul className="text-sm text-gray-300 list-disc list-inside">
                                {(result.strengths || []).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                        <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                            <h3 className="font-semibold mb-2">Improvements</h3>
                            <ul className="text-sm text-gray-300 list-disc list-inside">
                                {(result.improvements || []).map((item: string, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </section>
                        <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                            <h3 className="font-semibold mb-2">Line Edits</h3>
                            <div className="text-sm text-gray-300 space-y-2">
                                {(result.line_edits || []).map((item, idx) => (
                                    <div key={idx} className="border border-gray-800 rounded-lg p-3">
                                        <div className="text-gray-400">Issue: {item.issue}</div>
                                        <div>Suggestion: {item.suggestion}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                            <h3 className="font-semibold mb-2">Overall Summary</h3>
                            <p className="text-sm text-gray-300">{result.overall_summary}</p>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
