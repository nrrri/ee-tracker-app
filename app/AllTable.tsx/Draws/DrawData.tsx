"use client";
import { InvitationData } from "@/app/type/Type";
import DrawTable from "./DrawTable";
import { HeaderToggle } from "@/components/HeaderToggle";
import { useState } from "react";
import DrawChart from "./DrawChart";

type DrawDataType = {
    drawData: InvitationData[];
    // isChart: boolean;
    // setIsChart: React.Dispatch<React.SetStateAction<boolean>>;

}
export default function DrawData({ drawData }: DrawDataType) {
    const [isChart, setIsChart] = useState<boolean>(true)

    return (
        <div>
            {/* Header */}
            <HeaderToggle title={'Round of Invitations'} openTable={isChart} onToggle={() => setIsChart(!isChart)} />
            {/* Details */}
            <div>
                {!isChart ?
                    <DrawTable drawData={drawData} /> : <DrawChart drawData={drawData} />
                }
            </div>
        </div>
    )
}