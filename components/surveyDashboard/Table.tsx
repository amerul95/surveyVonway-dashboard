'use client';

import React from 'react';
import { ReviewRow } from '../types';
import ZoomableImage from '../zoom-image/ZoomableImage';
import timestamps from '@/app/lib/timestamps';

interface Props {
    data: ReviewRow[];
}

export default function Table({ data }: Props) {
    // console.log(data)
    return (
        <div className="relative overflow-x-auto">
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
                    {data.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{index + 1}</td>
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
        </div>
    );
}
