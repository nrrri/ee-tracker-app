/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { ExpressEntryDraw, InvitationData, PoolData } from "../type/Type";
import CandidateData from "./Candidates/CandidateData";
import DrawData from "./Draws/DrawData";
type AllTableType = {
    tableType: boolean;
}
export default function AllTable({ tableType }: AllTableType) {
    const [data, setData] = useState<ExpressEntryDraw[]>([])
    const [poolData, setPoolData] = useState<PoolData[]>([])
    const [drawData, setDrawData] = useState<InvitationData[]>([])

    const convertStrToNumber = (str: string) => {
        return Number(str.replace(/,/g, ""))
    }

    // Fetch data from IRCC
    useEffect(() => {
        const fetchData = () => {
            fetch(
                `https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json?t=${Date.now()}`
            )
                .then((res) => res.json())
                .then((json) => {
                    setData(json.rounds)
                })
        }
        fetchData() // first load
        const interval = setInterval(fetchData, 60000 * 60 * 24) // every day
        return () => clearInterval(interval)
    }, [])

    // get Candidate pool data
    useEffect(() => {
        const transformRaw: PoolData[] = data.map((draw) => {
            return {
                drawDistributionAsOn: draw.drawDistributionAsOn,
                range601_1200: convertStrToNumber(draw.dd1), // dd1
                range501_600: convertStrToNumber(draw.dd2), // dd2
                range451_500: convertStrToNumber(draw.dd3), // dd3
                range491_500: convertStrToNumber(draw.dd4), // dd4
                range481_490: convertStrToNumber(draw.dd5), // dd5
                range471_480: convertStrToNumber(draw.dd6), // dd6
                range461_470: convertStrToNumber(draw.dd7), // dd7
                range451_460: convertStrToNumber(draw.dd8), // dd8
                range401_450: convertStrToNumber(draw.dd9), // dd9
                range441_450: convertStrToNumber(draw.dd10), // dd10
                range431_440: convertStrToNumber(draw.dd11), // dd11
                range421_430: convertStrToNumber(draw.dd12), // dd12
                range411_420: convertStrToNumber(draw.dd13), // dd13
                range401_410: convertStrToNumber(draw.dd14), // dd14
                range351_400: convertStrToNumber(draw.dd15), // dd15
                range301_350: convertStrToNumber(draw.dd16), // dd16
                range0_300: convertStrToNumber(draw.dd17), // dd17
                totalCandidates: convertStrToNumber(draw.dd18),
            }
        }).filter((draw) => draw.range0_300 !== 0)
        const uniqueArr = Array.from(
            new Map(transformRaw.map(item => [JSON.stringify(item), item])).values()
        );
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPoolData(uniqueArr)
    }, [data])

    // get Invitations data
    useEffect(() => {
        const transformRaw: InvitationData[] = data.map((draw) => {
            return {
                drawNumber: draw.drawNumber,
                drawNumberURL: draw.drawNumberURL,
                drawDate: draw.drawDate,
                drawDateFull: draw.drawDateFull,
                drawName: draw.drawName,
                drawSize: draw.drawSize,
                drawCRS: draw.drawCRS,
                mitext: draw.mitext,
                DrawText1: draw.DrawText1,
                drawText2: draw.drawText2,
                drawDateTime: draw.drawDateTime,
                drawCutOff: draw.drawCutOff,
                drawDistributionAsOn: draw.drawDistributionAsOn,
            }
        })
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDrawData(transformRaw)
    }, [data])

    return (
        <div>
            {tableType ?
                <DrawData drawData={drawData} />
                :
                <CandidateData poolData={poolData} />
            }
        </div>
    );
}

