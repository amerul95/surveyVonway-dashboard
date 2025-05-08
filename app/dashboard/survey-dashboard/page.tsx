import React from 'react'
import Table from '@/components/surveyDashboard/Table'
import { fetchReview } from '@/app/lib/db'
import { Suspense } from 'react';
import Search from '@/components/search/Search';

async function surveyDashboard(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
    }>;
}) {
    const datas = await fetchReview ()

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    return (
        <> 
        < Table data={datas}/>
        </>

    )
}

export default surveyDashboard