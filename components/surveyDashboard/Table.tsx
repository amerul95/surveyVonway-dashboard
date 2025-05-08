'use client';

import React, { useState } from 'react';
import { ReviewRow } from '../types';
import ZoomableImage from '../zoom-image/ZoomableImage';
import timestamps from '@/app/lib/timestamps';
import DownloadButton from '../downloadXlsx/Download-xlsx';
import Calendar from '../calendar/Calendar';
import rejected from '@/app/lib/rejected';
import approved from '@/app/lib/approved';
import Loader from '../loader/Loader';
import actionFormStatus from '@/app/lib/actionformstatus';
import { useRouter } from 'next/navigation';
import Search from '../search/Search';
import { filterData } from '@/app/lib/filterdata';
import { useSearchParams } from 'next/navigation';

interface Props {
    data: ReviewRow[];
}

export default function Table({ data }: Props) {

    const router = useRouter()
    const [loader, setLoader] = useState<{ [clientId: string]: any}>({});
    const [loadingButtons, setLoadingButtons] = useState<{ [id:number]: 'approve' | 'reject' | 'not checked' | null }>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowPerPage, setRowPerPage] = useState(10);

    // mass update 
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    // Start with the incoming data
    const [tableData, setTableData] = useState<ReviewRow[]>(data);

    // startDate and endDate
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // const [dropdownOpen, setDropdownOpen] = useState(false);

    // search placeholder
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('query')?.toLowerCase() || '';
    const [statusFilter, setStatusFilter] = useState<'all' | 'not checked' | 'approved' | 'rejected'>('all'); 

    const filteredData = filterData(tableData, searchQuery, statusFilter);

    const [selectValue, setSelectValue] = useState('');

    // date change
    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    // const filteredData = tableData.filter((item) => {
    //     const query = searchQuery.toLowerCase();
    //     const matchesSearch =
    //         item.name.toLowerCase().includes(query) ||
    //         item.email.toLowerCase().includes(query) ||
    //         item.client_id.toLowerCase().includes(query);

    //     const matchesStatus =
    //         statusFilter === 'all' || item.form_status === statusFilter;

    //     return matchesSearch && matchesStatus;
    // });

    // change paginationn
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
    };

    // mass update
    const toggleSelection = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleStatusUpdate = async (
        row: ReviewRow,
        status: 'approved' | 'rejected' | 'not checked'
    ) => {

        const statusToLoaderType = (status: 'approved' | 'rejected' | 'not checked'): 'approve' | 'reject' | 'not checked' => {
            if (status === 'approved') return 'approve';
            if (status === 'rejected') return 'reject';
            return 'not checked';
        };

        // Determine whether this is mass update or single
        const rowsToUpdate = selectedRows.length > 0 ? selectedRows : [row.id];
        const loaderType = statusToLoaderType(status);

        // Set loading state for each affected row
        setLoadingButtons(prev => {
            const updated = { ...prev };
            rowsToUpdate.forEach(id => {
                updated[id] = loaderType;
            });
            return updated;
        });

        for (const id of rowsToUpdate) {
            const currentRow = tableData.find(item => item.id === id);
            if (!currentRow) continue; 
            
            try {
                const updatedRow = await actionFormStatus(id, status);

                if (status === 'approved') {
                    await approved({
                        name: currentRow.name,
                        email: currentRow.email,
                        clientId: currentRow.client_id,
                    });
                } else if (status === 'rejected') {
                    await rejected({
                        name: currentRow.name,
                        email: currentRow.email,
                        clientId: currentRow.client_id,
                    });
                }

                setTableData(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, form_status: updatedRow.form_status } : item
                    )
                );
            } catch (error) {
                console.error(`Approval failed ${id}:`, error);
            } 
        }
        setLoadingButtons(prev => {
            const updated = { ...prev };
            rowsToUpdate.forEach(id => {
                updated[id] = null;
            });
            return updated;
        });
        
        if (selectedRows.length > 0) {
            setSelectedRows([]);
        }
    };

    // const handleSelectAll = () => {
    //     const allIds = filteredData.map(item => item.id);
    //     const allSelected = allIds.every(id => selectedRows.includes(id));
    //     setSelectedRows(prev => allSelected ? prev.filter(id => !allIds.includes(id)) : [...new Set([...prev, ...allIds])]);
    // };
    
    // const handleSelectByStatus = (status: 'approved' | 'rejected' | 'not checked') => {
    //     const ids = filteredData
    //         .filter(item => item.form_status === status)
    //         .map(item => item.id);
        
    //         const allSelected = ids.length > 0 && ids.every(id => selectedRows.includes(id));
        
    //         if (allSelected) {
    //         // Deselect that status group only
    //             setSelectedRows(prev => prev.filter(id => !ids.includes(id)));
    //         } else {
    //             setSelectedRows(ids);
    //         }
    // };

    // const selectByStatus = (status: 'approved' | 'rejected' | 'not checked') => {
    //     const ids = filteredData
    //     .filter(row => row.form_status === status)
    //     .map(row => row.id);
    //     setSelectedRows(ids);
    // };
    
    // const selectAllFiltered = () => {
    //     const allIds = filteredData.map(row => row.id);
    //     setSelectedRows(allIds);
    // };

    // approval button
    // const handleApprove = async (row: ReviewRow) => {
    //     setLoadingButtons(prev => ({ ...prev, [row.id]: 'approve'}));
    //     try {
    //         const updatedRow = await actionFormStatus(row.id, 'approved');
    //         await approved({ //new
    //             name: row.name,
    //             email: row.email,
    //             clientId: row.client_id,
    //         });

    //         if (updatedRow) {
    //             setTableData(prev =>
    //                 prev.map(item =>
    //                     item.id === row.id ? { ...item, form_status: updatedRow.form_status } : item
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Approval failed:", error);
    //     } finally {
    //         setLoadingButtons(prev => ({ ...prev, [row.id]: null}));
    //     }
    // };

    // reject button
    // const handleReject = async (row: ReviewRow) => {
    //     setLoadingButtons(prev => ({ ...prev, [row.id]: 'reject' }));
    //     try {
    //         const updatedRow = await actionFormStatus(row.id, 'rejected');
    //         await rejected ({
    //             name: row.name,
    //             email: row.email,
    //             clientId: row.client_id,
    //         });

    //         if (updatedRow) {
    //             setTableData(prev =>
    //                 prev.map(item =>
    //                     item.id === row.id ? { ...item, form_status: updatedRow.form_status } : item
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Rejection failed:", error);
    //     } finally {
    //         setLoadingButtons(prev => ({ ...prev, [row.id]: null}));
    //     }
    // };

    // not checked button
    // const handleNotChecked = async (row: ReviewRow) => {
    //     setLoadingButtons(prev => ({ ...prev, [row.id]: 'not checked' }));
    //     try {
    //         const updatedRow = await actionFormStatus(row.id, 'not checked');

    //         if (updatedRow) {
    //             setTableData(prev =>
    //                 prev.map(item =>
    //                     item.id === row.id ? { ...item, form_status: updatedRow.form_status } : item
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Not checked failed:", error);
    //     } finally {
    //         setLoadingButtons(prev => ({ ...prev, [row.id]: null}));
    //     }
    // };

    return (
        <div className="relative overflow-visible z-10">
            {/* Controls Group */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
                
                {/* Date + Download */}
                <div className="flex flex-col gap-2">
                    <Calendar startDate={startDate} endDate={endDate} onDateChange={handleDateChange} />
                    <DownloadButton data={data} startDate={startDate} endDate={endDate} />
                </div>

                {/* Search Bar */}
                <div className="flex flex-col">
                    <Search placeholder='search'/>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col">
                    <label htmlFor="status-select" className="text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                        id="status-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All</option>
                        <option value="not checked">Not Checked</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
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
                        <th className="px-6 py-3 ">No</th>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Email</th>
                        <th className="px-6 py-3">Client ID</th>
                        <th className="px-6 py-3">Google Screenshot</th>
                        <th className="px-6 py-3">Trustpilot Screenshot</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Submitted Time</th>
                        <th className="px-6 py-3 text-center">Action</th>
                        <th className="px-6 py-3">
                            <label htmlFor="bulk-select" className="text-xs font-medium mb-1 block">
                                Select Options
                            </label>
                            <select
                                id="bulk-select"
                                className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectValue}
                                onChange={(e) => {
                                const value = e.target.value;
                                setSelectValue(value);

                                if (value === 'selectAll') {
                                    const allIds = filteredData.map(row => row.id);
                                    setSelectedRows(allIds);
                                } else if (value === 'approved' || value === 'rejected' || value === 'not checked') {
                                    const ids = filteredData
                                    .filter(row => row.form_status === value)
                                    .map(row => row.id);
                                    setSelectedRows(ids);
                                } else if (value === 'untick') {
                                    setSelectedRows([]);
                                }
                                }}
                            >
                                <option value="">-- Select --</option>
                                <option value="selectAll">Select All</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="not checked">Not Checked</option>
                                <option value="untick">Untick All</option>
                            </select>
                        </th>
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
                            <td className="px-6 py-4">
                                {item.form_status}
                            </td>
                            <td className="px-6 py-4">{timestamps(item.submitted_at)}</td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center items-center gap-2 h-full">
                                    <button
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                        onClick={() => handleStatusUpdate(item, 'approved')}
                                    >
                                        {loadingButtons[item.id] === 'approve' ? <Loader /> : <p>Approve</p>}
                                    </button>
                                    
                                    <button
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={() => handleStatusUpdate(item, 'rejected')}
                                    >
                                        {loadingButtons[item.id] === 'reject' ? <Loader /> : <p>Reject</p>}
                                    </button>

                                    <button
                                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                                        onClick={() => handleStatusUpdate(item, 'not checked')}
                                    >
                                        {loadingButtons[item.id] === 'not checked' ? <Loader /> : <p>Not Checked</p>}
                                    </button>
                                </div>
                            </td>
                            <td className="px-10 py-4">
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    onChange={() => toggleSelection(item.id)}
                                />
                            </td>
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
