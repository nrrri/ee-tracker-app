import { CheckboxBasic } from "@/components/CheckboxBasic"
import { Option } from "../../type/Type";

type FilterBoxType = {
    options: Option[];
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>>;
    singleSelect?: boolean;
}


export default function FilterBox({
    options,
    addFilterType,
    setAddFilterType,
    singleSelect = false,
}: FilterBoxType) {

    const toggleFilter = (value: string) => {
        setAddFilterType(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const handleChange = (value: string) => {
        if (singleSelect) {
            setAddFilterType(Array(value)); // only one range
        } else {
            toggleFilter(value);
        }
    };
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-4 w-fit mx-24 mb-12">
                {options.map(({ key, label }) => {
                    return (
                        <CheckboxBasic
                            key={key}
                            title={label}
                            checked={singleSelect ? addFilterType.includes(key) : addFilterType.includes(label)}
                            onCheckedChange={() => singleSelect ? handleChange(key) : handleChange(label)}
                        />
                    )
                })}
            </div>
        </div>
    );
}