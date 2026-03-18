import { Button } from "@/components/ui/button"
import { Table2, ChartSpline } from "lucide-react"

type HeaderTableProps = {
    title: string
    openTable: boolean
    onToggle: () => void
}

export function HeaderToggle({
    title,
    openTable,
    onToggle,
}: HeaderTableProps) {
    return (
        <div className="flex items-center justify-between mx-8">
            <div />
            <div className="m-8 text-3xl">{title}</div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={onToggle}>
                    {openTable ? <ChartSpline /> : <Table2 />}
                </Button>
            </div>
        </div>
    )
}