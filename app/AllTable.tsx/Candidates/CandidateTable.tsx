"use client";
import { keywordPoolTypeTable } from "@/app/constant";
import { NewCandidateSummary, PoolData } from "../../type/Type";

type CandidateTableType = {
    poolData: PoolData[];
    newCandidateSummary: NewCandidateSummary[];
};

export default function CandidateTable({ poolData, newCandidateSummary }: CandidateTableType) {
    const getBgColor = (current: number, next?: number) => {
        if (next === undefined) return "bg-gray-200";
        return current > next ? "bg-[#C8E856]" : "bg-[#FA8072]";
    };

    const getFontColor = (current: number, next?: number) => {
        if (next === undefined) return "text-gray-400";
        return current > next
            ? "text-[#7a9900] font-semibold"
            : "text-[#c0392b] font-semibold";
    };

    const mergedPoolData = poolData.map((pool) => {
        const getAnalysis = newCandidateSummary.filter(
            (da) => da.drawDistributionAsOn === pool.drawDistributionAsOn
        )[0];
        return {
            ...pool,
            newTotal: getAnalysis.newCandidate,
            new500: getAnalysis.newCandidateOver500,
        };
    });

    return (
        <div className="bg-white border-gray-100">
            {/* Table */}
            <div className="overflow-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <th className={`${cx.header} sticky left-0 bg-gray-50 z-20`}>
                                Date
                            </th>
                            {keywordPoolTypeTable.map((col) => (
                                <th
                                    key={col.key}
                                    className={`${cx.header} ${col.key === "new500" || col.key === "newTotal" ? "w-20" : ""
                                        }`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-50">
                        {mergedPoolData.map((draw, index) => {
                            const checkRange = index < poolData.length - 1;
                            const currYear = draw.drawDistributionAsOn?.split(", ")[1] ?? "";
                            const prevYear = checkRange
                                ? poolData[index + 1]?.drawDistributionAsOn?.split(", ")[1] ?? ""
                                : "";
                            const borderClass =
                                checkRange && currYear !== prevYear
                                    ? "border-b-4 border-b-black"
                                    : "";

                            return (
                                <tr
                                    key={draw.drawDistributionAsOn}
                                    className={`transition-colors hover:bg-blue-50/40 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                        } ${borderClass}`}
                                >
                                    <td className={`${cx.cell} sticky left-0 bg-inherit font-medium text-gray-700`}>
                                        {draw.drawDistributionAsOn}
                                    </td>

                                    {keywordPoolTypeTable.map((col) => {
                                        const currentValue = draw[col.key];
                                        const nextValue = mergedPoolData[index + 1]?.[col.key];
                                        const isNewCol = ["new500", "newTotal"].includes(col.key);

                                        return (
                                            <td
                                                key={col.key}
                                                className={`${cx.cell} tabular-nums text-center ${isNewCol
                                                    ? getFontColor(currentValue, nextValue)
                                                    : getBgColor(currentValue, nextValue)
                                                    }`}
                                            >
                                                {currentValue.toLocaleString()}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const cx = {
    header: "px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center",
    cell: "px-5 py-2.5 text-xs whitespace-nowrap",
} as const;