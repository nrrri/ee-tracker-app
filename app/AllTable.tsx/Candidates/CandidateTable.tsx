"use client";
import { keywordPoolTypeTable } from "@/app/constant";
import { NewCandidateSummary, PoolData } from "../../type/Type";

type CandidateTableType = {
    poolData: PoolData[];
    newCandidateSummary: NewCandidateSummary[];
};

export default function CandidateTable({ poolData, newCandidateSummary }: CandidateTableType) {
    const getBgColor = (current: number, next?: number) => {
        if (next === undefined) return "bg-gray-300";
        return current > next ? "bg-[#C8E856]" : "bg-[#FA8072]";
    };

    const getFontColor = (current: number, next?: number) => {
        if (next === undefined) return "bg-gray-300";
        return current > next ? "text-[#C8E856] bg-gray-500" : "text-[#FA8072]  bg-gray-500";
    };
    const mergedPoolData = poolData.map((pool) => {
        const getAnalysis = newCandidateSummary.filter((da) => da.drawDistributionAsOn === pool.drawDistributionAsOn)[0]
        return { ...pool, newTotal: getAnalysis.newCandidate, new500: getAnalysis.newCandidateOver500 }
    })
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-100">
                <tr>
                    <th className={StyledHeaderTable}>Date</th>
                    {keywordPoolTypeTable.map((col) => (
                        <th key={col.key} className={`${StyledHeaderTable} ${col.key === "new500" || col.key === "newTotal"
                            ? "w-20"
                            : ""
                            }`}>
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {mergedPoolData.map((draw, index) => {
                    const checkRange = index < poolData.length - 1;
                    const currYear = draw.drawDistributionAsOn?.split(", ")[1] ?? "";
                    const prevYear = checkRange ? poolData[index + 1]?.drawDistributionAsOn?.split(", ")[1] ?? "" : "";

                    const borderClass = checkRange && currYear !== prevYear ? "border-b-4 border-b-black" : "border-0";
                    return (
                        <tr key={draw.drawDistributionAsOn} className={`hover:bg-gray-100 ${borderClass}`}>
                            <td className={`${StyledBodyTable} sticky left-0 bg-white`}>
                                {draw.drawDistributionAsOn}
                            </td>

                            {keywordPoolTypeTable.map((col) => {

                                const currentValue = draw[col.key];
                                const nextValue = mergedPoolData[index + 1]?.[col.key];

                                return (
                                    <td
                                        key={col.key}
                                        className={`${StyledBodyTable}  ${!['new500', 'newTotal'].includes(col.key) ? getBgColor(
                                            currentValue,
                                            nextValue
                                        ) : getFontColor(currentValue,
                                            nextValue)}`}
                                    >
                                        {currentValue.toLocaleString()}
                                    </td>

                                )

                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

const StyledHeaderTable = `
px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider
`;

const StyledBodyTable = `
px-6 py-4 whitespace-nowrap border border-gray-200
`;