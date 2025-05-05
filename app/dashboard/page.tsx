// app/dashboard/page.tsx
import { getUserCount } from "../lib/user-stats";

export default async function Page() {
    const userCount = await getUserCount();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-lg font-medium text-gray-700 mb-2">Total Users</h2>
                    <p className="text-3xl font-bold text-blue-600">{userCount}</p>
                </div>
            </div>
        </div>
    );
}
