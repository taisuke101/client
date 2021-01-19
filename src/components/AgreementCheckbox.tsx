import React, { FC } from 'react';

interface AgreementProps {
    className?: string;
    checked: boolean;
    error: string | undefined;
    setValue: (str: boolean) => void;
}

const AgreementCheckbox: FC<AgreementProps> = ({
    className,
    checked,
    error,
    setValue
}) => {
    return (
        <div className={className}>
            <input 
                type="checkbox" 
                className="mr-1 cursor-pointer" 
                id="agreement"
                checked={checked}
                onChange={e => setValue(e.target.checked)}
            />
            <label htmlFor="agreement" className="text-xs">
                利用規約とプライバシーポリシーに同意します
            </label>
            <div className="block text-sm font-medium text-red-600 small">{error}</div>
        </div>
    )
}

export default AgreementCheckbox;
