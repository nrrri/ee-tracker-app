import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { InvitationData } from '../type/Type';
import { CustomTooltipSummary } from '@/components/CustomTooltip';
import { allCategorise, getColorFromName } from '../constant';
import { ExternalLink } from 'lucide-react';

type SummaryInvitationsProps = {
    drawData: InvitationData[];
    currYear: number;
}

export default function SummaryInvitations({ drawData, currYear }: SummaryInvitationsProps) {
    const currMap = new Map<string, { currentYear: number; invitation: number }>();
    const prevMap = new Map<string, { prevYear: number; invitation: number }>();

    const totalInvitationCurrentYear = () => {
        const total = drawData.reduce((acc, curr) => {
            const drawYear = new Date(curr.drawDate).getFullYear();
            if (drawYear === currYear) {
                return acc + Number(curr.drawSize);
            }
            return acc;
        }, 0);
        return total.toLocaleString();
    };

    const getCategory = (input: string) => {
        const lower = input.toLowerCase();
        return (
            allCategorise.find(cat => {
                const catLower = cat.toLowerCase();
                const normalize = (str: string) =>
                    str.replace(/-/g, ' ')
                        .replace(/s\b/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                return normalize(lower).includes(normalize(catLower)) ||
                    normalize(catLower).includes(normalize(lower.split('(')[0].trim()));
            }) || "Other"
        );
    };

    drawData
        .filter(d => d.drawYear === currYear)
        .forEach(curr => {
            const key = getCategory(curr.drawName);
            if (!currMap.has(key)) currMap.set(key, { currentYear: 0, invitation: 0 });
            const entry = currMap.get(key)!;
            entry.currentYear += curr.drawSize;
            entry.invitation += 1;
        });

    drawData
        .filter(d => d.drawYear === currYear - 1)
        .forEach(curr => {
            const key = getCategory(curr.drawName);
            if (!prevMap.has(key)) prevMap.set(key, { prevYear: 0, invitation: 0 });
            const entry = prevMap.get(key)!;
            entry.prevYear += curr.drawSize;
            entry.invitation += 1;
        });

    const chartData = Array.from(
        new Set([...currMap.keys(), ...prevMap.keys()])
    )
        .map(name => ({
            name,
            currentYear: currMap.get(name)?.currentYear ?? 0,
            prevYear: prevMap.get(name)?.prevYear ?? 0,
            currentInvitations: currMap.get(name)?.invitation ?? 0,
            prevInvitations: prevMap.get(name)?.invitation ?? 0,
        }))
        .sort((a, b) => b.currentYear - a.currentYear);

    const chartHeight = chartData.length * 42;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6">
            {/* Card header — matches AnalysisCard / SumNewCandidates */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-base font-semibold text-gray-900 text-start">
                        Draw Summary of {currYear}
                    </h1>
                    <p className="text-xs text-gray-400 mt-0.5">Invitations by category vs prior year</p>
                </div>
            </div>

            {/* Total invitations row — dot accent like drawName in AnalysisCard */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#C71D36]" />
                <p className="text-sm text-gray-500">
                    Total Invitations:{" "}
                    <span className="text-[#C71D36] font-semibold">{totalInvitationCurrentYear()}</span>
                </p>
                <a
                    href="https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/corporate-initiatives/levels/supplementary-immigration-levels-2026-2028.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors ml-1"
                >
                    /85,000–120,000
                    <ExternalLink size={11} />
                </a>
            </div>

            {/* Chart */}
            <div className="overflow-x-auto">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                    >
                        <XAxis type="number" hide={true} />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                            width={155}
                        />
                        <Tooltip content={<CustomTooltipSummary />} />
                        <Bar dataKey="currentYear" radius={[0, 3, 3, 0]} maxBarSize={28}>
                            {chartData.map((drawName, index) => (
                                <Cell key={index} fill={getColorFromName(drawName.name)} />
                            ))}
                            <LabelList
                                content={({ x, y, width, height, value, index }) => {
                                    const item = chartData[index as number];
                                    return (
                                        <text
                                            x={Number(x) + Number(width) + 8}
                                            y={Number(y) + Number(height) / 2}
                                            dominantBaseline="middle"
                                            fontSize={11}
                                            fill="#6b7280"
                                        >
                                            {Number(value).toLocaleString()} [{item?.currentInvitations}]
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                        <Bar dataKey="prevYear" radius={[0, 3, 3, 0]} maxBarSize={28}>
                            {chartData.map((drawName, index) => (
                                <Cell key={`${drawName}-${index}`} fill="#dfdfdf" />
                            ))}
                            <LabelList
                                content={({ x, y, width, height, value, index }) => {
                                    const item = chartData[index as number];
                                    return (
                                        <text
                                            x={Number(x) + Number(width) + 8}
                                            y={Number(y) + Number(height) / 2}
                                            dominantBaseline="middle"
                                            fontSize={11}
                                            fill="#6b7280"
                                        >
                                            {Number(value).toLocaleString()} [{item?.prevInvitations}]
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}