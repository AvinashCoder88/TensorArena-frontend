"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

export default function AdminIntegrationsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("configured");
    const [provider, setProvider] = useState("");
    const [tenant, setTenant] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/admin/integrations/erp");
                const data = await res.json();
                if (data?.status && data.status !== "not_configured") {
                    setStatus(data.status || "configured");
                    setProvider(data.provider || "");
                    setTenant(data.tenant || "");
                    setClientId(data.clientId || "");
                    setClientSecret("");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/admin/integrations/erp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider, tenant, clientId, clientSecret, status }),
            });
            if (!res.ok) {
                const data = await res.json();
                setMessage(data?.message || "Save failed.");
                return;
            }
            setMessage("ERP settings saved.");
            setClientSecret("");
        } catch (err) {
            console.error(err);
            setMessage("Save failed.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 pt-24">
            <div className="container mx-auto max-w-3xl">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">ERP Integration</h1>
                    <p className="text-gray-400 mt-2">
                        Configure your school ERP/SIS connection (provider, tenant, OAuth).
                    </p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="space-y-4 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
                        <div>
                            <label className="text-sm text-gray-400">Provider</label>
                            <input
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                placeholder="e.g. PowerSchool, ERPNext, Canvas"
                                className="w-full mt-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Tenant / Domain</label>
                            <input
                                value={tenant}
                                onChange={(e) => setTenant(e.target.value)}
                                placeholder="e.g. district-01"
                                className="w-full mt-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">OAuth Client ID</label>
                            <input
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                placeholder="Client ID"
                                className="w-full mt-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">OAuth Client Secret</label>
                            <input
                                type="password"
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                placeholder="Client Secret"
                                className="w-full mt-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full mt-2 bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white"
                            >
                                <option value="configured">Configured</option>
                                <option value="disabled">Disabled</option>
                            </select>
                        </div>
                        {message && <p className="text-sm text-gray-400">{message}</p>}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Settings
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
