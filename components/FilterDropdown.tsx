import { Option } from "../app/type/Type";

type FilterDropdownType = {
    options: Option[];
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>> ;
    label?: string;
}

export default function FilterDropdown({
    options,
    addFilterType,
    setAddFilterType,
    label = "Filter by range",
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
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}