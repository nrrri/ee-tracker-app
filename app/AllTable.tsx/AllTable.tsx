"use client";
import { InvitationData, NewCandidateSummary, PoolData } from "../type/Type";
import CandidateData from "./Candidates/CandidateData";
import DrawData from "./Draws/DrawData";
type AllTableType = {
    tableType: boolean;
    poolData: PoolData[];
    drawData: InvitationData[];
    newCandidateSummary: NewCandidateSummary[];
}
export default function AllTable({ tableType, drawData, poolData, newCandidateSummary }: AllTableType) {

    return (
        <div>
            {tableType ?
                <DrawData drawData={drawData} poolData={poolData} />
                :
                <CandidateData poolData={poolData} newCandidateSummary={newCandidateSummary} />
            }
        </div>
    );
}

