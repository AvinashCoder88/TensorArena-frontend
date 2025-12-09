import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, Code, Lightbulb, Unlock, ChevronUp } from "lucide-react";

interface QuestionDisplayProps {
    title: string;
    description: string;
    difficulty: "Basic" | "Intermediate" | "Advanced";
    topic: string;
    answer?: string;
    explanation?: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    title,
    description,
    difficulty,
    topic,
    answer,
    explanation,
}) => {
    const [showSolution, setShowSolution] = useState(false);

    const difficultyColor = {
        Basic: "text-green-400 border-green-400/30 bg-green-400/10",
        Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
        Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
    };

    return (
        <div className="h-full flex flex-col space-y-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-y-auto">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                    <span
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            difficultyColor[difficulty] || difficultyColor.Basic
                        )}
                    >
                        {difficulty}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                        {topic}
                    </span>
                </div>
            </div>

            {/* Instructions Panel */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-blue-400">
                    <Info className="w-5 h-5" />
                    <h3 className="font-semibold">How to Solve</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                        <Code className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                        <p><strong>1. Write your solution</strong> in the code editor on the right</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Code className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                        <p><strong>2. Test your code</strong> by clicking &quot;Run Code&quot; to see the output</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                        <p><strong>3. Submit</strong> when ready - your solution will be evaluated against test cases</p>
                    </div>
                </div>
            </div>

            {/* Problem Description */}
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-code:text-blue-300 prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800">
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>

            {/* Solution & Explanation Section */}
            {(answer || explanation) && (
                <div className="space-y-4">
                    {!showSolution ? (
                        <button
                            onClick={() => setShowSolution(true)}
                            className="w-full flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border-2 border-yellow-500/50 hover:border-yellow-400 rounded-xl transition-all duration-200 group"
                        >
                            <Lightbulb className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300" />
                            <span className="text-lg font-bold text-yellow-400 group-hover:text-yellow-300">
                                View Solution
                            </span>
                        </button>
                    ) : (
                        <div className="border-2 border-yellow-500/50 rounded-xl overflow-hidden bg-black/30">
                            <button
                                onClick={() => setShowSolution(false)}
                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 transition-colors"
                            >
                                <div className="flex items-center space-x-2 text-yellow-400">
                                    <Unlock className="w-5 h-5" />
                                    <span className="font-semibold text-lg">Solution & Explanation</span>
                                </div>
                                <ChevronUp className="w-5 h-5 text-yellow-400" />
                            </button>

                            <div className="p-6 space-y-6 bg-gray-900/50">
                                {explanation && (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                                            <h4 className="text-base font-semibold text-blue-400">How It Works</h4>
                                        </div>
                                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 bg-gray-900/50 p-5 rounded-lg border border-gray-700 leading-relaxed">
                                            <ReactMarkdown>{explanation}</ReactMarkdown>
                                        </div>
                                    </div>
                                )}

                                {answer && (
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-1 w-1 rounded-full bg-green-400"></div>
                                            <h4 className="text-base font-semibold text-green-400">Solution Code</h4>
                                        </div>
                                        <div className="rounded-lg overflow-hidden border-2 border-green-500/30">
                                            <pre className="p-5 bg-gray-950 text-sm overflow-x-auto text-green-300 font-mono leading-relaxed">
{answer}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Expected Output Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">What Happens When You Submit?</h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    <li>Your code will be tested against multiple test cases</li>
                    <li>You&apos;ll receive immediate feedback on correctness</li>
                    <li>Performance metrics (time/space complexity) will be shown</li>
                    <li>Hints will be provided if your solution doesn&apos;t pass</li>
                </ul>
            </div>
        </div>
    );
};
