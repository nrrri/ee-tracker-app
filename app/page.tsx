"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useState } from "react";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  return (
    <div className="">
      <main className="">
        <div className="m-8 text-3xl">Express Entry Tracker</div>
        <div className="flex justify-end mr-8">
          <ButtonGroup>
            <Button variant="outline" size="lg">Return to</Button>
            {
              <Button onClick={(() => setDraws(!draws))} variant="outline" size="lg">{draws ? 'Candidate Pool' : 'Rounds of invitations'}</Button>
            }
          </ButtonGroup>
        </div>
        <AllTable tableType={draws} />
      </main>
    </div>
  );
}
