import { HtmlHTMLAttributes, InputHTMLAttributes } from "react";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    onChange?: (value: any) => void;
    label: string;
    columnClasses?: string;
}

export const Input: React.FC<inputProps> = ({
    onChange,
    label,
    columnClasses,
    id,
    ...inputProps
}: inputProps) => {
    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <div className="control">
                <input
                    id={id}
                    className="input"
                    {...inputProps}
                    onChange={e => {
                        if (onChange) {
                            onChange(e.target.value)
                        }
                    }}
                />
            </div>
        </div>
    )
}