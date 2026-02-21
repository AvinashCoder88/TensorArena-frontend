"use client";
import React, { useState } from 'react';
import { Upload, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExamUploaderProps {
    onUploadSuccess: (result: unknown) => void;
}

export const ExamUploader: React.FC<ExamUploaderProps> = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) await uploadFile(file);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${API_BASE_URL}/teacher/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                let message = `Upload failed (${response.status})`;
                try {
                    const data = await response.json();
                    if (data?.detail) message = data.detail;
                } catch {
                    // ignore JSON parsing errors
                }
                if (response.status === 520) {
                    message = "Upload service is unavailable right now. Please try again in a minute.";
                }
                throw new Error(message);
            }

            const result = await response.json();
            onUploadSuccess(result);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            className={`
                border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer
                ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 hover:border-blue-500/50 hover:bg-gray-900/40"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('exam-upload')?.click()}
        >
            <input
                type="file"
                id="exam-upload"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
            />

            <div className="flex flex-col items-center gap-4">
                {isUploading ? (
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                ) : (
                    <div className="p-4 rounded-full bg-gray-800">
                        <Upload className="w-8 h-8 text-blue-400" />
                    </div>
                )}

                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {isUploading ? "Analysing Paper..." : "Upload Exam Paper"}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                        Drag & drop or click to upload PDF/Image
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg"
                    >
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
