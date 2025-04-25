// import React from 'react'

// export default function Table() {
//     return (
//     <div className="relative overflow-x-auto">
//     <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
//         <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//             <th scope="col" className="px-6 py-3">
//                 Name
//             </th>
//             <th scope="col" className="px-6 py-3">
//                 Email
//             </th>
//             <th scope="col" className="px-6 py-3">
//                 Client ID
//             </th>
//             <th scope="col" className="px-6 py-3">
//                 Google Screenshot
//             </th>
//             <th scope="col" className="px-6 py-3">
//                 Trustpilot Screenshot
//             </th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
//             <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                 Apple MacBook Pro 17"
//             </th>
//             <td className="px-6 py-4">Silver</td>
//             <td className="px-6 py-4">Laptop</td>
//             <td className="px-6 py-4">$2999</td>
//             <td className="px-6 py-4">$2999</td>
//             </tr>
//             <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
//             <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                 Microsoft Surface Pro
//             </th>
//             <td className="px-6 py-4">White</td>
//             <td className="px-6 py-4">Laptop PC</td>
//             <td className="px-6 py-4">$1999</td>
//             <td className="px-6 py-4">$1999</td>
//             </tr>
//             <tr className="bg-white dark:bg-gray-800">
//             <th scope="row" className="px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                 Magic Mouse 2
//             </th>
//             <td className="px-6 py-4">Black</td>
//             <td className="px-6 py-4">Accessories</td>
//             <td className="px-6 py-4">$99</td>
//             <td className="px-6 py-4">$99</td>
//             </tr>
//         </tbody>
//         </table>
//     </div>
//     )
// }

'use client';

import React from 'react';
import { ReviewRow } from '../types';
import Image from 'next/image';

interface Props {
    data: ReviewRow[];
}

export default function Table({ data }: Props) {
    console.log(data)
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
                                <Image src={item.google_screenshot_url} 
                                    alt="Google image"  
                                    width={100}
                                    height={60}>
                                </Image></td>
                            <td className="px-6 py-4">
                                <Image src={item.trustpilot_screenshot_url} 
                                    alt="Google image"  
                                    width={100}
                                    height={60}>
                                </Image>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
