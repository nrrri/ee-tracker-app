"use client";

import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo, useState } from "react";
import { CustomTooltipAnalysis } from "@/components/CustomTooltip";
import FilterDropdown from "@/components/FilterDropdown";
import { DataOption, InvitationData, PoolData } from "@/app/type/Type";
import { chartConfig, fadeHex, getColorFromName, matchesCategory, maxBalance, minBalance } from "@/app/constant";
import { useIsMobile } from "@/components/hooks/useIsMobile";

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
            };
        });

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
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {yearOptions.map((year) => {
                                const id = `compare-year-${year}`;
                                return (
                                    <label key={year} htmlFor={id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                        <Checkbox
                                            id={id}
                                            checked={selectedYears.includes(year)}
                                            onCheckedChange={() => toggleYear(year)}
                                        />
                                        {year}
                                    </label>
                                );
                            })}
                        </div>
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

                            <YAxis yAxisId="left" domain={[minBalance(chartData), maxBalance(chartData, addFilterType)]} />

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
