"use client";
import { InvitationData, PoolData } from "../type/Type";
import CandidateData from "./Candidates/CandidateData";
import DrawData from "./Draws/DrawData";
type AllTableType = {
    tableType: boolean;
    poolData: PoolData[];
    drawData: InvitationData[];
}
export default function AllTable({ tableType, drawData, poolData }: AllTableType) {

    return (
        <div>
            {tableType ?
                <DrawData drawData={drawData} />
                :
                <CandidateData poolData={poolData} />
            }
        </div>
    );
}

