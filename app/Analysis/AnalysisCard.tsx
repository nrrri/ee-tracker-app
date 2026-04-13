"use client";

import { InvitationData } from "../type/Type";

type AnalysisCardType = {
    drawData: InvitationData[];
}

export default function AnalysisCard({ drawData }: AnalysisCardType) {
    const latest = drawData[0];

    const rows = [
        { label: "Draw #", value: latest?.drawNumber },
        { label: "Date", value: latest?.drawDateFull },
        { label: "CRS Cut-off", value: latest?.drawCRS },
        { label: "Invitations", value: latest?.drawSize?.toLocaleString() },
        { label: "Tie-breaking", value: latest?.drawCutOff },
    ];

    return (
        <div className="w-150 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-1">Latest Round</h1>
            <p className="text-[#C71D36] font-bold mb-4 text-l">{latest?.drawName}</p>

            <table className="w-full text-sm">
                <tbody>
                    {rows.map(({ label, value }) => (
                        <tr key={label} className="border-t border-gray-100">
                            <td className="py-2.5 pr-4 text-gray-500 font-medium w-36">{label}</td>
                            <td className="py-2.5 text-gray-800">{value ?? '—'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}