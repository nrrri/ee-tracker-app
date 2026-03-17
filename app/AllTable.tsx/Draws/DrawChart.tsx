/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { CustomTooltip } from "@/components/CustomTooltip"
import { InvitationData } from "../../type/Type"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import { keywordColors, keywordDrawType } from "@/app/constant"
import { useEffect, useState } from "react"
import { CheckboxBasic } from "@/components/CheckboxBasic"

type DrawChartType = {
    drawData: InvitationData[]
}
export default function DrawChart({ drawData }: DrawChartType) {
    const [addFilterType, setAddFilterType] = useState<string[]>([]);
    const [checked, setChecked] = useState(false)
    const [filterData, setFilterData] = useState<InvitationData[]>(drawData)
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

    const filterByCategory = (data: InvitationData[]) => {
        const filteredDraw = data.filter((item) => addFilterType.some(k => item.drawName.includes(k)))
        console.log('check filteredDraw', filteredDraw)
        return filteredDraw
    }

    const mockData = filterData.slice(0, 30) // todo: add pagination

    const minBalance = (data: InvitationData[]) => {
        const findMinScore =
            Math.min(
                ...data.map(item => Number(item.drawCRS))) - 100
            ;
        return findMinScore > 0 ? findMinScore : 0
    }
    const maxBalance = (data: InvitationData[]) => {
        let addCeil = 50;
        if (addFilterType.length > 0) addCeil = 10
        const findMax = Math.ceil((Math.max(
            ...data.map(item => Number(item.drawCRS))) + addCeil) / addCeil) * addCeil
        return findMax
    };

    function getColorFromName(name: string) {
        const keyword = Object.keys(keywordColors).find(k =>
            name.includes(k)
        )
        return keyword ? keywordColors[keyword] : "#FC4024"
    }

    // add draw type to filter
    const toggleFilter = (value: string) => {
        setAddFilterType(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        )
    }

    useEffect(() => {
        if (addFilterType.length > 0) {
            setFilterData(filterByCategory(drawData))
        } else {
            setFilterData(drawData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addFilterType])

    return (
        <div className="">
            {/* todo: add filter feature */}
            <div className="grid grid-cols-3">
                {/* todo: refactor */}
                <CheckboxBasic title={keywordDrawType.cec} checked={addFilterType.includes(keywordDrawType.cec)} onCheckedChange={() => toggleFilter(keywordDrawType.cec)} />
                <CheckboxBasic title={keywordDrawType.provincial} checked={addFilterType.includes(keywordDrawType.provincial)} onCheckedChange={() => toggleFilter(keywordDrawType.provincial)} />
                <CheckboxBasic title={keywordDrawType.french} checked={addFilterType.includes(keywordDrawType.french)} onCheckedChange={() => toggleFilter(keywordDrawType.french)} />
                <CheckboxBasic title={keywordDrawType.healthcare} checked={addFilterType.includes(keywordDrawType.healthcare)} onCheckedChange={() => toggleFilter(keywordDrawType.healthcare)} />
                <CheckboxBasic title={keywordDrawType.stem} checked={addFilterType.includes(keywordDrawType.stem)} onCheckedChange={() => toggleFilter(keywordDrawType.stem)} />
                <CheckboxBasic title={keywordDrawType.trade} checked={addFilterType.includes(keywordDrawType.trade)} onCheckedChange={() => toggleFilter(keywordDrawType.trade)} />
                <CheckboxBasic title={keywordDrawType.education} checked={addFilterType.includes(keywordDrawType.education)} onCheckedChange={() => toggleFilter(keywordDrawType.education)} />
                <CheckboxBasic title={keywordDrawType.transport} checked={addFilterType.includes(keywordDrawType.transport)} onCheckedChange={() => toggleFilter(keywordDrawType.transport)} />
                <CheckboxBasic title={keywordDrawType.physicians} checked={addFilterType.includes(keywordDrawType.physicians)} onCheckedChange={() => toggleFilter(keywordDrawType.physicians)} />
                <CheckboxBasic title={keywordDrawType.senior} checked={addFilterType.includes(keywordDrawType.senior)} onCheckedChange={() => toggleFilter(keywordDrawType.senior)} />
                <CheckboxBasic title={keywordDrawType.researchers} checked={addFilterType.includes(keywordDrawType.researchers)} onCheckedChange={() => toggleFilter(keywordDrawType.researchers)} />
                <CheckboxBasic title={keywordDrawType.military} checked={addFilterType.includes(keywordDrawType.military)} onCheckedChange={() => toggleFilter(keywordDrawType.military)} />
            </div>
            {/* Chart */}
            <div>
                <ChartContainer config={chartConfig} className="min-h-50 w-full">
                    <BarChart accessibilityLayer data={mockData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="drawDateFull"
                            tickLine={false}
                            tickMargin={60}
                            axisLine={false}
                            tickFormatter={(value) => value}
                            angle={-90}
                            height={150}
                        />
                        <ChartTooltip content={<CustomTooltip />} />
                        <YAxis domain={[minBalance(mockData), maxBalance(mockData)]} tickMargin={5} tickCount={5} />
                        <Bar barSize={20} dataKey="drawCRS" radius={4} >
                            {mockData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={getColorFromName(entry.drawName)}
                                />
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
            </div >
        </div >
    )
}
