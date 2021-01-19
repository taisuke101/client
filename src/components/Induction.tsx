import Link from 'next/link';
import React, { FC } from 'react';

interface InductionProps {
    inductionSentence: string;
    path: string;
    inductionTo: string;
}

const Induction: FC<InductionProps> = ({inductionSentence, path, inductionTo}) => {
    return (
        <small>
            {inductionSentence}
            <Link href={path}>
                <a className="ml-1 text-blue-500">
                    {inductionTo}
                </a>
            </Link>
        </small>
    )
}

export default Induction;
