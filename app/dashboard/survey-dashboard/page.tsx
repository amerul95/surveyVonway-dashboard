import React, { Suspense } from 'react';
import { fetchReview } from '@/app/lib/db';
import Table from '@/components/surveyDashboard/Table';

export const dynamic = 'force-dynamic';


export default async function surveyDashboard() {
    const datas = await fetchReview();

    return (
        <div className="p-4">
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <Table data={datas} />
        </Suspense>
        </div>
    );
}
