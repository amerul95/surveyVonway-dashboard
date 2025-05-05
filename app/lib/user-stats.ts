// lib/user-stats.ts
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export async function getUserCount(): Promise<number> {
    try {
        const result = await sql`SELECT COUNT(*) FROM reviews`; // Change `reviews` to `users` if needed
        const count = Number(result[0].count);
        return count;
    } catch (error) {
        console.error('Failed to fetch user count:', error);
        return 0;
    }
}
