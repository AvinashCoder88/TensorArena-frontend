"use client";

import React from "react";
import { Code2, Home, Star } from "lucide-react";
import Link from "next/link";

const papers = [
    {
        title: "Attention Is All You Need",
        authors: "Vaswani et al., 2017",
        desc: "The foundational paper for the Transformer architecture. Implement the Multi-Head Attention mechanism and Positional Encoding from scratch.",
        difficulty: "Basic",
        stars: 5,
        year: 2017
    },
    {
        title: "Denoising Diffusion Probabilistic Models",
        authors: "Ho et al., 2020",
        desc: "The generative backbone of modern image generation. Implement the forward and reverse diffusion processes.",
        difficulty: "Advanced",
        stars: 4,
        year: 2020
    },
    {
        title: "LoRA: Low-Rank Adaptation of Large Language Models",
        authors: "Hu et al., 2021",
        desc: "Efficiently fine-tune massive models. Implement the low-rank matrix decomposition injection into linear layers.",
        difficulty: "Intermediate",
        stars: 5,
        year: 2021
    },
    {
        title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
        authors: "Dao et al., 2022",
        desc: "Optimize attention with IO-awareness. Implement tiling to reduce memory access overhead.",
        difficulty: "Expert",
        stars: 5,
        year: 2022
    }
];

export default function PapersPage() {
    return (
        <div className="min-h-screen bg-[#f8f5f2] text-gray-900 font-serif selection:bg-orange-200">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-sans text-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight">TensorArena<span className="text-gray-400 font-light italic ml-1">Research</span></div>
                    <div className="w-16"></div> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">

                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-block px-3 py-1 mb-6 border border-gray-300 rounded-full text-xs font-sans uppercase tracking-widest text-gray-500">
                        Paper Implementation Lab
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        Don&apos;t just read the state of the art. <br />
                        <span className="italic text-orange-600">Build it.</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-sans max-w-2xl mx-auto">
                        Deep dive into seminal AI research papers. We provide the abstract and the blank IDE. You implement the core algorithms from scratch.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {papers.map((paper, i) => (
                        <div key={i} className="group bg-white p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gray-50 px-4 py-2 border-b border-l border-gray-100 rounded-bl-xl font-sans text-xs font-bold text-gray-400">
                                {paper.year}
                            </div>

                            <div className="mb-4">
                                <div className="flex gap-1 mb-2">
                                    {[...Array(paper.stars)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                                    ))}
                                </div>
                                <h2 className="text-2xl font-bold mb-1 group-hover:text-orange-600 transition-colors leading-tight">
                                    {paper.title}
                                </h2>
                                <p className="text-sm text-gray-500 italic font-serif">
                                    {paper.authors}
                                </p>
                            </div>

                            <p className="text-gray-600 font-sans leading-relaxed mb-8 text-sm">
                                {paper.desc}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-sans font-bold uppercase tracking-wide border ${paper.difficulty === 'Basis' ? 'bg-green-50 text-green-700 border-green-200' :
                                    paper.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        'bg-purple-50 text-purple-700 border-purple-200'
                                    }`}>
                                    {paper.difficulty}
                                </span>

                                <button className="flex items-center gap-2 text-sm font-sans font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    <Code2 className="w-4 h-4" />
                                    Implement Paper &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
