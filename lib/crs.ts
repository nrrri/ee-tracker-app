// Comprehensive Ranking System (CRS) points, based on the IRCC criteria:
// https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/check-score/crs-criteria.html
// Arranged employment points are not included: IRCC removed them on March 25, 2025.

export type Education =
    | "none"
    | "secondary"
    | "oneYear"
    | "twoYear"
    | "bachelor"
    | "twoOrMore"
    | "master"
    | "doctoral";

export type CanadianEducation = "none" | "oneOrTwoYear" | "threeYearPlus";

// 0 = none, 1 = 1–2 years, 3 = 3 years or more
export type ForeignWork = 0 | 1 | 3;

export type LanguageAbilities = {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
};

export type CrsProfile = {
    hasSpouse: boolean;
    birthDate: string; // yyyy-mm-dd
    education: Education;
    canadianEducation: CanadianEducation;
    firstLanguage: "english" | "french";
    firstLanguageClb: LanguageAbilities; // 0 = below CLB 4
    secondLanguageClb: number; // same level for all abilities, 0 = none
    canadianWorkStart: string; // yyyy-mm-dd, "" = no Canadian experience
    foreignWork: ForeignWork;
    certificateOfQualification: boolean;
    siblingInCanada: boolean;
    provincialNomination: boolean;
    spouseEducation: Education;
    spouseClb: number; // same level for all abilities
    spouseCanadianWork: number; // years
};

export type CrsBreakdown = {
    total: number;
    core: number;
    spouse: number;
    transferability: number;
    additional: number;
    age: number;
    canadianWorkYears: number;
};

export const DEFAULT_CRS_PROFILE: CrsProfile = {
    hasSpouse: false,
    birthDate: "",
    education: "bachelor",
    canadianEducation: "none",
    firstLanguage: "english",
    firstLanguageClb: { listening: 7, reading: 7, writing: 7, speaking: 7 },
    secondLanguageClb: 0,
    canadianWorkStart: "",
    foreignWork: 0,
    certificateOfQualification: false,
    siblingInCanada: false,
    provincialNomination: false,
    spouseEducation: "none",
    spouseClb: 0,
    spouseCanadianWork: 0,
};

// ---- points tables: [single, with spouse] ----

const AGE_POINTS: Record<number, [number, number]> = {
    18: [99, 90], 19: [105, 95],
    30: [105, 95], 31: [99, 90], 32: [94, 85], 33: [88, 80], 34: [83, 75],
    35: [77, 70], 36: [72, 65], 37: [66, 60], 38: [61, 55], 39: [55, 50],
    40: [50, 45], 41: [39, 35], 42: [28, 25], 43: [17, 15], 44: [6, 5],
};

const EDUCATION_POINTS: Record<Education, [number, number]> = {
    none: [0, 0],
    secondary: [30, 28],
    oneYear: [90, 84],
    twoYear: [98, 91],
    bachelor: [120, 112],
    twoOrMore: [128, 119],
    master: [135, 126],
    doctoral: [150, 140],
};

const CANADIAN_WORK_POINTS: [number, number][] = [
    [0, 0], [40, 35], [53, 46], [64, 56], [72, 63], [80, 70],
];

const SPOUSE_EDUCATION_POINTS: Record<Education, number> = {
    none: 0, secondary: 2, oneYear: 6, twoYear: 7, bachelor: 8, twoOrMore: 9, master: 10, doctoral: 10,
};

const SPOUSE_CANADIAN_WORK_POINTS = [0, 5, 7, 8, 9, 10];

const agePoints = (age: number, spouse: number) => {
    if (age < 18 || age >= 45) return 0;
    if (age >= 20 && age <= 29) return [110, 100][spouse];
    return AGE_POINTS[age][spouse];
};

const firstLanguagePoints = (clb: number, spouse: number) => {
    if (clb >= 10) return [34, 32][spouse];
    if (clb === 9) return [31, 29][spouse];
    if (clb === 8) return [23, 22][spouse];
    if (clb === 7) return [17, 16][spouse];
    if (clb === 6) return [9, 8][spouse];
    if (clb >= 4) return 6;
    return 0;
};

const secondLanguagePoints = (clb: number) => {
    if (clb >= 9) return 6;
    if (clb >= 7) return 3;
    if (clb >= 5) return 1;
    return 0;
};

const spouseLanguagePoints = (clb: number) => {
    if (clb >= 9) return 5;
    if (clb >= 7) return 3;
    if (clb >= 5) return 1;
    return 0;
};

// ---- dates ----

export const parseLocalDate = (value: string) => {
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
};

const fullYearsBetween = (from: Date, to: Date) => {
    let years = to.getFullYear() - from.getFullYear();
    if (to.getMonth() < from.getMonth() || (to.getMonth() === from.getMonth() && to.getDate() < from.getDate())) {
        years--;
    }
    return Math.max(0, years);
};

// ---- calculation ----

export function calculateCrs(profile: CrsProfile, at: Date): CrsBreakdown | null {
    const birth = parseLocalDate(profile.birthDate);
    if (!birth) return null;

    const s = profile.hasSpouse ? 1 : 0;
    const age = fullYearsBetween(birth, at);
    const workStart = parseLocalDate(profile.canadianWorkStart);
    const canadianWorkYears = workStart && workStart <= at ? fullYearsBetween(workStart, at) : 0;

    const clb = profile.firstLanguageClb;
    const abilities = [clb.listening, clb.reading, clb.writing, clb.speaking];
    const minClb = Math.min(...abilities);

    // A. core / human capital
    const secondLanguage = Math.min(secondLanguagePoints(profile.secondLanguageClb) * 4, s ? 22 : 24);
    const core =
        agePoints(age, s) +
        EDUCATION_POINTS[profile.education][s] +
        abilities.reduce((sum, level) => sum + firstLanguagePoints(level, s), 0) +
        secondLanguage +
        CANADIAN_WORK_POINTS[Math.min(canadianWorkYears, 5)][s];

    // B. spouse or common-law partner
    const spouse = profile.hasSpouse
        ? SPOUSE_EDUCATION_POINTS[profile.spouseEducation] +
        spouseLanguagePoints(profile.spouseClb) * 4 +
        SPOUSE_CANADIAN_WORK_POINTS[Math.min(profile.spouseCanadianWork, 5)]
        : 0;

    // C. skill transferability
    const languageTier = minClb >= 9 ? 2 : minClb >= 7 ? 1 : 0;
    const canadianWorkTier = canadianWorkYears >= 2 ? 2 : canadianWorkYears >= 1 ? 1 : 0;
    const educationTier =
        ["twoOrMore", "master", "doctoral"].includes(profile.education) ? 2
            : ["oneYear", "twoYear", "bachelor"].includes(profile.education) ? 1
                : 0;
    const foreignTier = profile.foreignWork === 3 ? 2 : profile.foreignWork === 1 ? 1 : 0;

    // tier 1 credential/experience earns 13 or 25, tier 2 earns 25 or 50
    const combo = (tier: number, withTier: number) =>
        tier === 0 || withTier === 0 ? 0 : [[13, 25], [25, 50]][tier - 1][withTier - 1];

    const educationTransfer = Math.min(50, combo(educationTier, languageTier) + combo(educationTier, canadianWorkTier));
    const foreignTransfer = Math.min(50, combo(foreignTier, languageTier) + combo(foreignTier, canadianWorkTier));
    const certificateTransfer = profile.certificateOfQualification
        ? minClb >= 7 ? 50 : minClb >= 5 ? 25 : 0
        : 0;
    const transferability = Math.min(100, educationTransfer + foreignTransfer + certificateTransfer);

    // D. additional points
    const frenchClb = profile.firstLanguage === "french" ? minClb : profile.secondLanguageClb;
    const englishClb = profile.firstLanguage === "english" ? minClb : profile.secondLanguageClb;
    const frenchBonus = frenchClb >= 7 ? (englishClb >= 5 ? 50 : 25) : 0;
    const canadianEducationBonus =
        profile.canadianEducation === "threeYearPlus" ? 30 : profile.canadianEducation === "oneOrTwoYear" ? 15 : 0;
    const additional = Math.min(
        600,
        (profile.provincialNomination ? 600 : 0) +
        (profile.siblingInCanada ? 15 : 0) +
        frenchBonus +
        canadianEducationBonus
    );

    return {
        total: core + spouse + transferability + additional,
        core,
        spouse,
        transferability,
        additional,
        age,
        canadianWorkYears,
    };
}

export type CrsChange = {
    date: Date;
    reason: string;
    from: number;
    to: number;
};

// dates within `year` where the score changes because of a birthday or a Canadian work anniversary
export function crsChangesInYear(profile: CrsProfile, year: number): CrsChange[] {
    const candidates: { date: Date; reason: (b: CrsBreakdown) => string }[] = [];

    const birth = parseLocalDate(profile.birthDate);
    if (birth) {
        candidates.push({ date: new Date(year, birth.getMonth(), birth.getDate()), reason: (b) => `Turn ${b.age}` });
    }
    const workStart = parseLocalDate(profile.canadianWorkStart);
    if (workStart && workStart.getFullYear() < year) {
        candidates.push({
            date: new Date(year, workStart.getMonth(), workStart.getDate()),
            reason: (b) => `${b.canadianWorkYears} yr${b.canadianWorkYears > 1 ? "s" : ""} Canadian experience`,
        });
    }

    const changes = new Map<number, CrsChange>();
    for (const { date, reason } of candidates) {
        const dayBefore = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
        const before = calculateCrs(profile, dayBefore);
        const after = calculateCrs(profile, date);
        if (!before || !after || before.total === after.total) continue;

        // birthday and work anniversary on the same day -> one combined change
        const existing = changes.get(date.getTime());
        if (existing) existing.reason += ` & ${reason(after)}`;
        else changes.set(date.getTime(), { date, reason: reason(after), from: before.total, to: after.total });
    }

    return [...changes.values()].sort((a, b) => a.date.getTime() - b.date.getTime());
}
