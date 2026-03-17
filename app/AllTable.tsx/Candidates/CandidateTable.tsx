import { PoolData } from "../../type/Type";

type CandidateTableType = {
    poolData: PoolData[]
}
export default function CandidateTable({ poolData }: CandidateTableType) {
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className={`${StyledHeaderTable}`}>Date</th>
                    <th className={`${StyledHeaderTable}`}>600+</th>
                    <th className={`${StyledHeaderTable}`}>501-600</th>
                    <th className={`${StyledHeaderTable}`}>441-450</th>
                    <th className={`${StyledHeaderTable}`}>351-400</th>
                    <th className={`${StyledHeaderTable}`}>301-350</th>
                    <th className={`${StyledHeaderTable}`}>0-300</th>
                    <th className={`${StyledHeaderTable}`}>Total Candidates</th>

                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-gray-900">
                {poolData.map((draw, index) => {
                    const checkRange = index < poolData.length - 1;
                    const currYear = draw.drawDistributionAsOn.split(', ')[1];
                    const prevYear = checkRange ? poolData[index + 1].drawDistributionAsOn.split(', ')[1] : null

                    return (
                        <tr key={draw.drawDistributionAsOn} className={`hover:bg-gray-50} ${checkRange ? currYear !== prevYear ? 'border-b-4 border-b-black' : 'border-0' : 'border-0'}`} >
                            <td className={`${StyledBodyTable}`}>{draw.drawDistributionAsOn}</td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range601_1200 > poolData[index + 1].range601_1200 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range601_1200.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range501_600 > poolData[index + 1].range501_600 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range501_600.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range451_500 > poolData[index + 1].range451_500 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range451_500.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range351_400 > poolData[index + 1].range351_400 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range351_400.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range301_350 > poolData[index + 1].range301_350 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range301_350.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.range0_300 > poolData[index + 1].range0_300 ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.range0_300.toLocaleString()}
                            </td>
                            <td className={`${StyledBodyTable} ${checkRange ? draw.totalCandidates > poolData[index + 1].totalCandidates ? 'bg-[#C8E856]' : 'bg-[#FA8072]' : 'bg-gray-300'}`}>
                                {draw.totalCandidates.toLocaleString()}
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table >
    )
}

const StyledHeaderTable = `
px-6 py-3 text-center text-s font-medium text-bold text-gray-500 uppercase tracking-wider
`
const StyledBodyTable = `
px-6 py-4 whitespace-nowrap border-1 border-white
`
