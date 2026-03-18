"use client";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import AllTable from "./AllTable.tsx/AllTable";
import { useEffect, useState } from "react";
import { ExpressEntryDraw, InvitationData, PoolData } from "./type/Type";
import { allCategorise, convertStrToNumber, parseNumber } from "./constant";

export default function Home() {
  const [draws, setDraws] = useState<boolean>(true);
  const [data, setData] = useState<ExpressEntryDraw[]>([])
  const [drawData, setDrawData] = useState<InvitationData[]>([])
  const [poolData, setPoolData] = useState<PoolData[]>([])
  const currYear = new Date().getFullYear();



  // Fetch data from IRCC
  useEffect(() => {
    const fetchData = () => {
      fetch(
        `https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json?t=${Date.now()}`
      )
        .then((res) => res.json())
        .then((json) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const filterNoDrawName = json.rounds.filter((item: any) => item.drawName !== 'No Program Specified')
          setData(filterNoDrawName)
        })
    }
    fetchData() // first load
    const interval = setInterval(fetchData, 60000 * 60 * 24) // every day
    return () => clearInterval(interval)
  }, [])

  // get Invitations data
  useEffect(() => {
    const transformRaw: InvitationData[] = data.map((draw) => {
      return {
        drawNumber: draw.drawNumber,
        drawNumberURL: draw.drawNumberURL,
        drawDate: draw.drawDate,
        drawDateFull: draw.drawDateFull,
        drawName: draw.drawName,
        drawSize: parseNumber(draw.drawSize),
        drawCRS: draw.drawCRS,
        mitext: draw.mitext,
        DrawText1: draw.DrawText1,
        drawText2: draw.drawText2,
        drawDateTime: draw.drawDateTime,
        drawCutOff: draw.drawCutOff,
        drawDistributionAsOn: draw.drawDistributionAsOn,
        drawYear: new Date(draw.drawDate).getFullYear(),
      }
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawData(transformRaw)
  }, [data])

  // get Candidate pool data
  useEffect(() => {
    const transformRaw: PoolData[] = data.map((draw) => {
      return {
        drawDistributionAsOn: draw.drawDistributionAsOn,
        range601_1200: convertStrToNumber(draw.dd1), // dd1
        range501_600: convertStrToNumber(draw.dd2), // dd2
        range451_500: convertStrToNumber(draw.dd3), // dd3
        range491_500: convertStrToNumber(draw.dd4), // dd4
        range481_490: convertStrToNumber(draw.dd5), // dd5
        range471_480: convertStrToNumber(draw.dd6), // dd6
        range461_470: convertStrToNumber(draw.dd7), // dd7
        range451_460: convertStrToNumber(draw.dd8), // dd8
        range401_450: convertStrToNumber(draw.dd9), // dd9
        range441_450: convertStrToNumber(draw.dd10), // dd10
        range431_440: convertStrToNumber(draw.dd11), // dd11
        range421_430: convertStrToNumber(draw.dd12), // dd12
        range411_420: convertStrToNumber(draw.dd13), // dd13
        range401_410: convertStrToNumber(draw.dd14), // dd14
        range351_400: convertStrToNumber(draw.dd15), // dd15
        range301_350: convertStrToNumber(draw.dd16), // dd16
        range0_300: convertStrToNumber(draw.dd17), // dd17
        totalCandidates: convertStrToNumber(draw.dd18),
      }
    }).filter((draw) => draw.range0_300 !== 0)
    const uniqueArr = Array.from(
      new Map(transformRaw.map(item => [JSON.stringify(item), item])).values()
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPoolData(uniqueArr)
  }, [data])

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
        {/* todo: add recent draw */}
        <div className="flex justify-center gap-4 mb-8">
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
