// app/surveyDashboard/page.tsx (or whatever path you're using)

import { fetchReview } from '@/app/lib/db';
import Table from '@/components/surveyDashboard/Table';

export const dynamic = 'force-dynamic'; // 👈 This forces fresh data on each request

export default async function SurveyDashboard() {
  const datas = await fetchReview();

  return (
    <div className="p-4">
      <Table data={datas} />
    </div>
  );
}
