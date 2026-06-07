"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useEffect, useRef, useState } from "react";
import { DrawData, DrawSummary, InvitationData, NewCandidateSummary, PoolData } from "./type/Type";
import AnalysisCard from "./Analysis/AnalysisCard";
import SummaryInvitations from "./Analysis/SummaryInvitations";
import SumNewCandidates from "./Analysis/SumNewCandidates";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  const [drawData, setDrawData] = useState<InvitationData[]>([])
  const [poolData, setPoolData] = useState<PoolData[]>([])
  const currYear = new Date().getFullYear();
  const hasFetched = useRef(false);

  // ! Calculate New Candidate ----------------------------------
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
  // ! ----------------------------------------------------------

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    const fetchData = async () => {
      const [drawsRes, poolRes] = await Promise.all([
        fetch("/api/draws"),
        fetch("/api/candidate-pool"),
      ]);

      const { draws } = await drawsRes.json();
      const { pool } = await poolRes.json();

      setDrawData(draws);
      setPoolData(pool);
    };

    fetchData();
  }, []);

  return (
    <div>
      <main>
        {/* Header */}
        <div className="mx-4 mt-4 mb-6 text-2xl md:text-3xl font-semibold">
          Express Entry Tracker
        </div>

        {/* Summary Cards */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 px-4 mb-8 h-[500]">
          <AnalysisCard drawData={drawData} />
          <SummaryInvitations drawData={drawData} currYear={currYear} />
          <div className="overflow-y-auto border rounded-2xl shadow">
            <SumNewCandidates newCandidateSummary={newCandidateSummary(poolData, summaryData)} />
          </div>
          {/* todo: add AI summary trend each new draw */}
        </div>

        {/* Navigation */}
        {/* todo: move menu to isolate component */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 px-4 md:px-8 mb-4">
          <ButtonGroup className="w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-transparent"
            >
              Go to
            </Button>

            <Button
              onClick={() => setDraws(!draws)}
              variant="outline"
              size="lg"
            >
              {draws
                ? "Candidate Pool"
                : "Rounds of Invitations"}
            </Button>
          </ButtonGroup>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <AllTable
            tableType={draws}
            drawData={drawData}
            poolData={poolData}
            newCandidateSummary={newCandidateSummary(poolData, summaryData)}
          />
        </div>
      </main>
    </div>
  );
}
