"use client";

import { NewCandidateSummary, PivotRow } from "../type/Type";

type SumNewCandidatesProps = {
    newCandidateSummary: NewCandidateSummary[];
};

const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// ✅ Moved outside parent component to avoid re-creation on every render
const PivotTable = ({ data, label }: { data: PivotRow[]; label: string }) => {
    if (!data.length) return null;
    const years = Object.keys(data[0]).filter((k) => k !== "month").reverse();

    return (
        <div className="flex-1 min-w-0">
            {/* Table header label */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    {label}
                </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide w-28">
                                Month
                            </th>
                            {years.map((y) => (
                                <th
                                    key={y}
                                    className="text-right px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide"
                                >
                                    {y}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {data.map((row, i) => (
                            <tr
                                key={row.month}
                                className={`transition-colors hover:bg-blue-50/40 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                    }`}
                            >
                                <td className="px-4 py-2.5 font-medium text-gray-700 text-xs">
                                    {row.month}
                                </td>
                                {years.map((y) => {
                                    const val = (row[y] as number) ?? 0;
                                    return (
                                        <td
                                            key={y}
                                            className={`px-4 py-2.5 text-right tabular-nums text-xs ${val !== 0
                                                ? "text-gray-800 font-medium"
                                                : "text-gray-300"
                                                }`}
                                        >
                                            {val !== 0 ? val.toLocaleString() : "—"}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function SumNewCandidates({ newCandidateSummary }: SumNewCandidatesProps) {
    const groupByMonth = (
        data: NewCandidateSummary[],
        metric: "newCandidate" | "newCandidateOver500"
    ): PivotRow[] => {
        const map: Record<string, Record<string, number>> = {};
        const yearsSet = new Set<string>();

        for (const item of data) {
            const date = new Date(item.drawDistributionAsOn);
            const month = date.toLocaleString("en-US", { month: "long" });
            const year = String(date.getFullYear());
            if (Number(year) > 2023) {
                yearsSet.add(year);
                if (!map[month]) map[month] = {};
                if (!map[month][year]) map[month][year] = 0;
                map[month][year] += item[metric];
            }
        }

        const years = Array.from(yearsSet).sort();

        // ✅ Sort months chronologically instead of alphabetically
        return MONTH_ORDER
            .filter((month) => map[month])
            .map((month) => {
                const row: PivotRow = { month };
                for (const year of years) {
                    row[year] = map[month][year] ?? 0;
                }
                return row;
            });
    };

    const newCandidateTable = groupByMonth(newCandidateSummary, "newCandidate");
    const over500Table = groupByMonth(newCandidateSummary, "newCandidateOver500");

    // ✅ Guard against empty data
    if (!newCandidateSummary.length) {
        return (
            <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-100 p-5 md:p-6">
            {/* Card header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 sticky top-0 bg-white z-50">
                <div>
                    <h1 className="text-base text-start font-semibold text-gray-900">
                        New Candidates Summary
                    </h1>
                    <p className="text-xs text-start text-gray-400 mt-0.5">Monthly breakdown by draw date</p>
                </div>
                {/* <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
                    {newCandidateSummary.length} draws
                </span> */}
            </div>

            {/* ✅ Side-by-side tables; stack on small screens */}
            <div className="flex flex-col lg:flex-row gap-6">
                <PivotTable data={newCandidateTable} label="New Candidates" />

                {/* Divider — visible only on large screens */}
                <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

                <PivotTable data={over500Table} label="New Candidates 501-600" />
            </div>
        </div>
    );
}