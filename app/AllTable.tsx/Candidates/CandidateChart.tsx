"use client"

import { PoolData } from "../../type/Type"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

type CandidateChartType = {
    poolData: PoolData[]
}
export default function CandidateChart({ poolData }: CandidateChartType) {

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    } satisfies ChartConfig

    const mockData = poolData.slice(0, 20)
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
    return (
        <div className="">
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
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <YAxis domain={[minBalance, "auto"]} tickMargin={5} tickCount={5} />
                        <Bar barSize={20} dataKey="totalCandidates" fill="var(--color-desktop)" radius={4} >
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