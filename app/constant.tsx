import { type ChartConfig } from "@/components/ui/chart"


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
  Provincial: "#4BD296",
  // Provincial: "#F09E7D",
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
  Canadian: '#FC4024',
}

export const poolColors: Record<string, string> = {
  range0_300: "#FFCCD3",
  range301_350: "#FFA1AD",
  range351_400: "#FF637E",
  range401_450: "#FF2056",
  range451_500: "#EC253F",
  range501_600: "#C71D36",
  range601_1200: "#A50C36",
  totalCandidates: "#8B0836",
}


export const keywordDrawType = [
  { key: 'cec', label: 'Canadian Experience Class' },
  { key: "provincial", label: "Provincial Nominee Program" },
  // Category Base
  { key: "french", label: "French Language" },
  { key: "healthcare", label: "Healthcare and Social Services Occupations" },
  { key: "stem", label: "STEM" },
  { key: "trade", label: "Trade Occupations" },
  { key: "education", label: "Education occupations" },
  { key: "transport", label: "Transport occupations" },
  { key: "physicians", label: "Physicians" },
  { key: "senior", label: "Senior Managers" },
  { key: "researchers", label: "Researchers" },
  { key: "military", label: "Skilled military recruits" },
]

export const keywordPoolType = [
  { key: "range0_300", label: "0 - 300" },
  { key: "range301_350", label: "301 - 350" },
  { key: "range351_400", label: "351 - 400" },
  { key: "range401_450", label: "401 - 450" },
  { key: "range451_500", label: "451 - 500" },
  { key: "range501_600", label: "501 - 600" },
  { key: "range601_1200", label: "600+" },
  { key: "totalCandidates", label: "Total Candidates" },
] as const;

export const allCategorise = ["Canadian Experience Class", "Provincial Nominee Program", "French-Language", "Healthcare and Social Services Occupations", "STEM", "Trade Occupations", "Education occupations", "Transport occupations", "Physicians", "Senior Managers",]

export const convertStrToNumber = (str: string) => {
  return Number(str.replace(/,/g, ""))
}

export const parseNumber = (value: string) =>
  Number(value.replace(/,/g, ""));

export function getColorFromName(name: string, pool: boolean = false) {
  const color: Record<string, string> = pool ? poolColors : keywordColors
  const keyword = Object.keys(color).find(k =>
    name.includes(k)
  )
  return keyword ? color[keyword] : "#D4D4D4"
}

export const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

export const darkenHex = (hex: string, factor = 0.8) => {
  hex = hex.replace("#", "");

  const r = Math.floor(parseInt(hex.slice(0, 2), 16) * factor);
  const g = Math.floor(parseInt(hex.slice(2, 4), 16) * factor);
  const b = Math.floor(parseInt(hex.slice(4, 6), 16) * factor);

  return `#${[r, g, b]
    .map(v => v.toString(16).padStart(2, "0"))
    .join("")}`;
};

export const PAGE_SIZE = 30;