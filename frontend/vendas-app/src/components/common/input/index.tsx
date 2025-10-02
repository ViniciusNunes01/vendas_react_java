import { formatReal } from "@/app/util/money/intex";
import { HtmlHTMLAttributes, InputHTMLAttributes } from "react";

interface inputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    onChange?: (value: any) => void;
    label: string;
    columnClasses?: string;
    currency?: boolean;
    error?: string;
}

export const Input: React.FC<inputProps> = ({
    onChange,
    label,
    columnClasses,
    id,
    currency,
    error,
    ...inputProps
}: inputProps) => {

    const onInputChange = (e: any) => {

        let value = e.target.value;

        if (value && currency) {
            value = formatReal(value);
        }

        if (onChange) {
            onChange(value)
        }
    }

    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <div className="control">
                <input
                    id={id}
                    className="input"
                    {...inputProps}
                    onChange={onInputChange}
                />
                {error &&
                    <p className="help is-danger">{error}</p>
                }
            </div>
        </div>
    )
}