"use client";

import MLPlayground from "@/components/ml-playground/MLPlayground";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function SystemDesignContent() {
    return <MLPlayground />;
}

export default function SystemDesignSessionPage() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/system-design/session");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status === "unauthenticated") return null;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/system-design" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Overview</span>
                    </Link>
                </div>
            </header>

            <main className="pt-24 px-6 pb-12 h-screen flex flex-col">
                <div className="w-full h-full flex-1">
                    <Suspense fallback={<div className="text-white">Loading session...</div>}>
                        <SystemDesignContent />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}
