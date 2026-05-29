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
        <thead className="bg-gray-100">
            <tr>
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
};

function DrawRow({ draw, next }: DrawRowProps) {
    const borderClass = getRowBorderClass(draw, next);

    return (
        <tr
            key={draw.drawNumber}
            className={`hover:bg-gray-100 ${borderClass}`}
        >
            <td className={cx.cell}>{draw.drawNumber}</td>
            <td className={cx.cell}>{draw.drawDateFull}</td>
            <td
                className={`${cx.cell} border-l-30`}
                style={{ borderLeftColor: getColorFromName(draw.drawName) }}
            >
                {draw.drawName}
            </td>
            <td className={cx.cell}>{draw.drawSize.toLocaleString()}</td>
            <td className={cx.cell}>{draw.drawCRS}</td>
            <td className={cx.cell}>{draw.drawCutOff}</td>
        </tr>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DrawTable({ drawData }: DrawTableProps) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <TableHeader />
            <tbody className="bg-white divide-y divide-gray-100 text-gray-900">
                {drawData.map((draw, index) => (
                    <DrawRow
                        key={draw.drawNumber}
                        draw={draw}
                        next={drawData[index + 1]}
                    />
                ))}
            </tbody>
        </table>
    );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const cx = {
    header: "px-6 py-3 text-center text-sm font-bold text-gray-500 tracking-wider",
    cell: "px-6 py-4 whitespace-nowrap border border-gray-200",
} as const;
