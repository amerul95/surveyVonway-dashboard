'use client';

import React, { useState } from 'react';
import { ReviewRow } from '../types';
import ZoomableImage from '../zoom-image/ZoomableImage';
import timestamps from '@/app/lib/timestamps';
import DownloadButton from '../downloadXlsx/Download-xlsx';
import Calendar from '../calendar/Calendar';
import SearchBar from '../searchBar/Search-bar';

interface Props {
    data: ReviewRow[];
}

export default function Table({ data }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(10);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    // search placeholder
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.name.toLowerCase().includes(query) ||
            item.email.toLowerCase().includes(query) ||
            item.client_id.toLowerCase().includes(query)
        );
    });

    const ROWS_PER_PAGE = rowPerPage;

    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );    

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const handleRowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowPerPage(Number(e.target.value));
        setCurrentPage(1);
    }

    return (
        <div className="relative overflow-x-auto">
            {/* Controls Group */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
                
                {/* Date Picker */}
                <div className="flex flex-col gap-2">
                    <Calendar startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />

                    <DownloadButton data={data} startDate={startDate} endDate={endDate} />
                </div>

                {/* Search Bar */}
                <div className="flex flex-col">
                    <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                </div>

                {/* Row Selector */}
                <div className="flex flex-col">
                    <label htmlFor="row-select" className="text-sm font-medium text-gray-700 mb-1">Rows per page</label>
                    <select
                        id="row-select"
                        onChange={handleRowChange}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>
            
            {/* Table Group */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">No</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Client ID</th>
                        <th className="px-6 py-3">Google Screenshot</th>
                        <th className="px-6 py-3">Trustpilot Screenshot</th>
                        <th className="px-6 py-3">Submitted Time</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.client_id}</td>
                            <td className="px-6 py-4">
                                <ZoomableImage
                                    src={item.google_screenshot_url}
                                    alt="Google Screenshot"
                                    width={100}
                                    height={60}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <ZoomableImage
                                    src={item.trustpilot_screenshot_url}
                                    alt="Trustpilot Screenshot"
                                    width={100}
                                    height={60}
                                />
                            </td>
                            <td className="px-6 py-4">{timestamps(item.submitted_at)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 px-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
