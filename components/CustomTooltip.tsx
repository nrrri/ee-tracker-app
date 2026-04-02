import { keywordPoolType } from "@/app/constant";
import { TooltipProps } from "@/app/type/Type"

export function CustomTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null
    const data = payload[0].payload
    const isDrawData = "drawNumber" in data;
    return (
        isDrawData ? <div className="rounded-lg border bg-background p-3 shadow">
            <div className="font-medium flex justify-between "><span>Draw Number: </span>{data.drawNumber}</div>
            <div className="font-medium flex justify-between"><span>CRS score: </span>{data.drawCRS}</div>
            <div className="font-medium flex justify-between"><span>Draw Date: </span>{data.drawDateFull}</div>
            <div className="font-medium flex justify-between"><span>Draw Name: </span>{data.drawName}</div>
            <div className="font-medium flex justify-between"><span>Draw Size: </span>{data.drawSize}</div>
            <div className="font-medium flex justify-between"><span>Draw Cut-Off: </span>{data.drawCutOff}</div>
        </div> :
            <div className="rounded-lg border bg-background p-3 shadow">
                {keywordPoolType.map((col) => {
                    return <div className="font-medium flex justify-between" key={col.key}><span>{`${col.label}: `}</span><span>{data[col.key].toLocaleString()}</span></div>
                })}
            </div>

    )
}