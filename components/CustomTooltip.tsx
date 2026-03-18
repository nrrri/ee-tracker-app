import { TooltipProps } from "@/app/type/Type"

export function CustomTooltip({ active, payload }: TooltipProps) {
    if (!active || !payload?.length) return null

    const data = payload[0].payload
    return (
        <div className="rounded-lg border bg-background p-3 shadow">
            <div className="font-medium">Draw Number: {data.drawNumber}</div>
            <div className="font-medium">CRS score: {data.drawCRS}</div>
            <div className="font-medium">Draw Date: {data.drawDateFull}</div>
            <div className="font-medium">Draw Name: {data.drawName}</div>
            <div className="font-medium">Draw Size: {data.drawSize}</div>
            <div className="font-medium">Draw Cut-Off: {data.drawCutOff}</div>
        </div>
    )
}