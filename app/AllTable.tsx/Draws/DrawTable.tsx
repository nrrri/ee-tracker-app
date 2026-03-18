"use client";
import { getColorFromName } from "@/app/constant";
import { InvitationData } from "../../type/Type";

type DrawTableType = {
    drawData: InvitationData[];
};

export default function DrawTable({ drawData }: DrawTableType) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className={StyledHeaderTable}>Draw Number</th>
                    <th className={StyledHeaderTable}>Date</th>
                    <th className={StyledHeaderTable}>Round type</th>
                    <th className={StyledHeaderTable}>Invitations Issued</th>
                    <th className={StyledHeaderTable}>CRS score of lowest-ranked candidate invited</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-900">
                {drawData.map((draw, index) => {
                    const checkRange = index < drawData.length - 1;
                    const currYear = draw.drawDistributionAsOn?.split(", ")[1] ?? "";
                    const prevYear =
                        checkRange
                            ? drawData[index + 1]?.drawDistributionAsOn?.split(", ")[1] ?? ""
                            : "";

                    const borderClass = checkRange && currYear !== prevYear ? "border-b-4 border-b-black" : "border-0";
                    
                    return (
                        <tr key={draw.drawNumber} className={`hover:bg-gray-100 ${borderClass}`} style={{ borderLeft: 1 }}>
                            <td className={StyledBodyTable}>{draw.drawNumber}</td>
                            <td className={StyledBodyTable}>{draw.drawDateFull}</td>
                            <td style={{ borderLeftColor: getColorFromName(draw.drawName) }} className={`${StyledBodyTable} border-l-30`}>{draw.drawName}</td>
                            <td className={StyledBodyTable}>{draw.drawSize.toLocaleString()}</td>
                            <td className={StyledBodyTable}>{draw.drawCRS}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

const StyledHeaderTable = `
px-6 py-3 text-center text-sm font-bold text-gray-500 tracking-wider
`;

const StyledBodyTable = `
px-6 py-4 whitespace-nowrap border border-gray-200
`;