import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";

async function getStudentSheets(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return [];

    return await prisma.answerSheet.findMany({
        where: { studentId: user.id },
        orderBy: { uploadedAt: "desc" },
    });
}

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Please log in to view your dashboard.
            </div>
        );
    }

    const sheets = await getStudentSheets(session.user.email);

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            Student Dashboard
                        </h1>
                        <p className="text-gray-400">Track your progress and review graded assignments.</p>
                    </div>
                    <Link href="/classroom" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Back to Classroom
                    </Link>
                </header>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-gray-800 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-green-500" />
                        <h2 className="font-bold text-lg">Your Answer Sheets</h2>
                    </div>

                    {sheets.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            No answer sheets found. Ask your teacher to upload one!
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-800">
                            {sheets.map((sheet) => (
                                <div key={sheet.id} className="p-6 hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="font-bold text-white flex items-center gap-2">
                                            Sheet #{sheet.id.slice(-4)}
                                            <span className={`text-xs px-2 py-0.5 rounded border ${sheet.status === "GRADED"
                                                    ? "bg-green-900/30 text-green-400 border-green-800"
                                                    : "bg-yellow-900/30 text-yellow-400 border-yellow-800"
                                                }`}>
                                                {sheet.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(sheet.uploadedAt).toLocaleDateString()}
                                            </span>
                                            {sheet.grade && (
                                                <span className="text-white font-bold">Grade: {sheet.grade}</span>
                                            )}
                                        </div>
                                    </div>

                                    {sheet.gradedFileUrl ? (
                                        <a
                                            href={`http://localhost:8000${sheet.gradedFileUrl}`}
                                            target="_blank"
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            View Report
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-500 italic">Grading in progress...</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
