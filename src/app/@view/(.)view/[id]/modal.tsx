'use client'

import { useRouter } from 'next/navigation'
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <div className="h-[calc(100vh-64px)] absolute z-40 top-18">
            <div className="z-50 absolute top-0 mt-2 left-8 w-12 h-12 text-white bg-gray-600 rounded-lg p-2 hover:text-cyan-400 hover:p-1">
                <XCircleIcon onClick={() => router.back()} />
            </div>
            <div className="h-full w-full">{children}</div>
        </div>
    )
}