"use client"

import { PoolData } from "../../type/Type"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { chartConfig, darkenHex, getColorFromName, keywordPoolType, PAGE_SIZE } from "@/app/constant"
import { CustomTooltip } from "@/components/CustomTooltip"
import FilterDropdown from "@/components/FilterDropdown"
import FilterBox from "@/components/FilterBox"
import { Option } from "@/app/type/Type" // ← fixed import path
import { PaginationControl } from "@/components/PaginationControl"

type CandidateChartType = {
    poolData: PoolData[]
}

export default function CandidateChart({ poolData }: CandidateChartType) {
    const [addFilterType, setAddFilterType] = useState<string[]>(["totalCandidates"]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [formattedAddFilterType, setFormattedFilterData] = useState<string>("totalCandidates")
    const [page, setPage] = useState(1);

    const poolOptions = Object.values(keywordPoolType);

    // derive year options dynamically from poolData
    const yearOptions: Option[] = Array.from(
        new Set(poolData.map(d => new Date(d.drawDistributionAsOn).getFullYear()))
    )
        .sort((a, b) => b - a)
        .map(year => ({
            key: String(year),
            label: String(year),
        }));

    const normalizedData = poolData.map(d => ({
        ...d,
        year: new Date(d.drawDistributionAsOn).getFullYear(),
    }));

    // filter by selected years first, then slice for pagination
    const filteredByYear =
        selectedYears.length === 0
            ? normalizedData
            : normalizedData.filter(d =>
                selectedYears.includes(String(d.year))
            );

    const totalPages = Math.ceil(filteredByYear.length / PAGE_SIZE)
    const mockData = filteredByYear.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);


    const minBalance = Math.min(...mockData.map(item => item.totalCandidates));

    const formattedDate = mockData.map(d => ({
        ...d,
        drawDistributionAsOn: new Date(d.drawDistributionAsOn).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    }));

    const getYearColor = (dateStr: string) => {
        const year = new Date(dateStr).getFullYear();
        return darkenHex(getColorFromName(formattedAddFilterType, true), year % 2 === 0 ? 1 : 0.6) ?? "#dfdfdf"; // fallback gray
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1)
        if (addFilterType.length > 0) {
            setFormattedFilterData(addFilterType.toLocaleString())
        }
    }, [addFilterType])

    return (
        <div className="flex items-center flex-col">
            <div className="flex justify-center">
                <div className="p-8 py-8 bg-gray-50 rounded-xl shadow-lg mx-24 mb-12">
                    <div className="border-b pb-4">
                        <FilterDropdown
                            options={poolOptions}
                            addFilterType={addFilterType}
                            setAddFilterType={setAddFilterType}
                        />
                    </div>
                    <FilterBox
                        options={yearOptions}
                        addFilterType={selectedYears}
                        setAddFilterType={setSelectedYears}
                        setPage={setPage}
                        label="Filter by year"
                    />
                </div>
            </div>

            {/* Chart */}
            <>
                <PaginationControl page={page} setPage={setPage} data={filteredByYear} totalPages={totalPages} />
                <ChartContainer config={chartConfig} className="min-h-50 w-full">
                    <BarChart accessibilityLayer data={formattedDate}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="drawDistributionAsOn"
                            tickLine={false}
                            tickMargin={50}
                            axisLine={false}
                            tickFormatter={(value) => value}
                            angle={-90}
                            height={150}
                        />
                        <ChartTooltip content={<CustomTooltip />} />
                        <YAxis domain={[minBalance, "auto"]} tickMargin={5} tickCount={5} />
                        {/* todo: add dif color for dif year */}
                        <Bar barSize={18} dataKey={formattedAddFilterType} radius={4}>
                            {
                                formattedDate.map((entry, index) => {
                                    return (
                                        <Cell key={index} fill={getYearColor(mockData[index].drawDistributionAsOn)} />
                                    )
                                })
                            }
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
            </>
        </div>
    )
}