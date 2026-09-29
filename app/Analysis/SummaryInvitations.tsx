import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { InvitationData } from '../type/Type';
import { CustomTooltipSummary } from '@/components/CustomTooltip';
import { allCategorise, getColorFromName, matchesCategory } from '../constant';
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
        return (
            allCategorise.find(cat =>
                matchesCategory(input, cat) ||
                matchesCategory(cat, input.split('(')[0])
            ) || "Other"
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
        <div className="w-full bg-white border border-gray-100 p-5 md:p-6">
            {/* Card header — matches AnalysisCard / SumNewCandidates */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                    <h1 className="text-base font-semibold text-gray-900 text-start">
                        Draw Summary of {currYear}
                    </h1>
                    <p className="text-xs text-start text-gray-400 mt-0.5">Invitations by category vs prior year</p>
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

            {/* Section label + legend — matches SumNewCandidates table labels */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                        By Category
                    </h2>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-linear-to-r from-[#FC4024] via-[#F8991D] to-[#00859C]" />
                        {currYear}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#dfdfdf]" />
                        {currYear - 1}
                    </span>
                    <span className="text-gray-400">[n] = draws</span>
                </div>
            </div>

            {/* Chart */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm py-3 pr-2">
                <ResponsiveContainer width="100%" height={chartHeight}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 80, bottom: 0, left: 0 }}
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