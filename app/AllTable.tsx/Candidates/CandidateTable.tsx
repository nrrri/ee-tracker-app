"use client";
import { keywordPoolType } from "@/app/constant";
import { PoolData } from "../../type/Type";

type CandidateTableType = {
    poolData: PoolData[];
};

export default function CandidateTable({ poolData }: CandidateTableType) {
    const getBgColor = (current: number, next?: number) => {
        if (next === undefined) return "bg-gray-300";
        return current > next ? "bg-[#C8E856]" : "bg-[#FA8072]";
    };

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className={StyledHeaderTable}>Date</th>
                    {keywordPoolType.map((col) => (
                        <th key={col.key} className={StyledHeaderTable}>
                            {col.label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {poolData.map((draw, index) => {
                    const checkRange = index < poolData.length - 1;
                    const currYear = draw.drawDistributionAsOn?.split(", ")[1] ?? "";
                    const prevYear = checkRange ? poolData[index + 1]?.drawDistributionAsOn?.split(", ")[1] ?? "" : "";

                    const borderClass = checkRange && currYear !== prevYear ? "border-b-4 border-b-black" : "border-0";
                    return (
                        <tr key={draw.drawDistributionAsOn} className={`hover:bg-gray-100 ${borderClass}`}>
                            <td className={StyledBodyTable}>
                                {draw.drawDistributionAsOn}
                            </td>

                            {keywordPoolType.map((col) => {
                                const currentValue = draw[col.key];
                                const nextValue = poolData[index + 1]?.[col.key];

                                return (
                                    <td
                                        key={col.key}
                                        className={`${StyledBodyTable} ${getBgColor(
                                            currentValue,
                                            nextValue
                                        )}`}
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
    );
}

const StyledHeaderTable = `
px-6 py-3 text-center text-sm font-bold text-gray-500 uppercase tracking-wider
`;

const StyledBodyTable = `
px-6 py-4 whitespace-nowrap border border-gray-200
`;