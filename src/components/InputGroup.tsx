import React, { FC } from 'react';
import classNames from 'classnames';

interface InputGroupProps {
    className?: string;
    type: string;
    placeholder: string;
    value: string;
    error: string | undefined;
    setValue: (str: string) => void;
}

const InputGroup: FC<InputGroupProps> = ({
    className,
    type,
    placeholder,
    value,
    error,
    setValue
}) => {
    return (
        <div className={className}>
            <input 
                type={type}
                className={classNames(
                "w-full p-3 py-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white", 
                {"border-red-500": error})}
                placeholder={placeholder}
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <div className="text-sm font-medium text-red-600 small">{error}</div>
        </div>
    )
}

export default InputGroup;
