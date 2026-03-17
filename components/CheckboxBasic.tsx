import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
type CheckboxType = {
    title: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}
export function CheckboxBasic({ title, checked, onCheckedChange }: CheckboxType) {
    return (
        <FieldGroup className="mx-auto w-56">
            <Field orientation="horizontal">
                <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" checked={checked}
                    onCheckedChange={onCheckedChange} />
                <FieldLabel className="w-auto" htmlFor="terms-checkbox-basic">
                    {title}
                </FieldLabel>
            </Field>
        </FieldGroup>
    )
}
