"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function QuizBuilderPage() {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
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
                    service_id: "quiz_builder",
                    input: { text },
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.detail || "Request failed");
            setResult(data.result);
        } catch (err: any) {
            setError(err.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Quiz Builder</h1>
                <p className="text-gray-400 mb-6">Paste a lesson transcript to generate a quiz.</p>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={10}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Paste transcript here..."
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading || text.trim().length < 50}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium disabled:opacity-60"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Quiz"}
                </button>

                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

                {result && (
                    <div className="mt-8 space-y-4">
                        <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-4">
                            <h3 className="font-semibold mb-2">{result.quiz_title}</h3>
                            <div className="space-y-3 text-sm text-gray-300">
                                {(result.questions || []).map((q: any, idx: number) => (
                                    <div key={idx} className="border border-gray-800 rounded-lg p-3">
                                        <div className="font-medium">{idx + 1}. {q.question}</div>
                                        <ul className="mt-2 space-y-1">
                                            {(q.options || []).map((opt: string, oidx: number) => (
                                                <li key={oidx} className={`${q.answer_index === oidx ? "text-green-400" : ""}`}>
                                                    {String.fromCharCode(65 + oidx)}. {opt}
                                                </li>
                                            ))}
                                        </ul>
                                        {q.explanation && <div className="text-gray-400 mt-2">Explanation: {q.explanation}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
