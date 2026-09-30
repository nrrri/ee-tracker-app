import { getDraws, getPool } from "@/lib/data";
import Dashboard from "./Dashboard";

// Data only changes when /api/sync runs (which revalidates "/"), so serve a cached
// page and refresh it at most hourly as a fallback.
export const revalidate = 3600;

export default async function Home() {
  const [drawData, poolData] = await Promise.all([getDraws(), getPool()]);

  return <Dashboard drawData={drawData} poolData={poolData} />;
}
