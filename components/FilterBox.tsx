import { cn } from "@/lib/utils";
import { DataOption } from "../app/type/Type";

type FilterChipType = {
    label: string;
    selected: boolean;
    onToggle: () => void;
    color?: string;
}

export function FilterChip({ label, selected, onToggle, color }: FilterChipType) {
    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick={onToggle}
            className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFA1AD]",
                selected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            )}
        >
            {color && (
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            )}
            {label}
        </button>
    );
}

type FilterBoxType = {
    options: DataOption[];
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    label: string;
    getColor?: (option: DataOption) => string;
}

export default function FilterBox({
    options,
    addFilterType,
    setAddFilterType,
    setPage,
    label,
    getColor,
}: FilterBoxType) {

    const toggleFilter = (value: string) => {
        setAddFilterType(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
        setPage(1)
    };

    const clearFilter = () => {
        setAddFilterType([]);
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-gray-700">{label}</span>
                {addFilterType.length > 0 ? (
                    <button
                        type="button"
                        onClick={clearFilter}
                        className="text-xs text-gray-500 hover:text-gray-800 hover:underline underline-offset-2"
                    >
                        Clear ({addFilterType.length})
                    </button>
                ) : (
                    <span className="text-xs text-gray-400">Showing all</span>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                    <FilterChip
                        key={option.key}
                        label={option.label}
                        selected={addFilterType.includes(option.label)}
                        onToggle={() => toggleFilter(option.label)}
                        color={getColor?.(option)}
                    />
                ))}
            </div>
        </div>
    );
}
