import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useId } from "react"
type CheckboxType = {
    title: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}
export function CheckboxBasic({ title, checked, onCheckedChange }: CheckboxType) {
    const id = useId();
    return (
        <FieldGroup className="mx-auto w-72">
            <Field orientation="horizontal">
                <Checkbox id={id} name={id} checked={checked}
                    onCheckedChange={onCheckedChange} />
                <FieldLabel className="w-auto" htmlFor={id}>
                    {title}
                </FieldLabel>
            </Field>
        </FieldGroup>
    )
}
