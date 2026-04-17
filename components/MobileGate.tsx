"use client";

import { MonitorSmartphone } from "lucide-react";
import { useIsMobile } from "./hooks/useIsMobile";
import { useState } from "react";

export default function MobileGate({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();
    const [dismissed, setDismissed] = useState(false);

    if (!isMobile || dismissed) return <>{children}</>;

    return (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center">

                <div className="flex justify-center mb-3">
                    <MonitorSmartphone size={40} className="text-amber-500" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Better on Desktop
                </h2>

                <p className="text-sm text-gray-600">
                    This dashboard is optimized for desktop viewing. You can continue on mobile, but some charts and interactions may not display as intended.
                </p>

                <div className="mt-5 flex flex-col gap-2">
                    <button
                        onClick={() => setDismissed(true)}
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition"
                    >
                        Continue Anyway
                    </button>

                    <p className="text-xs text-gray-400">
                        Recommended screen width: 1024px+
                    </p>
                </div>
            </div>
        </div>
    );
}