"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SERVICES, ROLE_LABELS, CATEGORY_LABELS, ServiceCategory, ServiceRole } from "@/lib/services";
import { Search } from "lucide-react";

type RoleFilter = ServiceRole | "all";
type CategoryFilter = ServiceCategory | "all";

export default function ServicesPage() {
    const [role, setRole] = useState<RoleFilter>("all");
    const [category, setCategory] = useState<CategoryFilter>("all");
    const [query, setQuery] = useState("");

    const roles = Object.entries(ROLE_LABELS);
    const categories = Object.entries(CATEGORY_LABELS);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return SERVICES.filter((service) => {
            const roleMatch = role === "all" || service.roles.includes(role);
            const categoryMatch = category === "all" || service.categories.includes(category);
            const queryMatch =
                q.length === 0 ||
                service.title.toLowerCase().includes(q) ||
                service.description.toLowerCase().includes(q);
            return roleMatch && categoryMatch && queryMatch;
        });
    }, [role, category, query]);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold">Services Catalog</h1>
                    <p className="text-gray-400 mt-3 max-w-2xl">
                        Explore everything TensorArena offers. Filter by role and category to find what matters to you.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 mb-10">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search services..."
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-blue-600"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setRole("all")}
                            className={`px-3 py-1.5 rounded-full text-xs border ${role === "all" ? "bg-blue-600 border-blue-500 text-white" : "border-gray-800 text-gray-400 hover:text-white"}`}
                        >
                            All Roles
                        </button>
                        {roles.map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setRole(key as ServiceRole)}
                                className={`px-3 py-1.5 rounded-full text-xs border ${role === key ? "bg-blue-600 border-blue-500 text-white" : "border-gray-800 text-gray-400 hover:text-white"}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                    <button
                        onClick={() => setCategory("all")}
                        className={`px-3 py-1.5 rounded-full text-xs border ${category === "all" ? "bg-purple-600 border-purple-500 text-white" : "border-gray-800 text-gray-400 hover:text-white"}`}
                    >
                        All Categories
                    </button>
                    {categories.map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key as ServiceCategory)}
                            className={`px-3 py-1.5 rounded-full text-xs border ${category === key ? "bg-purple-600 border-purple-500 text-white" : "border-gray-800 text-gray-400 hover:text-white"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((service) => (
                        <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            className="rounded-2xl border border-gray-800 bg-gray-900/20 p-6 hover:border-blue-500/60 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full border ${service.status === "available" ? "border-emerald-500/40 text-emerald-300" : service.status === "beta" ? "border-yellow-500/40 text-yellow-300" : "border-gray-700 text-gray-400"}`}>
                                    {service.status === "available" ? "Available" : service.status === "beta" ? "Beta" : "Coming soon"}
                                </span>
                                <div className="text-xs text-gray-500">{service.roles.map((r) => ROLE_LABELS[r]).join(", ")}</div>
                            </div>
                            <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{service.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {service.categories.map((cat) => (
                                    <span key={cat} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                                        {CATEGORY_LABELS[cat]}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mt-12 text-gray-400 text-sm">
                        No services match your filters. Try clearing filters or searching another term.
                    </div>
                )}
            </div>
        </div>
    );
}
