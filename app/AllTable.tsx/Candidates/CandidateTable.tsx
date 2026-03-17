"use client";
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
                    <th className={StyledHeaderTable}>600+</th>
                    <th className={StyledHeaderTable}>501-600</th>
                    <th className={StyledHeaderTable}>451-500</th>
                    <th className={StyledHeaderTable}>351-400</th>
                    <th className={StyledHeaderTable}>301-350</th>
                    <th className={StyledHeaderTable}>0-300</th>
                    <th className={StyledHeaderTable}>Total Candidates</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-900">
                {poolData.map((draw, index) => {
                    const checkRange = index < poolData.length - 1;
                    const currYear = draw.drawDistributionAsOn?.split(", ")[1] ?? "";
                    const prevYear = checkRange ? poolData[index + 1]?.drawDistributionAsOn?.split(", ")[1] ?? "" : "";

                    const borderClass = checkRange && currYear !== prevYear ? "border-b-4 border-b-black" : "border-0";

                    return (
                        <tr key={draw.drawDistributionAsOn} className={`hover:bg-gray-100 ${borderClass}`}>
                            <td className={StyledBodyTable}>{draw.drawDistributionAsOn}</td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range601_1200, poolData[index + 1]?.range601_1200)}`}>
                                {draw.range601_1200.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range501_600, poolData[index + 1]?.range501_600)}`}>
                                {draw.range501_600.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range451_500, poolData[index + 1]?.range451_500)}`}>
                                {draw.range451_500.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range351_400, poolData[index + 1]?.range351_400)}`}>
                                {draw.range351_400.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range301_350, poolData[index + 1]?.range301_350)}`}>
                                {draw.range301_350.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.range0_300, poolData[index + 1]?.range0_300)}`}>
                                {draw.range0_300.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${getBgColor(draw.totalCandidates, poolData[index + 1]?.totalCandidates)}`}>
                                {draw.totalCandidates.toLocaleString()}
                            </td>
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