"use client";

import { MonitorX } from "lucide-react";
import { useIsMobile } from "./hooks/useIsMobile";

export default function MobileGate({ children }: { children: React.ReactNode }) {
    const isMobile = useIsMobile();

    if (!isMobile) return <>{children}</>;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 text-center">

                <div className="flex justify-center mb-3">
                    <MonitorX size={40} className="text-amber-500" />
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Desktop Required
                </h2>

                <p className="text-sm text-gray-600">
                    This dashboard is not available on mobile devices yet. Please visit on a desktop or larger screen to view the full analytics.
                </p>

                <p className="text-xs text-gray-400 mt-3">
                    Minimum width: 1600px
                </p>
            </div>
        </div>
    );
}