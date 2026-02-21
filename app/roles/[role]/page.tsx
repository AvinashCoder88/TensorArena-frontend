import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, ROLE_LABELS, ROLE_DESCRIPTIONS, CATEGORY_LABELS, ServiceRole } from "@/lib/services";

const ROLE_ORDER: ServiceRole[] = ["teacher", "student", "parent", "professional", "coder"];

export default function RolePage({ params }: { params: { role: string } }) {
    if (!ROLE_ORDER.includes(params.role as ServiceRole)) return notFound();

    const role = params.role as ServiceRole;
    const services = SERVICES.filter((service) => service.roles.includes(role));

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6">
                <div className="mb-10">
                    <div className="text-xs text-gray-500 mb-2">Role Overview</div>
                    <h1 className="text-4xl md:text-5xl font-bold">{ROLE_LABELS[role]}</h1>
                    <p className="text-gray-400 mt-3 max-w-2xl">
                        {ROLE_DESCRIPTIONS[role]}
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link
                            href="/services"
                            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm"
                        >
                            View All Services
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-full border border-gray-800 text-gray-300 hover:text-white text-sm"
                        >
                            Back Home
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            href={`/services/${service.id}`}
                            className="rounded-2xl border border-gray-800 bg-gray-900/20 p-6 hover:border-blue-500/60 transition-colors"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-xs px-2 py-1 rounded-full border ${service.status === "available" ? "border-emerald-500/40 text-emerald-300" : service.status === "beta" ? "border-yellow-500/40 text-yellow-300" : "border-gray-700 text-gray-400"}`}>
                                    {service.status === "available" ? "Available" : service.status === "beta" ? "Beta" : "Coming soon"}
                                </span>
                                <div className="text-xs text-gray-500">
                                    {service.categories.map((c) => CATEGORY_LABELS[c]).join(", ")}
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{service.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
