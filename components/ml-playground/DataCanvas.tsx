"use client";

import React, { useRef } from "react";
import { Point } from "./algorithms";

interface DataCanvasProps {
    points: Point[];
    setPoints: (points: Point[]) => void;
    decisionBoundary?: { x: number; y: number; label: number }[];
    centroids?: { x: number; y: number; label: number }[];
    mode: 'add_0' | 'add_1' | 'view'; // What happens on click
}

export function DataCanvas({ points, setPoints, decisionBoundary, centroids, mode }: DataCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleCanvasClick = (e: React.MouseEvent) => {
        if (!containerRef.current || mode === 'view') return;

        const rect = containerRef.current.getBoundingClientRect();
        const xPixels = e.clientX - rect.left;
        const yPixels = e.clientY - rect.top;

        // Convert to percentage/coordinate space (0-100)
        const x = (xPixels / rect.width) * 100;
        const y = (yPixels / rect.height) * 100;

        const label = mode === 'add_0' ? 0 : 1;
        setPoints([...points, { x, y, label }]);
    };

    return (
        <div
            ref={containerRef}
            onClick={handleCanvasClick}
            className="w-full h-full relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden cursor-crosshair shadow-inner"
        >
            {/* Grid Lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
                    backgroundSize: '10% 10%'
                }}
            />

            {/* Decision Boundary / Background Visualization */}
            {decisionBoundary && decisionBoundary.map((p, i) => (
                <div
                    key={`db-${i}`}
                    className="absolute w-[5%] h-[5%]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        backgroundColor: p.label === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    }}
                />
            ))}

            {/* Data Points */}
            {points.map((p, i) => (
                <div
                    key={`p-${i}`}
                    className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full border-2 transition-transform duration-300 hover:scale-150 ${p.label === 0
                        ? 'bg-blue-500 border-blue-300'
                        : p.label === 1
                            ? 'bg-red-500 border-red-300'
                            : 'bg-gray-400 border-gray-200' // Unlabelled (if any, e.g. for K-means init)
                        }`}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    title={`(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`}
                />
            ))}

            {/* Centroids (for K-Means) */}
            {centroids && centroids.map((c, i) => (
                <div
                    key={`c-${i}`}
                    className="absolute w-6 h-6 -ml-3 -mt-3 transform rotate-45 border-4 shadow-lg z-10 transition-all duration-500"
                    style={{
                        left: `${c.x}%`,
                        top: `${c.y}%`,
                        borderColor: c.label === 0 ? '#3b82f6' : c.label === 1 ? '#ef4444' : c.label === 2 ? '#10b981' : '#f59e0b',
                        backgroundColor: 'white'
                    }}
                >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white whitespace-nowrap">
                        Cluster {i + 1}
                    </div>
                </div>
            ))}

            {/* Legend/Info Overlay */}
            <div className="absolute bottom-2 right-2 bg-black/80 text-xs text-gray-400 p-2 rounded pointer-events-none">
                {points.length} points
            </div>
        </div>
    );
}
