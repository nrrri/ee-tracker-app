"use client";
import CandidateTable from "./CandidateTable"
import CandidateChart from "./CandidateChart"
import { useState } from "react"
import { PoolData, NewCandidateSummary } from "@/app/type/Type"
import { HeaderToggle } from "@/components/HeaderToggle"

type CandidateDataType = {
    poolData: PoolData[];
    newCandidateSummary: NewCandidateSummary[];
}
export default function CandidateData({ poolData, newCandidateSummary }: CandidateDataType) {
    const [openTable, setOpenTable] = useState<boolean>(true)

    return (
        <div>
            {/* Toggle menu */}
            <HeaderToggle title={'CRS score distribution of candidates in the pool'} openTable={openTable} onToggle={() => setOpenTable(!openTable)} />
            <div>
                {openTable ? <CandidateTable poolData={poolData} newCandidateSummary={newCandidateSummary} /> : <CandidateChart poolData={poolData} newCandidateSummary={newCandidateSummary} />}
            </div>
        </div>
    )
}