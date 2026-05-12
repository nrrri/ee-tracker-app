"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useEffect, useRef, useState } from "react";
import { InvitationData, PoolData } from "./type/Type";
import AnalysisCard from "./Analysis/AnalysisCard";
import SummaryInvitations from "./Analysis/SummaryInvitations";
import Link from "next/link";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  const [drawData, setDrawData] = useState<InvitationData[]>([])
  const [poolData, setPoolData] = useState<PoolData[]>([])
  const currYear = new Date().getFullYear();
  const hasFetched = useRef(false);
  
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
        <div className="m-8 text-3xl">Express Entry Tracker</div>
        <div className="flex justify-center gap-4 mb-8">
          <AnalysisCard drawData={drawData} />
          <SummaryInvitations drawData={drawData} currYear={currYear} />
          {/* todo: add AI summary trend each new draw */}
        </div>
        {/* todo: move menu to isolate component */}
        <div className="flex justify-end mr-8 gap-1">
          <ButtonGroup>
            <Button variant="outline" size="lg" className="hover:bg-transparent ">Go to</Button>
            {
              <Button onClick={(() => setDraws(!draws))} variant="outline" size="lg">{draws ? 'Candidate Pool' : 'Rounds of invitations'}</Button>
            }
          </ButtonGroup>

          <Link href={{
            pathname: "/draw-analysis",
          }}>
            <Button>
              CEC Insights
            </Button>
          </Link>
        </div>
        <AllTable tableType={draws} drawData={drawData} poolData={poolData} />
      </main>
    </div>
  );
}
