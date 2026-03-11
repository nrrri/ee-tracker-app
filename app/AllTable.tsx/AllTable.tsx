/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { ExpressEntryDraw, PoolData } from "../type/Type";

export default function AllTable() {
    const [data, setData] = useState<ExpressEntryDraw[]>([])
    const [poolData, setPoolData] = useState<PoolData[]>([])

    const convertStrToNumber = (str: string) => {
        return Number(str.replace(/,/g, ""))
    }

    // Fetch data from IRCC
    useEffect(() => {
        fetch("https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json")
            .then((res) => res.json())
            .then((json) => {
                setData(json.rounds)
            });
    }, []);

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

    return (
        <>
            <div className="m-8 text-3xl">All draws</div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className={`${StyledHeaderTable}`}>Date</th>
                        <th className={`${StyledHeaderTable}`}>0-300</th>
                        <th className={`${StyledHeaderTable}`}>301-350</th>
                        <th className={`${StyledHeaderTable}`}>351-400</th>
                        <th className={`${StyledHeaderTable}`}>441-450</th>
                        <th className={`${StyledHeaderTable}`}>501-600</th>
                        <th className={`${StyledHeaderTable}`}>600+</th>
                        <th className={`${StyledHeaderTable}`}>Total Candidates</th>

                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {poolData.map((draw, index) => {
                        const checkRange = index < poolData.length - 1;
                        const currYear = draw.drawDistributionAsOn.split(', ')[1];
                        const prevYear = checkRange ? poolData[index + 1].drawDistributionAsOn.split(', ')[1] : null

                        return (
                            <tr key={draw.drawDistributionAsOn} className={`hover:bg-gray-50} ${checkRange ? currYear !== prevYear ? 'border-b-4 border-b-black' : 'border-0' : 'border-0'}`} >
                                <td className={`${StyledBodyTable}`}>{draw.drawDistributionAsOn}</td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range0_300 > poolData[index + 1].range0_300 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range0_300.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range301_350 > poolData[index + 1].range301_350 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range301_350.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range351_400 > poolData[index + 1].range351_400 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range351_400.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range451_500 > poolData[index + 1].range451_500 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range451_500.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range501_600 > poolData[index + 1].range501_600 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range501_600.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.range601_1200 > poolData[index + 1].range601_1200 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.range601_1200.toLocaleString()}
                                </td>
                                <td className={`${StyledBodyTable} ${checkRange ? draw.totalCandidates > poolData[index + 1].totalCandidates ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                    {draw.totalCandidates.toLocaleString()}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table >
        </>
    );
}

const StyledHeaderTable = `
px-6 py-3 text-center text-s font-medium text-bold text-gray-500 uppercase tracking-wider
`
const StyledBodyTable = `
px-6 py-4 whitespace-nowrap border-1 border-white
`
