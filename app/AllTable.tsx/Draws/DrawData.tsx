"use client";
import { InvitationData, PoolData } from "@/app/type/Type";
import DrawTable from "./DrawTable";
import { HeaderToggle } from "@/components/HeaderToggle";
import { useState } from "react";
import DrawChart from "./DrawChart";

type DrawDataType = {
    drawData: InvitationData[];
    poolData: PoolData[]
}
export default function DrawData({ drawData, poolData }: DrawDataType) {
    const [openTable, setOpenTable] = useState<boolean>(true)

    return (
        <div>
            {/* Header */}
            <HeaderToggle title={'Round of Invitations'} openTable={openTable} onToggle={() => setOpenTable(!openTable)} />
            {/* Details */}
            <div>
                {openTable ?
                    <DrawTable drawData={drawData} /> : <DrawChart drawData={drawData} poolData={poolData} />
                }
            </div>
        </div>
    )
}