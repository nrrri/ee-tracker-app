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

export const CustomTooltipSummary = ({ active, payload, currYear }: TooltipProps & { currYear: number }) => {
    if (!active || !payload?.length) return null;

    // Recharts gives one entry per bar (so we extract both safely)
    const current = payload.find(p => p.dataKey === "currentYear")?.payload;
    const prev = payload.find(p => p.dataKey === "prevYear")?.payload;

    const name = current?.name ?? prev?.name ?? "Unknown";

    const currentValue = Number(current?.currentYear ?? 0);
    const prevValue = Number(prev?.prevYear ?? 0);

    const currentInv = current?.currentInvitations ?? 0;
    const prevInv = prev?.prevInvitations ?? 0;

    // compact so it fits inside the narrow Draw Summary card
    return (
        <div className="w-44 bg-white/95 border border-gray-200 rounded-lg shadow-sm p-2.5 text-xs text-left">
            <p className="font-semibold text-gray-800 mb-1.5 leading-snug">{name}</p>

            <p className="flex justify-between gap-2 text-gray-500">
                {currYear}
                <span className="font-medium text-gray-800 tabular-nums">
                    {currentValue.toLocaleString()} [{currentInv}]
                </span>
            </p>

            <p className="flex justify-between gap-2 text-gray-500">
                {currYear - 1}
                <span className="font-medium text-gray-800 tabular-nums">
                    {prevValue.toLocaleString()} [{prevInv}]
                </span>
            </p>
        </div>
    );
};

export const CustomTooltipAnalysis = ({
    active,
    payload,
    coordinate
}: TooltipProps & {
    coordinate?: { x: number; y: number };
}) => {
    if (!active || !payload?.length || !coordinate) return null;

    const data = payload[0].payload;
    return (
        <div
            style={{
                position: "absolute",
                left: coordinate.x + 8,
                top: coordinate.y - 180,
                pointerEvents: "none",
            }}
            className="w-100 rounded-xl border border-gray-200 bg-white/80 p-3 text-sm shadow-sm"
        >
            <p className="mb-2 font-semibold text-gray-800">
                {data.label}
            </p>

            <p className="text-gray-600">
                CRS Score:{" "}
                <span className="font-medium text-gray-800">
                    {data.drawCRS}
                </span>
            </p>

            {data.userCRS !== undefined && (
                <p className="text-gray-600">
                    Your CRS on {data.userCRSDate}:{" "}
                    <span className="font-medium text-gray-800">{data.userCRS}</span>{" "}
                    <span className={data.userCRS >= Number(data.drawCRS) ? "text-emerald-600" : "text-rose-600"}>
                        ({data.userCRS >= Number(data.drawCRS) ? "+" : ""}{data.userCRS - Number(data.drawCRS)} vs cut-off)
                    </span>
                </p>
            )}

            {data.userCRSNext !== undefined && (
                <p className="text-gray-600">
                    Your CRS on {data.userCRSNextDate} (projected):{" "}
                    <span className="font-medium text-gray-800">{data.userCRSNext}</span>{" "}
                    <span className={data.userCRSNext >= Number(data.drawCRS) ? "text-emerald-600" : "text-rose-600"}>
                        ({data.userCRSNext >= Number(data.drawCRS) ? "+" : ""}{data.userCRSNext - Number(data.drawCRS)} vs cut-off)
                    </span>
                </p>
            )}

            <p className="text-gray-600">
                Draw Size:{" "}
                <span className="font-medium text-gray-800">
                    {data.drawSize.toLocaleString()}
                </span>
            </p>

            <p className="text-gray-600">
                Date Cut-off:{" "}
                <span className="font-medium text-gray-800">
                    {data.dateCutOff.toLocaleString()}
                </span>
            </p>

            {data.candidatesIn500 && (
                <div className="mt-2 border-t pt-2">
                    <p className="text-gray-600">
                        Candidates in Pool (500+)
                        {data.dateInPool && (
                            <>
                                {" "}
                                as of{" "}
                                <span className="font-medium">
                                    {data.dateInPool}
                                </span>
                            </>
                        )}
                        :{" "}
                        <span className="font-medium text-gray-800">
                            {data.candidatesIn500.toLocaleString()}
                        </span>
                    </p>

                    <p className="mt-1 text-gray-600">
                        Draw-to-Pool Ratio:{" "}
                        <span className="font-medium text-gray-800">
                            {(
                                (data.drawSize /
                                    data.candidatesIn500) *
                                100
                            ).toFixed(1)}
                            %
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};