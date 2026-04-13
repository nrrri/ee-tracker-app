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

export const CustomTooltipSummary = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 text-sm">
                <p className="font-semibold text-gray-800 mb-1">{d.fullName}</p>
                <p className="text-gray-600">Invitations: <span className="font-medium text-gray-800">{d.value.toLocaleString()}</span></p>
                <p className="text-gray-600">Draws: <span className="font-medium text-gray-800">{d.invitation}</span></p>
            </div>
        );
    }
    return null;
};