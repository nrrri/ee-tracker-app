"use client";

import { InvitationData } from "../type/Type";


type AnalysisCardType = {
    drawData: InvitationData[];
}
export default function AnalysisCard({ drawData }: AnalysisCardType) {
    return (
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h1 className="text-xl font-semibold text-gray-800 mb-4">
                Latest Round
            </h1>
            <div className="space-y-3 text-sm text-gray-600">
                <div>
                    <span className="font-medium text-gray-800">Type:</span>{" "}
                    {drawData[0]?.drawName}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Draw #:</span>{" "}
                    {drawData[0]?.drawNumber}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Date:</span>{" "}
                    {drawData[0]?.drawDateFull}
                </div>
                <div>
                    <span className="font-medium text-gray-800">CRS Cut-off:</span>{" "}
                    {drawData[0]?.drawCRS}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Invitations:</span>{" "}
                    {drawData[0]?.drawSize?.toLocaleString()}
                </div>
                <div>
                    <span className="font-medium text-gray-800">Tie-breaking rule:</span>{" "}
                    {drawData[0]?.drawCutOff}
                </div>
            </div>
        </div>
    )
}