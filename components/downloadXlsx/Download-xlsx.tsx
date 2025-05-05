'use client';

import React, { useTransition } from 'react';
import { exportExcel } from '@/app/lib/xlsx';

interface Props {
    data: any[]; // or ExtendedReviewRow[]
    selectedOnly?: boolean;
    selectedDate: any;
}

export default function DownloadButton({ data, selectedDate, selectedOnly = false }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleDownload = () => {
        startTransition(async () => {
            const base64 = await exportExcel(data, selectedOnly, selectedDate);

            // Convert base64 to binary
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }

            const blob = new Blob([bytes], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `reviews_${Date.now()}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            {isPending ? 'Generating...' : 'Download Excel'}
        </button>
    );
}
