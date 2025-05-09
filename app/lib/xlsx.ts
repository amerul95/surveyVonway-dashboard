'use server';

import ExcelJS from 'exceljs';
import { ReviewRow } from '@/components/types';

type ExtendedReviewRow = ReviewRow & {
  selected?: boolean;
  downloaded?: boolean;
};

export async function exportExcel(
  data: ExtendedReviewRow[],
  selectedOnly: boolean,
  startDate: Date | null,
  endDate: Date | null
) {
  let filteredData = selectedOnly ? data.filter(d => d.selected) : data;

  // Filter by selected date
  if (startDate && endDate) {
    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    filteredData = filteredData.filter(row => {
      const submittedDate = new Date(row.submitted_at).getTime();
      return submittedDate >= startDate.getTime() && submittedDate <= endOfDay.getTime();
    });
  }

  // Filter out already downloaded entries
  const newData = filteredData.filter(row => !row.downloaded);

  if (newData.length === 0) return null;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add header row from object keys
  worksheet.columns = Object.keys(newData[0]).map(key => ({
    header: key,
    key,
    width: 20,
  }));

  // Add rows
  newData.forEach(row => {
    worksheet.addRow(row);
  });

  // Simulate marking entries as downloaded
  newData.forEach(row => {
    row.downloaded = true;
  });

  // Write to buffer and return base64
  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString('base64');

  return base64;
}
