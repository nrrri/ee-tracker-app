"use client";
import CandidateTable from "./CandidateTable"
import CandidateChart from "./CandidateChart"
import { useState } from "react"
import { PoolData } from "@/app/type/Type"
import { HeaderToggle } from "@/components/HeaderToggle"

type CandidateDataType = {
    poolData: PoolData[];
}
export default function CandidateData({ poolData }: CandidateDataType) {
    const [openTable, setOpenTable] = useState<boolean>(true)
    return (
        <div>
            {/* Toggle menu */}
            <HeaderToggle title={'CRS score distribution of candidates in the pool'} openTable={openTable} onToggle={() => setOpenTable(!openTable)} />
            <div>
                {openTable ? <CandidateTable poolData={poolData} /> : <CandidateChart poolData={poolData} />}
            </div>
        </div>
    )
}