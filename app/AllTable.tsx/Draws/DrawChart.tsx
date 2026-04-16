"use client"

import { CustomTooltip } from "@/components/CustomTooltip"
import { InvitationData } from "../../type/Type"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { chartConfig, getColorFromName, keywordDrawType, PAGE_SIZE } from "@/app/constant"
import { useEffect, useState } from "react"
import FilterBox from "../../../components/FilterBox"
import { Option } from "@/app/type/Type"
import { PaginationControl } from "@/components/PaginationControl"

type DrawChartType = {
    drawData: InvitationData[]
}

export default function DrawChart({ drawData }: DrawChartType) {
    const [addFilterType, setAddFilterType] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);
    const [filterData, setFilterData] = useState<InvitationData[]>(drawData)
    const [page, setPage] = useState(1);

    const drawOptions = Object.values(keywordDrawType);

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

    const minBalance = (data: InvitationData[]) => {
        // ! disable min
        // const findMinScore = Math.min(...data.map(item => Number(item.drawCRS))) - 100;
        return 0;
        // return findMinScore > 0 ? findMinScore : 0;
    };

    const maxBalance = (data: InvitationData[]) => {
        let addCeil = 50;
        if (addFilterType.length > 0) addCeil = 10;
        const findMax = Math.ceil(
            (Math.max(...data.map(item => Number(item.drawCRS))) + addCeil) / addCeil
        ) * addCeil;
        return findMax;
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

    const totalPages = Math.ceil(filterData.length / PAGE_SIZE)
    const mockData = filterData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE); // todo: add pagination

    return (
        <div className="flex items-center flex-col">
            <div className="w-280 pl-16 p-4 pb-8 bg-gray-50 rounded-xl shadow-lg mx-24 mb-12">
                <FilterBox
                    options={drawOptions}
                    addFilterType={addFilterType}
                    setAddFilterType={setAddFilterType}
                    label="Filter by range"
                />
                <FilterBox
                    options={yearOptions}
                    addFilterType={selectedYears}
                    setAddFilterType={setSelectedYears}
                    label="Filter by year"
                />
            </div>

            {mockData.length > 0 ? (
                <>
                    {/* pagination control */}
                    <PaginationControl page={page} setPage={setPage} data={filterData} totalPages={totalPages} />
                    <div className="overflow-x-auto w-full h-300">
                        <div style={{
                            width: mockData.length > 30 ? mockData.length * 40 : "100%",
                            minHeight: "400px",
                        }}>
                            <ChartContainer config={chartConfig} className="min-h-50 w-full">
                                <BarChart
                                    accessibilityLayer
                                    data={mockData}
                                    width={mockData.length > 30 ? mockData.length * 40 : 800}
                                    height={200}
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
                                        domain={[minBalance(mockData), maxBalance(mockData)]}
                                        tickMargin={5}
                                        tickCount={5}
                                    />
                                    <Bar barSize={20} dataKey="drawCRS" radius={4}>
                                        {mockData.map((entry, index) => (
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