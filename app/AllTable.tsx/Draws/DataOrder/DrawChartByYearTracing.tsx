"use client";

import { ChartContainer } from "@/components/ui/chart";
import { FilterChip } from "@/components/FilterBox";
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, LabelProps, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { CustomTooltipAnalysis } from "@/components/CustomTooltip";
import FilterDropdown from "@/components/FilterDropdown";
import { DataOption, InvitationData, PoolData } from "@/app/type/Type";
import { chartConfig, fadeHex, getColorFromName, matchesCategory, maxBalance, minBalance, USER_CRS_COLOR } from "@/app/constant";
import { useIsMobile } from "@/components/hooks/useIsMobile";
import { useCrs } from "@/components/CrsCalculator";
import { calculateCrs } from "@/lib/crs";

type DrawChartByYearTracingProp = {
    drawData: InvitationData[]
    poolData: PoolData[]
    drawOptions: DataOption[]
}

// number of most recent years available to compare
const MAX_COMPARE_YEARS = 3;

const getYear = (item: InvitationData) => new Date(item.drawDateFull).getFullYear();

const monthDay = (date: string) => {
    const d = new Date(date);
    return d.getMonth() * 100 + d.getDate();
};

export default function DrawChartByYearTracing({ drawData, poolData, drawOptions }: DrawChartByYearTracingProp) {
    const [addFilterType, setAddFilterType] = useState<string[]>(['Canadian Experience Class']);
    // hide per-point CRS labels on narrow screens where they would overlap (tooltip still shows them)
    const isNarrow = useIsMobile(1024);

    // latest years across all draws, newest first
    const yearOptions = useMemo(() =>
        [...new Set(drawData.map(getYear))].sort((a, b) => b - a).slice(0, MAX_COMPARE_YEARS),
        [drawData]
    );
    const [selectedYears, setSelectedYears] = useState<number[]>(yearOptions);
    const { profile: crsProfile, score: crsToday, openEditor } = useCrs();
    const [showUserCrs, setShowUserCrs] = useState(true);
    // the viewer's score is projected across the latest year with draws
    const latestYear = yearOptions[0] ?? new Date().getFullYear();

    const categoryDraws = useMemo(() =>
        drawData.filter(item =>
            addFilterType.some(k => matchesCategory(item.drawName, k))
        ),
        [drawData, addFilterType]
    );

    // years to plot, newest first
    const years = yearOptions.filter(year => selectedYears.includes(year));

    // newest year uses the category color, older years get progressively lighter teal
    const lineColors: Record<number, string> = {};
    const barColors: Record<number, string> = {};
    years.forEach((year, index) => {
        if (index === 0) {
            lineColors[year] = getColorFromName(addFilterType[0]);
            barColors[year] = fadeHex(getColorFromName(addFilterType[0]), 0.8);
        } else {
            lineColors[year] = fadeHex("#004242", Math.min(0.4 + 0.2 * (index - 1), 0.85));
            barColors[year] = fadeHex("#004242", Math.min(0.8 + 0.1 * (index - 1), 0.95));
        }
    });

    // transform data: every draw of the selected years, ordered by month/day so years overlay
    const chartData = categoryDraws
        .filter(item => years.includes(getYear(item)))
        .sort((a, b) => monthDay(a.drawDateFull) - monthDay(b.drawDateFull))
        .map((item) => {
            const year = getYear(item);
            // same month/day in the latest year, so age and work experience reflect that date
            const drawDate = new Date(item.drawDateFull);
            const projectedDate = new Date(latestYear, drawDate.getMonth(), drawDate.getDate());
            const nextYearDate = new Date(latestYear + 1, drawDate.getMonth(), drawDate.getDate());
            const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const filterCandidates = poolData.find((pool) =>
            (pool.drawDistributionAsOn === item.drawDistributionAsOn && item.drawName === 'Canadian Experience Class'
            ))

            return {
                label: item.drawDateFull,
                year,
                drawSize: item.drawSize,
                [`year_${year}`]: item.drawCRS,
                drawCRS: item.drawCRS,
                candidatesIn500: filterCandidates?.range501_600,
                dateInPool: item.drawDistributionAsOn,
                dateCutOff: item.drawCutOff,
                userCRS: showUserCrs ? calculateCrs(crsProfile, projectedDate)?.total : undefined,
                userCRSDate: formatDate(projectedDate),
                // one year ahead: same date next year, older and with more Canadian experience
                userCRSNext: showUserCrs ? calculateCrs(crsProfile, nextYearDate)?.total : undefined,
                userCRSNextDate: formatDate(nextYearDate),
            };
        });

    // keep both of the viewer's score lines inside the left axis
    const userScores = chartData
        .flatMap(d => [d.userCRS, d.userCRSNext])
        .filter((s): s is number => s !== undefined);

    // score tag on the first point and each step of a viewer line, not on every draw.
    // this year: filled tag; next year: outlined tag. The higher line's tag sits above it and
    // the lower line's below, so the two tags never collide (ties: this year above).
    const userCrsLabel = (key: "userCRS" | "userCRSNext", filled: boolean) =>
        function UserCrsLabel({ x, y, value, index }: LabelProps) {
            const i = Number(index);
            if (value === undefined || (i > 0 && chartData[i - 1]?.[key] === value)) return null;
            const text = String(value);
            const width = text.length * 8 + 12;
            const current = chartData[i]?.userCRS ?? 0;
            const next = chartData[i]?.userCRSNext ?? 0;
            const above = filled ? current >= next : next > current;
            const top = above ? Number(y) - 26 : Number(y) + 8;
            return (
                <g>
                    <rect
                        x={Number(x) - width / 2}
                        y={top}
                        width={width}
                        height={18}
                        rx={9}
                        fill={filled ? USER_CRS_COLOR : "#ffffff"}
                        stroke={USER_CRS_COLOR}
                        strokeWidth={filled ? 0 : 1.5}
                    />
                    <text
                        x={Number(x)}
                        y={top + 9}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={600}
                        fill="#111827"
                    >
                        {text}
                    </text>
                </g>
            );
        };
    const leftDomain = [
        Math.min(minBalance(chartData), ...userScores.map(s => Math.floor((s - 10) / 10) * 10)),
        Math.max(maxBalance(chartData, addFilterType), ...userScores.map(s => Math.ceil((s + 10) / 10) * 10)),
    ];

    const toggleYear = (year: number) => {
        setSelectedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    return (
        <div className="w-full">
            <div className="flex justify-center px-4">
                <div className="w-full max-w-180 p-4 md:pl-16 bg-gray-50 rounded-xl shadow-lg mb-8 md:mb-12 flex flex-col gap-4">
                    <FilterDropdown
                        options={drawOptions}
                        addFilterType={addFilterType}
                        setAddFilterType={setAddFilterType}
                        pool={false}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-gray-700 whitespace-nowrap">
                            Compare years
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {yearOptions.map((year) => (
                                <FilterChip
                                    key={year}
                                    label={String(year)}
                                    selected={selectedYears.includes(year)}
                                    onToggle={() => toggleYear(year)}
                                    color={lineColors[year]}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-gray-700 whitespace-nowrap">
                            Your CRS
                        </span>
                        {crsToday ? (
                            <>
                                <FilterChip
                                    label={`${crsToday.total} · show on chart`}
                                    selected={showUserCrs}
                                    onToggle={() => setShowUserCrs(s => !s)}
                                    color={USER_CRS_COLOR}
                                />
                                <button
                                    type="button"
                                    onClick={openEditor}
                                    className="text-xs text-gray-500 hover:text-gray-800 hover:underline underline-offset-2"
                                >
                                    Edit
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={openEditor}
                                className="rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-400 hover:bg-white transition-colors"
                            >
                                + Add your CRS to the chart
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {chartData.length > 0 ? (
                <div className="w-full">
                    <ChartContainer config={chartConfig} className="h-[520px] md:h-200">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={60}
                                axisLine={false}
                                tickFormatter={(value) => value}
                                angle={-90}
                                height={150}
                                width={20}
                                minTickGap={4}
                            />

                            <YAxis yAxisId="left" domain={leftDomain} />

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                            />
                            <Tooltip content={<CustomTooltipAnalysis />} />

                            <Legend />

                            {/* BAR */}
                            <Bar
                                maxBarSize={18}
                                radius={4}
                                yAxisId="right"
                                name={"Draw Size"}
                                dataKey="drawSize"
                                fill="#d1d1d1"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={barColors[entry.year]}
                                    />
                                ))}
                            </Bar>

                            {/* LINES BY YEAR */}
                            {years.map((year) => (
                                <Line
                                    key={year}
                                    yAxisId="left"
                                    type="linear"
                                    dataKey={`year_${year}`}
                                    name={`${year}`}
                                    stroke={lineColors[year]}
                                    strokeWidth={3}
                                    connectNulls={true}
                                >
                                    {!isNarrow && (
                                        <LabelList
                                            dataKey={`year_${year}`}
                                            position="top"
                                            offset={10}
                                            fill="#000"
                                            fontSize={12}
                                        />
                                    )}
                                </Line>
                            ))}

                            {/* VIEWER'S CRS ONE YEAR AHEAD */}
                            {userScores.length > 0 && (
                                <Line
                                    yAxisId="left"
                                    type="stepAfter"
                                    dataKey="userCRSNext"
                                    name={`Your CRS (${latestYear + 1}, projected)`}
                                    legendType="plainline"
                                    stroke={USER_CRS_COLOR}
                                    strokeWidth={2.5}
                                    strokeDasharray="6 4"
                                    dot={false}
                                    activeDot={{ r: 4, fill: "#ffffff", stroke: USER_CRS_COLOR, strokeWidth: 2 }}
                                >
                                    <LabelList dataKey="userCRSNext" content={userCrsLabel("userCRSNext", false)} />
                                </Line>
                            )}

                            {/* VIEWER'S CRS, stepping on birthdays / work anniversaries — drawn last so its tags stay on top */}
                            {userScores.length > 0 && (
                                <Line
                                    yAxisId="left"
                                    type="stepAfter"
                                    dataKey="userCRS"
                                    name={`Your CRS (${latestYear})`}
                                    legendType="plainline"
                                    stroke={USER_CRS_COLOR}
                                    strokeWidth={2.5}
                                    dot={false}
                                    activeDot={{ r: 4, fill: USER_CRS_COLOR }}
                                >
                                    <LabelList dataKey="userCRS" content={userCrsLabel("userCRS", true)} />
                                </Line>
                            )}
                        </ComposedChart>
                    </ChartContainer>
                </div>
            ) : (
                <div>
                    {years.length === 0
                        ? "Select at least one year to compare."
                        : "No draws are currently available for this category. Please select another category to view the analysis."}
                </div>
            )}
        </div>
    );
}
