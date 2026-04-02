"use client"

import { PoolData } from "../../type/Type"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import FilterBox from "../Draws/FilterBox"
import { chartConfig, getColorFromName, keywordPoolType } from "@/app/constant"
import { CustomTooltip } from "@/components/CustomTooltip"

type CandidateChartType = {
    poolData: PoolData[]
}
export default function CandidateChart({ poolData }: CandidateChartType) {
    const [addFilterType, setAddFilterType] = useState<string[]>(["totalCandidates"]);
    const [filterData, setFilterData] = useState<string>("")
    const poolOptions = Object.values(keywordPoolType);

    const mockData = poolData.slice(0, 40) // todo: add pagination

    const minBalance = Math.min(
        ...mockData.map(item => item.totalCandidates))
        ;

    const formattedDate = mockData.map(d => ({
        ...d,
        drawDistributionAsOn: new Date(d.drawDistributionAsOn).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
    }));
    // to set filter data
    useEffect(() => {
        if (addFilterType.length > 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilterData(addFilterType.toLocaleString())
        }
    }, [addFilterType])

    return (
        <div className="">
            <FilterBox
                options={poolOptions}
                addFilterType={addFilterType}
                setAddFilterType={setAddFilterType}
                singleSelect // only one range at a time
            />
            <div>
                Total Candidate Chart
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
                        <Bar barSize={20} dataKey={filterData} fill={getColorFromName(filterData, true)} radius={4} >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                                formatter={(value: number) => value.toLocaleString()}
                            /></Bar >

                    </BarChart>
                </ChartContainer>
            </div >
        </div>
    )
}