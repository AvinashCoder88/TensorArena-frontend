import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, ROLE_LABELS, CATEGORY_LABELS } from "@/lib/services";

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
    const service = SERVICES.find((item) => item.id === params.id);

    if (!service) return notFound();

    const statusLabel =
        service.status === "available" ? "Available" : service.status === "beta" ? "Beta" : "Coming soon";

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="mb-8">
                    <Link href="/services" className="text-sm text-gray-400 hover:text-white">
                        Back to Services
                    </Link>
                </div>

                <div className="rounded-3xl border border-gray-800 bg-gray-900/30 p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${service.status === "available" ? "border-emerald-500/40 text-emerald-300" : service.status === "beta" ? "border-yellow-500/40 text-yellow-300" : "border-gray-700 text-gray-400"}`}>
                            {statusLabel}
                        </span>
                        <div className="text-xs text-gray-500">
                            {service.roles.map((r) => ROLE_LABELS[r]).join(", ")}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
                    <p className="text-gray-400 mt-3 text-lg">{service.description}</p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {service.categories.map((cat) => (
                            <span key={cat} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                                {CATEGORY_LABELS[cat]}
                            </span>
                        ))}
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                            <h3 className="text-sm font-semibold text-white mb-3">Inputs</h3>
                            <div className="flex flex-wrap gap-2">
                                {service.inputs.map((item) => (
                                    <span key={item} className="text-xs px-2 py-1 rounded-full bg-gray-900 text-gray-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-800 bg-black/40 p-5">
                            <h3 className="text-sm font-semibold text-white mb-3">Outputs</h3>
                            <div className="flex flex-wrap gap-2">
                                {service.outputs.map((item) => (
                                    <span key={item} className="text-xs px-2 py-1 rounded-full bg-gray-900 text-gray-300">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {service.status === "coming-soon" ? (
                            <button
                                disabled
                                className="px-6 py-3 rounded-full bg-gray-800 text-gray-500 cursor-not-allowed"
                            >
                                Coming Soon
                            </button>
                        ) : (
                            <Link
                                href={service.ctaHref}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                                {service.ctaLabel}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
