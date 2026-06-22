"use client";

import { BaseDraw, InvitationData, MergedRow, MetricConfig, NewCandidateSummary, PivotRow } from "../type/Type";

type SumNewCandidatesProps = {
    newCandidateSummary: NewCandidateSummary[];
    getCECDraws: InvitationData[]
};

const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

// ---- Simple single-metric pivot table (used for "New Candidates") ----
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



// ---- Two-metric pivot table with grouped year headers ----
// Renders:
//            |        2026        |        2025        |
//            | newCandidateOver500 | drawSize | ... |
const MergedPivotTable = ({
    data,
    years,
    metrics,
    label,
}: {
    data: MergedRow[];
    years: string[];
    metrics: MetricConfig[];
    label: string;
}) => {
    if (!data.length) return null;

    return (
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                    {label}
                </h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        {/* Year row (each year spans its metric columns) */}
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th
                                rowSpan={2}
                                className="text-left px-4 py-2.5 font-semibold text-gray-600 text-xs uppercase tracking-wide w-28 align-bottom"
                            >
                                Month
                            </th>
                            {years.map((y) => (
                                <th
                                    key={y}
                                    colSpan={metrics.length}
                                    className="text-center px-4 py-2 font-semibold text-gray-700 text-xs uppercase tracking-wide border-l border-gray-100"
                                >
                                    {y}
                                </th>
                            ))}
                        </tr>
                        {/* Metric sub-row */}
                        <tr className="bg-gray-50 border-b border-gray-100">
                            {years.map((y) =>
                                metrics.map((m, mi) => (
                                    <th
                                        key={`${y}-${m.key}`}
                                        className={`text-right px-4 py-2 font-medium text-gray-500 text-[11px] uppercase tracking-wide ${mi === 0 ? "border-l border-gray-100" : ""
                                            }`}
                                    >
                                        {m.label}
                                    </th>
                                ))
                            )}
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
                                {years.map((y) =>
                                    metrics.map((m, mi) => {
                                        const val = (row[`${y}__${m.key}`] as number) ?? 0;
                                        return (
                                            <td
                                                key={`${y}-${m.key}`}
                                                className={`px-4 py-2.5 text-right tabular-nums text-xs ${mi === 0 ? "border-l border-gray-100" : ""
                                                    } ${val !== 0 ? "text-gray-800 font-medium" : "text-gray-300"}`}
                                            >
                                                {val !== 0 ? val.toLocaleString() : "—"}
                                            </td>
                                        );
                                    })
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function SumNewCandidates({ newCandidateSummary, getCECDraws }: SumNewCandidatesProps) {
    const groupByMonth = <T extends BaseDraw>(
        data: T[],
        metric: keyof Omit<T, "drawDistributionAsOn">
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

                map[month][year] += Number(item[metric] ?? 0);
            }
        }

        const years = Array.from(yearsSet).sort();

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

    // ✅ Generic: group + merge ANY number of (data, metric) sources into one
    // pivot keyed by month -> year -> metricKey -> sum
    const groupByMonthMerged = (
        sources: { data: BaseDraw[]; metricField: string; metricKey: string }[]
    ): { rows: MergedRow[]; years: string[] } => {
        const map: Record<string, Record<string, Record<string, number>>> = {};
        const yearsSet = new Set<string>();

        for (const { data, metricField, metricKey } of sources) {
            for (const item of data) {
                const date = new Date(item.drawDistributionAsOn);
                const month = date.toLocaleString("en-US", { month: "long" });
                const year = String(date.getFullYear());

                if (Number(year) > 2023) {
                    yearsSet.add(year);

                    if (!map[month]) map[month] = {};
                    if (!map[month][year]) map[month][year] = {};
                    if (!map[month][year][metricKey]) map[month][year][metricKey] = 0;

                    const val = Number((item as Record<string, unknown>)[metricField] ?? 0);
                    map[month][year][metricKey] += val;
                }
            }
        }

        const years = Array.from(yearsSet).sort().reverse();

        const rows = MONTH_ORDER
            .filter((month) => map[month])
            .map((month) => {
                const row: MergedRow = { month };

                for (const year of years) {
                    for (const { metricKey } of sources) {
                        row[`${year}__${metricKey}`] = map[month]?.[year]?.[metricKey] ?? 0;
                    }
                }

                return row;
            });

        return { rows, years };
    };

    const newCandidateTable = groupByMonth(newCandidateSummary, "newCandidate"); // own table

    // ✅ Merge newCandidateOver500 + drawSize into a single pivot
    const { rows: mergedRows, years: mergedYears } = groupByMonthMerged([
        { data: newCandidateSummary, metricField: "newCandidateOver500", metricKey: "over500" },
        { data: getCECDraws, metricField: "drawSize", metricKey: "drawSize" },
    ]);

    const mergedMetrics: MetricConfig[] = [
        { key: "over500", label: "501-600" },
        { key: "drawSize", label: "Total Draws" },
    ];

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
            </div>

            {/* ✅ Side-by-side tables; stack on small screens */}
            <div className="flex flex-col lg:flex-col gap-6">
                <PivotTable data={newCandidateTable} label="New Candidates" />

                {/* Divider — visible only on large screens */}
                <div className="hidden lg:block w-px bg-gray-100 self-stretch" />

                <MergedPivotTable
                    data={mergedRows}
                    years={mergedYears}
                    metrics={mergedMetrics}
                    label="New Candidates 501-600 & Total CEC draws By month"
                />
            </div>
        </div>
    );
}