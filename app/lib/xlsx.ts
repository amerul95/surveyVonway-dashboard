'use server';

import * as XLSX from 'xlsx';
import { ReviewRow } from '@/components/types';

type ExtendedReviewRow = ReviewRow & {
    selected?: boolean;
    downloaded?: boolean;
};

export async function exportExcel(
    data: ExtendedReviewRow[],
    selectedOnly: boolean,
    selectedDate: Date | null
) {
    let filteredData = selectedOnly ? data.filter(d => d.selected) : data;

    // Filter by selected date
    if (selectedDate) {
        const selectedDateStr = selectedDate.toISOString().split("T")[0];
        filteredData = filteredData.filter(row => {
            const submittedDateStr = new Date(row.submitted_at).toISOString().split("T")[0];
            return submittedDateStr === selectedDateStr;
        });
    }

    // Filter out already downloaded entries
    const newData = filteredData.filter(row => !row.downloaded);

    if (newData.length === 0) return null;

    const worksheet = XLSX.utils.json_to_sheet(newData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const base64 = XLSX.write(workbook, {
        type: 'base64',
        bookType: 'xlsx',
    });

    // Simulate marking entries as downloaded (replace this with DB update in real apps)
    newData.forEach(row => {
        row.downloaded = true;
    });

    return base64;
}

