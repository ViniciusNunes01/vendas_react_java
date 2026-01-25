import { formatReal } from "@/app/util/money/intex";
import * as IMask from "imask";
import { InputHTMLAttributes, useEffect } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    columnClasses?: string;
    error?: string;
    formatter?: (value: string) => string;
}

export const Input: React.FC<InputProps> = ({
    label,
    columnClasses,
    id,
    error,
    formatter,
    onChange,
    ...inputProps
}: InputProps) => {

    const onInputChange = (e: any) => {

        const value = e.target.value;
        const name = e.target.name;

        const formattedValue = (formatter && formatter(value as string)) || value;


        if (onChange) {

            onChange({
                ...e,
                target: {
                    name,
                    value: formattedValue
                }
            })
        }
    }

    return (
        <div className={`field column ${columnClasses}`}>
            <label className="label" htmlFor={id}>{label}</label>
            <div className="control">
                <input
                    id={id}
                    className="input"
                    onChange={onInputChange}
                    {...inputProps}
                />
                {error &&
                    <p className="help is-danger">{error}</p>
                }
            </div>
        </div>
    )
}

export const InputMoney: React.FC<InputProps> = (props: InputProps) => {
    return (
        <Input {...props} formatter={formatReal} />
    )
}

export const InputCPF: React.FC<InputProps> = (props: InputProps) => {

    const { id } = props;

    useEffect(() => {

        const input = document.getElementById(id) as HTMLInputElement | null;
        if (!input) return;

        const mask = IMask.default(input, {
            mask: "000.000.000-00",
        });

        return () => {
            mask.destroy();
        };
    }, [id]);

    return (
        <Input {...props} />
    )
}

export const InputDate: React.FC<InputProps> = (props: InputProps) => {
    const { id } = props;

    useEffect(() => {
        const input = document.getElementById(id) as HTMLInputElement | null;
        if (!input) return;

        const mask = IMask.default(input, {
            mask: "00/00/0000",
        });

        return () => {
            mask.destroy();
        };
    }, [id]);

    return <Input {...props} />;
};

export const InputPhone: React.FC<InputProps> = (props: InputProps) => {
    
    const { id } = props;

    useEffect(() => {
        const input = document.getElementById(id) as HTMLInputElement | null;
        if (!input) return;

        const mask = IMask.default(input, {
            mask: [
                {
                    mask: "(00) 0000-0000", // fixo
                },
                {
                    mask: "(00) 00000-0000", // celular
                },
            ],
        });

        return () => {
            mask.destroy();
        };
    }, [id]);

    return <Input {...props} />;
};