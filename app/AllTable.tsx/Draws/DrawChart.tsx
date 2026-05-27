"use client"

import { InvitationData, PoolData } from "../../type/Type"
import { keywordDrawType } from "@/app/constant"
import { useState } from "react"
import { DataOption } from "@/app/type/Type"
import { FilterDropdownTimeline } from "@/components/FilterDropdown"
import DrawChartByYearTracing from "./DataOrder/DrawChartByYearTracing"
import DrawChartByTimeline from "./DataOrder/DrawChartByTimeLine"

type DrawChartType = {
    drawData: InvitationData[]
    poolData: PoolData[]
}

export default function DrawChart({ drawData, poolData }: DrawChartType) {
    const [selectedTimeline, setSelectedTimeline] = useState<string>('Timeline');

    const drawOptions: DataOption[] = Object.values(keywordDrawType);

    const checkDataByTimeline = selectedTimeline === 'Timeline';
    return (
        <div className="flex items-center flex-col">
            <div className="mb-4">
                <FilterDropdownTimeline
                    addFilterType={selectedTimeline}
                    setAddFilterType={setSelectedTimeline}
                />
            </div>

            {
                checkDataByTimeline ?
                    <DrawChartByTimeline drawData={drawData} /> : <DrawChartByYearTracing drawData={drawData} poolData={poolData} drawOptions={drawOptions} />
            }
        </div>
    );
}