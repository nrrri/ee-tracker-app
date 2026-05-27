"use client";

import { PaginationControl } from "@/components/PaginationControl";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { CustomTooltipAnalysis } from "@/components/CustomTooltip";
import FilterDropdown from "@/components/FilterDropdown";
import { DataOption, InvitationData, PoolData } from "@/app/type/Type";
import { chartConfig, fadeHex, getColorFromName, maxBalance, minBalance, PAGE_SIZE } from "@/app/constant";

type DrawChartByYearTracingProp = {
    drawData: InvitationData[]
    poolData: PoolData[]
    drawOptions: DataOption[]
}

export default function DrawChartByYearTracing({ drawData, poolData, drawOptions }: DrawChartByYearTracingProp) {
    const [addFilterType, setAddFilterType] = useState<string[]>(['Canadian Experience Class']);
    // const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<InvitationData[]>([])
    const [page, setPage] = useState(1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredDraws: InvitationData[] = Object(drawData).filter((item: any) => new Date(item.drawDateFull).getFullYear() > 2023)

    const totalPages = filterData.length > 0 ? Math.ceil(filterData.length / PAGE_SIZE) : Math.ceil(filteredDraws.length / PAGE_SIZE)

    // derive year options from drawDate (not drawDistributionAsOn)
    // const yearOptions: DataOption[] = Array.from(
    //     new Set(drawData.map(d => new Date(d.drawDate).getFullYear()))
    // )
    //     .sort((a, b) => b - a)
    //     .map(year => ({
    //         key: String(year),
    //         label: String(year),
    //     }));

    const filterByCategory = (data: InvitationData[]) => {
        return data.filter(item =>
            addFilterType.some(k => item.drawName.toLocaleLowerCase().includes(k.toLocaleLowerCase()))
        );
    };

    // const filterByYear = (data: InvitationData[]) => {
    //     return selectedYears.length === 0
    //         ? data
    //         : data.filter(d =>
    //             selectedYears.includes(String(new Date(d.drawDate).getFullYear()))
    //         );
    // };

    useEffect(() => {
        setFilterData(filteredDraws.filter((d) => d.drawName === 'Canadian Experience Class'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // re-run whenever category or year filter changes
    useEffect(() => {
        let result = filteredDraws;

        // if (selectedYears.length > 0) result = filterByYear(result);
        result = filterByCategory(result)
        setFilterData(result);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addFilterType]);

    // transform data
    const chartData = filterData.map((item) => {
        const d = new Date(item.drawDateFull);

        const year = d.getFullYear();
        const filterCandidates = poolData.find((pool) =>
        (pool.drawDistributionAsOn === item.drawDistributionAsOn && item.drawName === 'Canadian Experience Class'
        ))

        return {
            label: item.drawDateFull,
            drawSize: item.drawSize,
            [`year_${year}`]: item.drawCRS,
            drawCRS: item.drawCRS,
            candidatesIn500: filterCandidates?.range501_600,
            dateInPool: item.drawDistributionAsOn,
            dateCutOff: item.drawCutOff,
        };
    });

    filteredDraws.sort((a, b) => {
        const da = new Date(a.drawDateFull);
        const db = new Date(b.drawDateFull);

        const aMonthDay =
            da.getMonth() * 100 + da.getDate();

        const bMonthDay =
            db.getMonth() * 100 + db.getDate();

        return aMonthDay - bMonthDay;
    });

    // unique years
    const years = [
        ...new Set(
            filteredDraws.map((item) =>
                new Date(item.drawDateFull).getFullYear()
            )
        ),
    ];

    const lineColors: Record<number, string> = {
        2024: fadeHex("#004242", 0.6),
        2025: fadeHex("#004242", 0.4),
        2026: getColorFromName(addFilterType[0]),
    };

    const getYearColor = (date: string) => {
        const year = new Date(date).getFullYear();

        switch (year) {
            case 2024:
                return fadeHex("#004242", 0.9);

            case 2025:
                return fadeHex("#004242", 0.8);

            case 2026:
                return fadeHex(getColorFromName(addFilterType[0]), 0.8);
        }
    };

    const formattedData = chartData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return (
        <div className="overflow-x-auto w-full h-300">
            <div className="flex justify-center">
                <div className="w-180 pl-16 p-4 bg-gray-50 rounded-xl shadow-lg mx-24 mb-12">
                    {/* <div className="border-b pb-4"> */}
                    <FilterDropdown
                        options={drawOptions}
                        addFilterType={addFilterType}
                        setAddFilterType={setAddFilterType}
                        pool={false}
                    />
                    {/* </div> */}
                    {/* <FilterBox
                    options={yearOptions}
                    addFilterType={selectedYears}
                    setAddFilterType={setSelectedYears}
                    setPage={setPage}
                    label="Filter by year"
                /> */}
                </div>
            </div>
            {/* your chart component */}
            {formattedData.length > 0 ? (
                <>
                    {/* pagination control */}
                    <div className="flex justify-center">
                        <PaginationControl page={page} setPage={setPage} data={filterData} totalPages={totalPages} />
                    </div>
                    <div className="overflow-x-auto w-full">
                        <div style={{
                            width: "100%",
                            minHeight: "400px",
                        }}>
                            <ChartContainer config={chartConfig}>
                                <ComposedChart data={formattedData}>
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
                                    />

                                    <YAxis yAxisId="left" domain={[minBalance(formattedData), maxBalance(formattedData, addFilterType)]} />

                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                    />
                                    <Tooltip content={<CustomTooltipAnalysis />} />

                                    <Legend />

                                    {/* BAR */}
                                    <Bar
                                        barSize={18}
                                        radius={4}
                                        yAxisId="right"
                                        dataKey="drawSize"
                                        fill="#d1d1d1"
                                    >
                                        {formattedData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getYearColor(entry.label)}
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
                                            <LabelList
                                                dataKey={`year_${year}`}
                                                position="top"
                                                offset={10}
                                                fill="#000"
                                                fontSize={12}
                                            />
                                        </Line>
                                    ))}
                                </ComposedChart>
                            </ChartContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    No draws are currently available for this category. Please select another category to view the analysis.
                </div>
            )}
        </div>
    );
}