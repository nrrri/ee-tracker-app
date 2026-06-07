"use client";

import { InvitationData } from "../type/Type";

type AnalysisCardType = {
    drawData: InvitationData[];
};

export default function AnalysisCard({ drawData }: AnalysisCardType) {
    const latest = drawData[0];

    const rows = [
        { label: "Draw #", value: latest?.drawNumber },
        { label: "Date", value: latest?.drawDateFull },
        { label: "CRS Cut-off", value: latest?.drawCRS },
        { label: "Invitations", value: latest?.drawSize?.toLocaleString() },
        { label: "Tie-breaking", value: latest?.drawCutOff },
    ];

    if (!latest) {
        return (
            <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6">
            {/* Card header — matches SumNewCandidates */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-base text-start font-semibold text-gray-900">Latest Round</h1>
                    <p className="text-xs text-gray-400 mt-0.5">Most recent draw details</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
                    #{latest.drawNumber}
                </span>
            </div>

            {/* Draw name — kept prominent with red accent */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#C71D36]" />
                <p className="text-sm font-semibold text-[#C71D36] wrap-break-word">
                    {latest.drawName}
                </p>
            </div>

            {/* Table — matches inner table style */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <tbody className="divide-y divide-gray-50">
                        {rows.map(({ label, value }, i) => (
                            <tr
                                key={label}
                                className={`transition-colors hover:bg-blue-50/40 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                    }`}
                            >
                                <td className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28 md:w-36">
                                    {label}
                                </td>
                                <td className="px-4 py-2.5 text-xs font-medium text-gray-800 wrap-break-word">
                                    {value ?? "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}