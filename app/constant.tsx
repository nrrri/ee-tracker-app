import { InvitationData, PoolData } from "./type/Type";

export const poolRangeMain = [
  "range601_1200",
  "range501_600",
  "range451_500",
  "range401_450",
  "range351_400",
  "range0_300",
];

export const drawType = {
  /*
   French-language proficiency
   Healthcare and social services occupations
   Science, Technology, Engineering and Math (STEM) occupations
   Trade occupations
   Education occupations
   Transport occupations
   Physicians with Canadian work experience
   Senior managers with Canadian work experience
   Researchers with Canadian work experience
   Skilled military recruits
    */
}

export const keywordColors: Record<string, string> = {
  Provincial: "#F09E7D",
  // Category Base
  French: "#F8991D",
  Healthcare: "#00859C",
  STEM: "#EF4782",
  Trade: "#9F8D32",
  Education: "#8552A0",
  Transport: "#00784F",
  Physicians: "#004242",
  Senior: "#EBDCC7",
  Researchers: "#EBDEA6",
  Military: "#BBC5AB",
}

export const keywordDrawType: Record<string, string> = {
  cec: 'Canadian Experience Class',
  provincial: "Provincial Nominee Program",
  // Category Base
  french: "French Language",
  healthcare: "Healthcare and Social Services Occupations",
  stem: "STEM",
  trade: "Trade Occupations",
  education: "Education occupations",
  transport: "Transport occupations",
  physicians: "Physicians",
  senior: "Senior Managers",
  researchers: "Researchers",
  military: "Skilled military recruits",
}

export const allCategory = ["Canadian Experience Class", "Provincial Nominee Program", "French Language", "Healthcare and Social Services Occupations", "STEM", "Trade Occupations", "Education occupations", "Transport occupations", "Physicians", "Senior Managers",]
