import React from 'react'
import Table from '@/components/surveyDashboard/Table'
import { fetchReview } from '@/app/lib/db'

async function surveyDashboard() {
    const datas = await fetchReview ()
    console.log (datas) 
    return (
        < Table data={datas}/>
    )
}

export default surveyDashboard