"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useEffect, useState } from "react";
import { InvitationData, PoolData } from "./type/Type";
import { allCategorise } from "./constant";
import AnalysisCard from "./Analysis/AnalysisCard";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  const [drawData, setDrawData] = useState<InvitationData[]>([])
  const [poolData, setPoolData] = useState<PoolData[]>([])
  const currYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      const [drawsRes, poolRes] = await Promise.all([
        fetch('/api/draws'),
        fetch('/api/candidate-pool'),
      ]);
      const { draws } = await drawsRes.json();
      const { pool } = await poolRes.json();
      console.log('check draws', draws)
      console.log('check pool', pool)
      setDrawData(draws);
      setPoolData(pool);
    };

    fetchData(); // first load
    const interval = setInterval(fetchData, 1000 * 60 * 60 * 24); // every day
    return () => clearInterval(interval);
  }, []);

  const totalInvitationCurrentYear = () => {
    const total = drawData.reduce((acc, curr) => {
      const drawYear = new Date(curr.drawDate).getFullYear();
      if (drawYear === currYear) {
        return acc + Number(curr.drawSize);
      }
      return acc;
    }, 0);
    return total.toLocaleString();
  };


  const getCategory = (input: string) => {
    const lower = input.toLowerCase();

    return (
      allCategorise.find(cat =>
        lower.includes(cat.toLowerCase())
      ) || "Other"
    );
  };

  const totalInvitationCurrentYearByCategory = Object.entries(
    drawData
      .filter(draw => draw.drawYear === currYear)
      .reduce((acc, curr) => {
        const key = getCategory(curr.drawName);
        if (!acc[key]) {
          acc[key] = { value: 0, invitation: 0 };
        }
        acc[key].value += curr.drawSize;        // total invitations
        acc[key].invitation += 1;      // count of draws

        return acc;
      }, {} as Record<string, { value: number; invitation: number }>)
  ).map(([name, data]) => ({
    name,
    value: data.value,
    invitation: data.invitation,
  })).sort((a, b) => b.value - a.value);

  return (
    <div>
      <main>
        <div className="m-8 text-3xl">Express Entry Tracker</div>
        <div className="flex justify-center gap-4 mb-8">
          <AnalysisCard drawData={drawData} />
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">Draw Summary of 2026</h1>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-800">Totol Invitations:</span>{" "}
                {totalInvitationCurrentYear()}
              </div>
              <div className="space-y-3 text-sm text-gray-600">{totalInvitationCurrentYearByCategory.map((cat) => {
                return (
                  <div key={cat.name}>
                    <span className="font-medium text-gray-800">{cat.name}: </span>
                    {cat.value.toLocaleString()}
                    <span> [{cat.invitation.toLocaleString()}]</span>
                  </div>

                )
              })}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mr-8">
          <ButtonGroup>
            <Button variant="outline" size="lg">Return to</Button>
            {
              <Button onClick={(() => setDraws(!draws))} variant="outline" size="lg">{draws ? 'Candidate Pool' : 'Rounds of invitations'}</Button>
            }
          </ButtonGroup>
        </div>
        <AllTable tableType={draws} drawData={drawData} poolData={poolData} />
      </main>
    </div>
  );
}
