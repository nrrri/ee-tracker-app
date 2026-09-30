import { getPool } from "@/lib/data";

export async function GET() {
  const pool = await getPool();

  return Response.json({ pool });
}
