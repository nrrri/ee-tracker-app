import { InvitationData } from "@/app/type/Type";
import DrawTable from "./DrawTable";
import { HeaderToggle } from "@/components/HeaderToggle";
import { useState } from "react";
import DrawChart from "./DrawChart";

type DrawDataType = {
    drawData: InvitationData[];
}
export default function DrawData({ drawData }: DrawDataType) {
    const [openTable, setOpenTable] = useState<boolean>(true)

    return (
        <div>
            {/* Header */}
            <HeaderToggle title={'Round of Invitations'} openTable={openTable} onToggle={() => setOpenTable(!openTable)} />
            {/* Details */}
            <div>
                {openTable ?
                <DrawTable drawData={drawData} /> :
                    <DrawChart drawData={drawData} />
            }
            </div>
        </div>
    )
}