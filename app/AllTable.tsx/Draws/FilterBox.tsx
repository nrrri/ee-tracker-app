import { keywordDrawType } from "@/app/constant"
import { CheckboxBasic } from "@/components/CheckboxBasic"

type FiterBoxType = {
    addFilterType: string[];
    setAddFilterType: React.Dispatch<React.SetStateAction<string[]>>
}


export default function FiterBox({ addFilterType, setAddFilterType }: FiterBoxType) {
    // add draw type to filter
    const toggleFilter = (value: string) => {
        setAddFilterType(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        )
    }
    return (
        <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-4 w-fit mx-24 mb-12">
                {/* todo: refactor */}
                <CheckboxBasic title={keywordDrawType.cec} checked={addFilterType.includes(keywordDrawType.cec)} onCheckedChange={() => toggleFilter(keywordDrawType.cec)} />
                <CheckboxBasic title={keywordDrawType.provincial} checked={addFilterType.includes(keywordDrawType.provincial)} onCheckedChange={() => toggleFilter(keywordDrawType.provincial)} />
                <CheckboxBasic title={keywordDrawType.french} checked={addFilterType.includes(keywordDrawType.french)} onCheckedChange={() => toggleFilter(keywordDrawType.french)} />
                <CheckboxBasic title={keywordDrawType.healthcare} checked={addFilterType.includes(keywordDrawType.healthcare)} onCheckedChange={() => toggleFilter(keywordDrawType.healthcare)} />
                <CheckboxBasic title={keywordDrawType.stem} checked={addFilterType.includes(keywordDrawType.stem)} onCheckedChange={() => toggleFilter(keywordDrawType.stem)} />
                <CheckboxBasic title={keywordDrawType.trade} checked={addFilterType.includes(keywordDrawType.trade)} onCheckedChange={() => toggleFilter(keywordDrawType.trade)} />
                <CheckboxBasic title={keywordDrawType.education} checked={addFilterType.includes(keywordDrawType.education)} onCheckedChange={() => toggleFilter(keywordDrawType.education)} />
                <CheckboxBasic title={keywordDrawType.transport} checked={addFilterType.includes(keywordDrawType.transport)} onCheckedChange={() => toggleFilter(keywordDrawType.transport)} />
                <CheckboxBasic title={keywordDrawType.physicians} checked={addFilterType.includes(keywordDrawType.physicians)} onCheckedChange={() => toggleFilter(keywordDrawType.physicians)} />
                <CheckboxBasic title={keywordDrawType.senior} checked={addFilterType.includes(keywordDrawType.senior)} onCheckedChange={() => toggleFilter(keywordDrawType.senior)} />
                <CheckboxBasic title={keywordDrawType.researchers} checked={addFilterType.includes(keywordDrawType.researchers)} onCheckedChange={() => toggleFilter(keywordDrawType.researchers)} />
                <CheckboxBasic title={keywordDrawType.military} checked={addFilterType.includes(keywordDrawType.military)} onCheckedChange={() => toggleFilter(keywordDrawType.military)} />
            </div>
        </div>
    )
}