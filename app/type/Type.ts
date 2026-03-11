export type ExpressEntryDraw = {
  drawNumber: string;
  drawNumberURL: string;
  drawDate: string;
  drawDateFull: string;
  drawName: string;
  drawSize: string;
  drawCRS: string;
  mitext: string;
  DrawText1: string;
  drawText2: string;
  drawDateTime: string;
  drawCutOff: string;
  drawDistributionAsOn: string;

  dd1: string;
  dd2: string;
  dd3: string;
  dd4: string;
  dd5: string;
  dd6: string;
  dd7: string;
  dd8: string;
  dd9: string;
  dd10: string;
  dd11: string;
  dd12: string;
  dd13: string;
  dd14: string;
  dd15: string;
  dd16: string;
  dd17: string;
  dd18: string;
};

export type PoolData = {
  drawDistributionAsOn: string;

  range601_1200: number; // dd1
  range501_600: number; // dd2
  range451_500: number; // dd3
  range491_500: number; // dd4
  range481_490: number; // dd5
  range471_480: number; // dd6
  range461_470: number; // dd7
  range451_460: number; // dd8
  range401_450: number; // dd9
  range441_450: number; // dd10
  range431_440: number; // dd11
  range421_430: number; // dd12
  range411_420: number; // dd13
  range401_410: number; // dd14
  range351_400: number; // dd15
  range301_350: number; // dd16
  range0_300: number; // dd17
  totalCandidates: number; // dd18
};
