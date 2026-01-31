

import LoginForm from "./login-form";

export default function Page() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-slow-spin bg-[conic-gradient(from_0deg_at_50%_50%,#000000_0deg,#1a1a1a_120deg,#2e1065_180deg,#000000_360deg)] opacity-30 blur-3xl z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,50,0)_0%,rgba(0,0,0,1)_100%)] z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 w-full max-w-md p-4">
                <LoginForm />
            </div>
        </div>
    );
}
