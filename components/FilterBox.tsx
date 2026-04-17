import { CheckboxBasic } from "@/components/CheckboxBasic"
import { Option } from "../app/type/Type";

type FilterBoxType = {
    options: Option[];
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>>;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    label: string;
}

export default function FilterBox({
    options,
    addFilterType,
    setAddFilterType,
    setPage,
    label
}: FilterBoxType) {

    const toggleFilter = (value: string) => {
        setAddFilterType(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
        setPage(1)
    };

    return (
        <div className="flex justify-center flex-col">
            <div className="my-4 font-bold text-start mr-10 pb-2">{label}</div>
            <div className={`grid gap-4 w-260 text-start ${label === 'Filter by year' ? 'grid-cols-5' : 'grid-cols-4'}`}>
                {options.map(({ key, label }) => (
                    <CheckboxBasic
                        key={key}
                        title={label}
                        checked={addFilterType.includes(label)}
                        onCheckedChange={() => toggleFilter(label)}
                    />
                ))}
            </div>
        </div>
    );
}