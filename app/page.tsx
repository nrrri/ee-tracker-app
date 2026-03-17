"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useState } from "react";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  return (
    <>
      <div className="m-8 text-3xl">Express Entry Tracker</div>
      {/* todo: add recent draw & total number of each draw this year */}
      <div className="flex justify-end mr-8">
        <ButtonGroup className="">
          <Button variant="outline" size="lg">Return to</Button>
          {draws ?
            <Button onClick={(() => setDraws(!draws))} variant="outline" size="lg">Candidates in the Pool</Button> :
            <Button onClick={(() => setDraws(!draws))} variant="outline" size="lg">Rounds of invitations</Button>
          }
        </ButtonGroup>
      </div>
      <AllTable tableType={draws} />
    </>
  );
}
