"use client";
import CandidateTable from "./CandidateTable"
import CandidateChart from "./CandidateChart"
import { useState } from "react"
import { DrawData, InvitationData, PoolData, NewCandidateSummary, DrawSummary } from "@/app/type/Type"
import { HeaderToggle } from "@/components/HeaderToggle"

type CandidateDataType = {
    poolData: PoolData[];
    drawData: InvitationData[];
}
export default function CandidateData({ poolData, drawData }: CandidateDataType) {
    const [openTable, setOpenTable] = useState<boolean>(true)

    const newCandidateSummary = (
        poolData: PoolData[],
        summaryData: DrawSummary[]
    ): NewCandidateSummary[] => {
        // map summary by date for O(1) lookup
        const summaryMap = new Map(
            summaryData.map(s => [s.drawDistributionAsOn, s])
        );

        return poolData.map((curr, i) => {
            const prev = poolData[i + 1];

            const summary = summaryMap.get(prev?.drawDistributionAsOn);

            // Stage 1: prev candidate - total draws
            const getDiffPrevAndDraw = summary ? (prev?.totalCandidates ?? 0) - summary?.totalDraw : (prev?.totalCandidates ?? 0)
            const getDiffPrevAndDrawOver500 = summary ? (prev?.range501_600 ?? 0) - summary?.cecDrawSize : (prev?.range501_600 ?? 0)

            // Stage 2: curr candidate - diff prev
            const getDiffTotal = curr.totalCandidates - getDiffPrevAndDraw
            const getDiffTotalOver500 = curr.range501_600 - getDiffPrevAndDrawOver500

            return {
                drawDistributionAsOn: curr.drawDistributionAsOn,
                newCandidate: getDiffTotal,
                newCandidateOver500: getDiffTotalOver500
            };
        });
    };

    const snapshotDates = [
        ...new Set(poolData.map(d => d.drawDistributionAsOn)),
    ]
        .map(date => ({
            raw: date,
            date: new Date(date),
        }))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const normalizedDraws = drawData.map(draw => {
        const drawDate = new Date(draw.drawDate);

        // latest snapshot date BEFORE or EQUAL draw date
        const matchedSnapshot = [...snapshotDates]
            .reverse()
            .find(snapshot => snapshot.date <= drawDate);

        return {
            ...draw,
            drawDistributionAsOn:
                matchedSnapshot?.raw ?? draw.drawDistributionAsOn,
        };
    });

    const summaryData: DrawSummary[] = Object.values(
        normalizedDraws.reduce((acc, curr: DrawData) => {
            const key = curr.drawDistributionAsOn;

            if (!acc[key]) {
                acc[key] = {
                    drawDistributionAsOn: key,
                    totalDraw: 0,
                    cecDrawSize: 0,
                };
            }

            acc[key].totalDraw += curr.drawSize;

            if (curr.drawName === 'Canadian Experience Class') {
                acc[key].cecDrawSize += curr.drawSize;
            }

            return acc;
        }, {} as Record<string, DrawSummary>)
    );

    return (
        <div>
            {/* Toggle menu */}
            <HeaderToggle title={'CRS score distribution of candidates in the pool'} openTable={openTable} onToggle={() => setOpenTable(!openTable)} />
            <div>
                {openTable ? <CandidateTable poolData={poolData} newCandidateSummary={newCandidateSummary(poolData, summaryData)} /> : <CandidateChart poolData={poolData} />}
            </div>
        </div>
    )
}