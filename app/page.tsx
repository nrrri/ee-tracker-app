"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useEffect, useState } from "react";
import { InvitationData, PoolData } from "./type/Type";
import AnalysisCard from "./Analysis/AnalysisCard";
import SummaryInvitations from "./Analysis/SummaryInvitations";
import { TriangleAlert } from "lucide-react";

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
      setDrawData(draws);
      setPoolData(pool);
    };

    fetchData(); // first load
    const interval = setInterval(fetchData, 1000 * 60 * 60 * 24); // every day
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <main>
        <div className="w-full bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-4 py-3 mb-6 text-sm flex items-start gap-1">
          <TriangleAlert size={18} className="shrink-0" />
          <div>
            <span className="font-semibold">Disclaimer:</span>{" "}
            This dashboard uses data from Immigration, Refugees and Citizenship Canada (IRCC) and is provided for informational purposes only.
            Any analysis, insights, or commentary are independently generated and do not represent official IRCC statements or policy.
            The information may not be fully accurate, complete, or up to date.{" "}
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations.html#latest"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium inline-flex items-center gap-1"
            >
              View official source
            </a>
          </div>
        </div>
        <div className="m-8 text-3xl">Express Entry Tracker</div>
        <div className="flex justify-center gap-4 mb-8">
          <AnalysisCard drawData={drawData} />
          <SummaryInvitations drawData={drawData} currYear={currYear} />
        </div>
        <div className="flex justify-end mr-8">
          <ButtonGroup>
            <Button variant="outline" size="lg" className="hover:bg-transparent ">Go to</Button>
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
