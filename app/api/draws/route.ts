import { getDraws } from "@/lib/data";

export async function GET() {
  const draws = await getDraws();

  return Response.json({ draws });
}
