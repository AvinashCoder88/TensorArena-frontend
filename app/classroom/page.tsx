import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, School } from "lucide-react";

export default function ClassroomPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans flex flex-col items-center justify-center p-6">
            <Link href="/" className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Home
            </Link>

            <div className="text-center mb-12">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <School className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    TensorClassroom
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    AI-powered grading and mentorship for the next generation of engineers.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
                <Link href="/classroom/teacher" className="group relative bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-xl">
                    <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <GraduationCap className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">Teacher Portal</h2>
                    <p className="text-gray-400">Upload answer sheets, manage classes, and review AI-graded reports.</p>
                </Link>

                <Link href="/classroom/student" className="group relative bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-xl">
                    <div className="absolute inset-0 bg-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <BookOpen className="w-12 h-12 text-green-500 mb-6 group-hover:scale-110 transition-transform" />
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">Student Portal</h2>
                    <p className="text-gray-400">View your graded assignments, track progress, and receive personalized feedback.</p>
                </Link>
            </div>
        </div>
    );
}
