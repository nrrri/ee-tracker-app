"use client";

import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { createContext, useContext, useEffect, useState } from "react";
import {
    calculateCrs,
    CanadianEducation,
    CrsBreakdown,
    CrsProfile,
    crsChangesInYear,
    DEFAULT_CRS_PROFILE,
    Education,
    ForeignWork,
    LanguageAbilities,
} from "@/lib/crs";
import { FilterChip } from "@/components/FilterBox";
import { USER_CRS_COLOR } from "@/app/constant";

const STORAGE_KEY = "crs-profile";

type CrsContextValue = {
    profile: CrsProfile;
    // today's score, null until a date of birth is entered
    score: CrsBreakdown | null;
    // year whose birthdays / work anniversaries are projected on the chart
    projectionYear: number;
    openEditor: () => void;
};

const CrsContext = createContext<CrsContextValue | null>(null);

export function useCrs() {
    const context = useContext(CrsContext);
    if (!context) throw new Error("useCrs must be used within <CrsProvider />");
    return context;
}

// One profile shared by the Latest Round card, the chart and the editor panel.
// Remembered per browser so the viewer doesn't re-enter it every visit.
export function CrsProvider({ projectionYear, children }: { projectionYear: number; children: React.ReactNode }) {
    const [profile, setProfile] = useState<CrsProfile>(DEFAULT_CRS_PROFILE);
    const [open, setOpen] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // read after mount so server and client render the same markup
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (saved) setProfile({ ...DEFAULT_CRS_PROFILE, ...JSON.parse(saved) });
        } catch {
            // storage unavailable (private mode) — keep defaults
        }
        setLoaded(true);
    }, []);

    // only save once the stored profile has been read, so defaults never overwrite it
    useEffect(() => {
        if (!loaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch {
            // ignore — the calculator still works without persistence
        }
    }, [profile, loaded]);

    const value: CrsContextValue = {
        profile,
        score: calculateCrs(profile, new Date()),
        projectionYear,
        openEditor: () => setOpen(true),
    };

    return (
        <CrsContext.Provider value={value}>
            {children}
            <CrsEditor
                open={open}
                onOpenChange={setOpen}
                profile={profile}
                setProfile={setProfile}
                projectionYear={projectionYear}
            />
        </CrsContext.Provider>
    );
}

// ---- editor panel ----

const EDUCATION_OPTIONS: { value: Education; label: string }[] = [
    { value: "none", label: "Less than secondary" },
    { value: "secondary", label: "Secondary (high school)" },
    { value: "oneYear", label: "1-year post-secondary" },
    { value: "twoYear", label: "2-year post-secondary" },
    { value: "bachelor", label: "Bachelor's / 3+ year program" },
    { value: "twoOrMore", label: "Two or more credentials (one 3+ yrs)" },
    { value: "master", label: "Master's / professional degree" },
    { value: "doctoral", label: "Doctoral (PhD)" },
];

const CANADIAN_EDUCATION_OPTIONS: { value: CanadianEducation; label: string }[] = [
    { value: "none", label: "None" },
    { value: "oneOrTwoYear", label: "1–2 year credential" },
    { value: "threeYearPlus", label: "3+ years, master's or PhD" },
];

const FOREIGN_WORK_OPTIONS: { value: ForeignWork; label: string }[] = [
    { value: 0, label: "None" },
    { value: 1, label: "1–2 years" },
    { value: 3, label: "3+ years" },
];

const CLB_OPTIONS = [
    { value: 0, label: "Below 4" },
    ...[4, 5, 6, 7, 8, 9].map(v => ({ value: v, label: String(v) })),
    { value: 10, label: "10+" },
];

const SECOND_LANGUAGE_OPTIONS = [{ value: 0, label: "None" }, ...CLB_OPTIONS.slice(1)];

const SPOUSE_WORK_OPTIONS = [0, 1, 2, 3, 4, 5].map(v => ({ value: v, label: v === 5 ? "5+ years" : v === 0 ? "None" : `${v} year${v > 1 ? "s" : ""}` }));

const ABILITIES: { key: keyof LanguageAbilities; label: string }[] = [
    { key: "listening", label: "Listening" },
    { key: "reading", label: "Reading" },
    { key: "writing", label: "Writing" },
    { key: "speaking", label: "Speaking" },
];

const controlClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA1AD]";

const Field = ({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) => (
    <label className={`flex flex-col gap-1 text-xs font-medium text-gray-600 min-w-0 ${className}`}>
        {label}
        {children}
    </label>
);

function Select<T extends string | number>({ value, options, onChange }: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
}) {
    return (
        <select
            value={String(value)}
            onChange={(e) => {
                const picked = options.find(o => String(o.value) === e.target.value);
                if (picked) onChange(picked.value);
            }}
            className={controlClass}
        >
            {options.map(o => (
                <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
            ))}
        </select>
    );
}

// section label — same dot + uppercase style as the summary cards
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">{title}</h3>
        </div>
        {children}
    </div>
);

type CrsEditorProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: CrsProfile;
    setProfile: React.Dispatch<React.SetStateAction<CrsProfile>>;
    projectionYear: number;
}

function CrsEditor({ open, onOpenChange, profile, setProfile, projectionYear }: CrsEditorProps) {
    const update = <K extends keyof CrsProfile>(key: K, value: CrsProfile[K]) =>
        setProfile(prev => ({ ...prev, [key]: value }));

    const updateAbility = (key: keyof LanguageAbilities, value: number) =>
        setProfile(prev => ({ ...prev, firstLanguageClb: { ...prev.firstLanguageClb, [key]: value } }));

    const today = calculateCrs(profile, new Date());
    const changes = crsChangesInYear(profile, projectionYear);
    const formatDate = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white text-left shadow-xl focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
                    {/* Header — matches the summary card headers */}
                    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
                        <div>
                            <Dialog.Title className="text-base font-semibold text-gray-900">Your CRS</Dialog.Title>
                            <Dialog.Description className="text-xs text-gray-400 mt-0.5">
                                Estimate your score and compare it with each draw
                            </Dialog.Description>
                        </div>
                        <Dialog.Close className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA1AD]" aria-label="Close">
                            <X size={18} />
                        </Dialog.Close>
                    </div>

                    {/* Live result */}
                    <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                        {today ? (
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Today</p>
                                    <p className="text-3xl font-semibold text-gray-900 tabular-nums">{today.total}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Age {today.age} · {today.canadianWorkYears} yr{today.canadianWorkYears === 1 ? "" : "s"} Canadian exp.
                                    </p>
                                </div>
                                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    {[
                                        ["Core", today.core],
                                        ["Spouse", today.spouse],
                                        ["Transferability", today.transferability],
                                        ["Additional", today.additional],
                                    ].map(([label, value]) => (
                                        <div key={label} className="contents">
                                            <dt className="text-gray-500">{label}</dt>
                                            <dd className="text-right font-medium text-gray-800 tabular-nums">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Enter your date of birth to see your score.</p>
                        )}
                        {changes.length > 0 && (
                            <ul className="mt-3 flex flex-col gap-1 border-t border-gray-200/70 pt-3 text-xs">
                                {changes.map((c) => (
                                    <li key={c.date.getTime()} className="flex justify-between gap-2">
                                        <span className="text-gray-600">
                                            <span className="font-medium text-gray-800">{formatDate(c.date)}</span> · {c.reason}
                                        </span>
                                        <span className={`tabular-nums font-medium shrink-0 ${c.to > c.from ? "text-emerald-600" : "text-rose-600"}`}>
                                            {c.from} → {c.to}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Form */}
                    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
                        <Section title="About you">
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Date of birth" className="col-span-2">
                                    <input
                                        type="date"
                                        value={profile.birthDate}
                                        onChange={(e) => update("birthDate", e.target.value)}
                                        className={controlClass}
                                    />
                                </Field>
                                <Field label="Highest education" className="col-span-2">
                                    <Select value={profile.education} options={EDUCATION_OPTIONS} onChange={(v) => update("education", v)} />
                                </Field>
                                <Field label="Canadian education" className="col-span-2">
                                    <Select value={profile.canadianEducation} options={CANADIAN_EDUCATION_OPTIONS} onChange={(v) => update("canadianEducation", v)} />
                                </Field>
                            </div>
                        </Section>

                        <Section title="Language (CLB / NCLC)">
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="First language">
                                    <Select
                                        value={profile.firstLanguage}
                                        options={[{ value: "english", label: "English" }, { value: "french", label: "French" }]}
                                        onChange={(v) => update("firstLanguage", v)}
                                    />
                                </Field>
                                <Field label={profile.firstLanguage === "english" ? "French (all abilities)" : "English (all abilities)"}>
                                    <Select value={profile.secondLanguageClb} options={SECOND_LANGUAGE_OPTIONS} onChange={(v) => update("secondLanguageClb", v)} />
                                </Field>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {ABILITIES.map(({ key, label }) => (
                                    <Field key={key} label={label}>
                                        <Select value={profile.firstLanguageClb[key]} options={CLB_OPTIONS} onChange={(v) => updateAbility(key, v)} />
                                    </Field>
                                ))}
                            </div>
                        </Section>

                        <Section title="Work experience">
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Canadian skilled work since">
                                    <input
                                        type="date"
                                        value={profile.canadianWorkStart}
                                        onChange={(e) => update("canadianWorkStart", e.target.value)}
                                        className={controlClass}
                                    />
                                </Field>
                                <Field label="Foreign skilled work">
                                    <Select value={profile.foreignWork} options={FOREIGN_WORK_OPTIONS} onChange={(v) => update("foreignWork", v)} />
                                </Field>
                            </div>
                        </Section>

                        <Section title="Other factors">
                            <div className="flex flex-wrap gap-2">
                                <FilterChip label="Spouse / partner coming" selected={profile.hasSpouse} onToggle={() => update("hasSpouse", !profile.hasSpouse)} />
                                <FilterChip label="Sibling in Canada" selected={profile.siblingInCanada} onToggle={() => update("siblingInCanada", !profile.siblingInCanada)} />
                                <FilterChip label="Certificate of qualification" selected={profile.certificateOfQualification} onToggle={() => update("certificateOfQualification", !profile.certificateOfQualification)} />
                                <FilterChip label="Provincial nomination" selected={profile.provincialNomination} onToggle={() => update("provincialNomination", !profile.provincialNomination)} />
                            </div>
                        </Section>

                        {profile.hasSpouse && (
                            <Section title="Spouse or partner">
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Education" className="col-span-2">
                                        <Select value={profile.spouseEducation} options={EDUCATION_OPTIONS} onChange={(v) => update("spouseEducation", v)} />
                                    </Field>
                                    <Field label="Language CLB (all)">
                                        <Select value={profile.spouseClb} options={CLB_OPTIONS} onChange={(v) => update("spouseClb", v)} />
                                    </Field>
                                    <Field label="Canadian work">
                                        <Select value={profile.spouseCanadianWork} options={SPOUSE_WORK_OPTIONS} onChange={(v) => update("spouseCanadianWork", v)} />
                                    </Field>
                                </div>
                            </Section>
                        )}

                        <p className="text-[11px] leading-snug text-gray-400">
                            Estimate only. Assumes continuous full-time Canadian work and no other changes.
                            Job offer points were removed by IRCC on March 25, 2025.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 px-6 py-4">
                        <Dialog.Close className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA1AD] focus-visible:ring-offset-2">
                            Done
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// ---- entry points ----

// "Your CRS" block for the Latest Round card
export function CrsCardSummary({ cutOff }: { cutOff?: number }) {
    const { score, openEditor } = useCrs();
    const delta = score && cutOff !== undefined ? score.total - cutOff : null;

    return (
        <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: USER_CRS_COLOR }} />
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500">Your CRS</h2>
                </div>
                {score && (
                    <button type="button" onClick={openEditor} className="text-xs text-gray-500 hover:text-gray-800 hover:underline underline-offset-2">
                        Edit
                    </button>
                )}
            </div>
            {score ? (
                <div className="flex items-baseline justify-between gap-3 px-1">
                    <span className="text-3xl font-semibold text-gray-900 tabular-nums">{score.total}</span>
                    {delta !== null && (
                        <span className={`text-sm font-medium tabular-nums ${delta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                            {delta >= 0 ? "+" : ""}{delta} vs this cut-off
                        </span>
                    )}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={openEditor}
                    className="w-full rounded-xl border border-dashed border-gray-300 py-3 text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                    Calculate your CRS →
                </button>
            )}
        </div>
    );
}
