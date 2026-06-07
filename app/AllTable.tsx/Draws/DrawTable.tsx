"use client";

import { getColorFromName, HEADERS } from "@/app/constant";
import { InvitationData } from "../../type/Type";

// ─── Types ────────────────────────────────────────────────────────────────────

type DrawTableProps = {
    drawData: InvitationData[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYear(dateString?: string): string {
    return dateString?.split(", ")[1] ?? "";
}

function getRowBorderClass(draw: InvitationData, next: InvitationData | undefined): string {
    if (!next) return "border-0";
    const crossesYearBoundary = extractYear(draw.drawDistributionAsOn) !== extractYear(next.drawDistributionAsOn);
    return crossesYearBoundary ? "border-b-4 border-b-black" : "border-0";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TableHeader() {
    return (
        <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
                {HEADERS.map((heading) => (
                    <th key={heading} className={cx.header}>
                        {heading}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

type DrawRowProps = {
    draw: InvitationData;
    next: InvitationData | undefined;
    index: number;
};

function DrawRow({ draw, next, index }: DrawRowProps) {
    const borderClass = getRowBorderClass(draw, next);

    return (
        <tr
            className={`transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                } ${borderClass}`}
        >
            <td className={cx.cell}>{draw.drawNumber}</td>
            <td className={cx.cell}>{draw.drawDateFull}</td>
            <td
                className={`${cx.cell} border-r-8`}
                style={{ borderRightColor: getColorFromName(draw.drawName) }}
            >
                {draw.drawName}
            </td>
            <td className={`${cx.cell} tabular-nums`}>{draw.drawSize.toLocaleString()}</td>
            <td className={`${cx.cell} tabular-nums`}>{draw.drawCRS}</td>
            <td className={cx.cell}>{draw.drawCutOff}</td>
        </tr>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DrawTable({ drawData }: DrawTableProps) {
    return (
        <div className="bg-white border-gray-100">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h1 className="text-base font-semibold text-gray-900">Draw History</h1>
                    <p className="text-xs text-gray-400 mt-0.5">All Express Entry rounds</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
                    {drawData.length} draws
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <TableHeader />
                    <tbody className="divide-y divide-gray-50 text-gray-800">
                        {drawData.map((draw, index) => (
                            <DrawRow
                                key={draw.drawNumber}
                                draw={draw}
                                next={drawData[index + 1]}
                                index={index}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const cx = {
    header: "px-5 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide",
    cell: "px-5 py-2.5 text-xs whitespace-nowrap",
} as const;