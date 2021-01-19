import React, { FC } from 'react'

interface ButtonProps {
    children: string;
}

const Button: FC<ButtonProps> = ({children}) => {
    return (
        <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
            {children}
        </button>
    )
}

export default Button;
