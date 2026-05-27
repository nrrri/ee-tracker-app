import { DataOption } from "../app/type/Type";

type FilterDropdownType = {
    options: DataOption[];
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>>;
    label?: string;
    pool?: boolean;
}

export default function FilterDropdown({
    options,
    addFilterType,
    setAddFilterType,
    pool = true,
    label = pool ? "Filter by range" : "Filter by category",
}: FilterDropdownType) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddFilterType([e.target.value]);
    };

    return (
        <div className="flex items-center gap-3">
            <label className="font-bold text-gray-700 whitespace-nowrap">
                {label}
            </label>
            <select
                value={addFilterType[0]}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA1AD]"
            >
                {options.map(({ key, label }) => (
                    <option key={key} value={pool ? key : label}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}

type FilterDropdownTimelineType = {
    addFilterType: string;
    setAddFilterType: React.Dispatch<React.SetStateAction<string>>;
}

export function FilterDropdownTimeline({
    addFilterType,
    setAddFilterType,
}: FilterDropdownTimelineType) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAddFilterType(e.target.value);
    };

    const options = ["Timeline", "Year-over-Year Comparison (2024-latest)"]

    return (
        <div className="flex items-center gap-3">
            <label className="font-bold text-gray-700 whitespace-nowrap">
                Set Data View to
            </label>
            <select
                value={addFilterType}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFA1AD]"
            >

                {options.map((op) => (
                    <option key={op} value={op}>
                        {op}
                    </option>
                ))}

            </select>
        </div>
    );
}