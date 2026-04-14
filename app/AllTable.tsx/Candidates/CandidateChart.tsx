"use client"

import { PoolData } from "../../type/Type"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { chartConfig, getColorFromName, keywordPoolType } from "@/app/constant"
import { CustomTooltip } from "@/components/CustomTooltip"
import FilterDropdown from "@/components/FilterDropdown"
import FilterBox from "@/components/FilterBox"
import { Option } from "@/app/type/Type" // ← fixed import path

type CandidateChartType = {
    poolData: PoolData[]
}

export default function CandidateChart({ poolData }: CandidateChartType) {
    const [addFilterType, setAddFilterType] = useState<string[]>(["totalCandidates"]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<string>("totalCandidates")

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

    // filter by selected years first, then slice for pagination
    const filteredByYear = selectedYears.length === 0
        ? poolData
        : poolData.filter(d =>
            selectedYears.includes(String(new Date(d.drawDistributionAsOn).getFullYear()))
        );

    const mockData = filteredByYear.slice(0, 40); // todo: add pagination

    const minBalance = Math.min(...mockData.map(item => item.totalCandidates));

    const formattedDate = mockData.map(d => ({
        ...d,
        drawDistributionAsOn: new Date(d.drawDistributionAsOn).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    }));

    useEffect(() => {
        if (addFilterType.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilterData(addFilterType.toLocaleString())
        }
    }, [addFilterType])

    return (
        <div className="">
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
                        label="Filter by year"
                    />
                </div>
            </div>

            {/* Chart */}
            <div>
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
                        <Bar barSize={20} dataKey={filterData} fill={getColorFromName(filterData, true)} radius={4}>
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
    )
}