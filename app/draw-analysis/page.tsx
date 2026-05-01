"use client";

import { PaginationControl } from "@/components/PaginationControl";
import { InvitationData } from "../type/Type";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";
import { chartConfig, getColorFromName, keywordDrawType, PAGE_SIZE } from "../constant";
import { useEffect, useState } from "react";
import { Option } from "@/app/type/Type"
import FilterBox from "@/components/FilterBox";
import { CustomTooltip } from "@/components/CustomTooltip";



type AnalysisDrawProps = {
    drawData: InvitationData[]
}

export default function AnalysisDraw({ drawData }: AnalysisDrawProps) {
    const [addFilterType, setAddFilterType] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<InvitationData[]>(drawData)
    const [page, setPage] = useState(1);
    const drawOptions = Object.values(keywordDrawType);

    const totalPages = filterData.length > 0 ? Math.ceil(filterData.length / PAGE_SIZE) : Math.ceil(drawData.length / PAGE_SIZE)
    // derive year options from drawDate (not drawDistributionAsOn)
    const yearOptions: Option[] = Array.from(
        new Set(drawData.map(d => new Date(d.drawDate).getFullYear()))
    )
        .sort((a, b) => b - a)
        .map(year => ({
            key: String(year),
            label: String(year),
        }));

    const filterByCategory = (data: InvitationData[]) => {
        return data.filter(item =>
            addFilterType.some(k => item.drawName.toLocaleLowerCase().includes(k.toLocaleLowerCase()))
        );
    };

    const filterByYear = (data: InvitationData[]) => {
        return selectedYears.length === 0
            ? data
            : data.filter(d =>
                selectedYears.includes(String(new Date(d.drawDate).getFullYear()))
            );
    };

    // re-run whenever category or year filter changes
    useEffect(() => {
        let result = drawData;

        if (selectedYears.length > 0) result = filterByYear(result);
        if (addFilterType.length > 0) result = filterByCategory(result);

        setFilterData(result);
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addFilterType, selectedYears]);

    const formattedData = drawData
    return (
        <div className="px-6 py-6">
            <h1 className="text-2xl font-semibold mb-4">
                Analysis Canadian Experience Class
            </h1>
            <div className="w-280 pl-16 p-4 pb-8 bg-gray-50 rounded-xl shadow-lg mx-24 mb-12">
                <FilterBox
                    options={drawOptions}
                    addFilterType={addFilterType}
                    setAddFilterType={setAddFilterType}
                    setPage={setPage}
                    label="Filter by Categories"
                />
                <FilterBox
                    options={yearOptions}
                    addFilterType={selectedYears}
                    setAddFilterType={setSelectedYears}
                    setPage={setPage}
                    label="Filter by year"
                />
            </div>
            {/* your chart component */}
            {formattedData.length > 0 ? (
                <>
                    {/* pagination control */}
                    <PaginationControl page={page} setPage={setPage} data={filterData} totalPages={totalPages} />
                    <div className="overflow-x-auto w-full h-300">
                        <div style={{
                            width: formattedData.length > 30 ? formattedData.length * 40 : "100%",
                            minHeight: "400px",
                        }}>
                            <ChartContainer config={chartConfig}>
                                <BarChart
                                    accessibilityLayer
                                    data={formattedData}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="drawDateFull"
                                        tickLine={false}
                                        tickMargin={60}
                                        axisLine={false}
                                        tickFormatter={(value) => value}
                                        angle={-90}
                                        height={150}
                                        width={20}
                                    />
                                    <ChartTooltip content={<CustomTooltip />} />
                                    <YAxis
                                        // domain={[minBalance(formattedData), maxBalance(formattedData)]}
                                        tickMargin={5}
                                        tickCount={5}
                                    />
                                    <Bar barSize={18} dataKey="drawCRS" radius={4}>
                                        {formattedData.map((entry, index) => (
                                            <Cell key={index} fill={getColorFromName(entry.drawName)} />
                                        ))}
                                        <LabelList
                                            position="top"
                                            offset={12}
                                            className="fill-foreground"
                                            fontSize={12}
                                            formatter={(value: number) => value.toLocaleString()}
                                        />
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div>No draw in this category yet</div>
            )}
        </div>
    );
}