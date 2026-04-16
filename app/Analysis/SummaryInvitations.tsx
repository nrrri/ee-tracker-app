import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { InvitationData } from '../type/Type';
import { CustomTooltipSummary } from '@/components/CustomTooltip';
import { allCategorise, getColorFromName } from '../constant';

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

            if (!currMap.has(key)) {
                currMap.set(key, { currentYear: 0, invitation: 0 });
            }

            const entry = currMap.get(key)!;
            entry.currentYear += curr.drawSize;
            entry.invitation += 1;
        });

    drawData
        .filter(d => d.drawYear === currYear - 1)
        .forEach(curr => {
            const key = getCategory(curr.drawName);

            if (!prevMap.has(key)) {
                prevMap.set(key, { prevYear: 0, invitation: 0 });
            }

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

    // dynamic height: 52px per bar
    const chartHeight = chartData.length * 42;
    return (
        <div className="w-150 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-1">Draw Summary of {currYear}</h1>
            <p className="text-gray-500 mb-4 text-l">
                Total Invitations: <span className="text-[#C71D36] font-bold">{totalInvitationCurrentYear()}</span> <span className='text-xs'><a href='https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/corporate-initiatives/levels/supplementary-immigration-levels-2026-2028.html'>/85,000-120,000*</a></span>
            </p>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 0, right: 80, bottom: 0, left: 0 }}
                >
                    <XAxis
                        type="number"
                        hide={true}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 14, fill: '#000' }}
                        axisLine={false}
                        tickLine={false}
                        width={155}
                    />
                    <Tooltip content={<CustomTooltipSummary />} />
                    <Bar dataKey="currentYear" radius={[0, 3, 3, 0]} maxBarSize={28}>
                        {chartData.map((drawName, index) => (
                            <Cell
                                key={index}
                                fill={getColorFromName(drawName.name)}
                            />
                        ))}
                        {/* shows "45,000 [12]" at end of each bar */}
                        <LabelList
                            content={({ x, y, width, height, value, index }) => {
                                const item = chartData[index as number];
                                return (
                                    <text
                                        x={Number(x) + Number(width) + 8}
                                        y={Number(y) + Number(height) / 2}
                                        dominantBaseline="middle"
                                        fontSize={12}
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
                            <Cell
                                key={`${drawName}-${index}`}
                                fill={'#dfdfdf'}
                            />
                        ))}
                        {/* shows "45,000 [12]" at end of each bar */}
                        <LabelList
                            content={({ x, y, width, height, value, index }) => {
                                const item = chartData[index as number];
                                return (
                                    <text
                                        x={Number(x) + Number(width) + 8}
                                        y={Number(y) + Number(height) / 2}
                                        dominantBaseline="middle"
                                        fontSize={12}
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
    );
}