import sql from "@/lib/db";
import { InvitationData, PoolData } from "@/app/type/Type";

// DATE columns come back as Date objects; keep them as ISO strings like the JSON API did
const toDateString = (value: unknown) =>
  value instanceof Date ? value.toISOString() : (value as string);

export async function getDraws(): Promise<InvitationData[]> {
  const rows = await sql`SELECT * FROM ee_draws ORDER BY draw_date DESC`;

  return rows.map((r) => ({
    drawNumber: r.draw_number,
    drawNumberURL: r.draw_number_url,
    drawDate: toDateString(r.draw_date),
    drawDateFull: r.draw_date_full,
    drawName: r.draw_name,
    drawSize: r.draw_size, // already a number
    drawCRS: r.draw_crs,
    mitext: r.mitext,
    DrawText1: r.draw_text1,
    drawText2: r.draw_text2,
    drawDateTime: r.draw_date_time,
    drawCutOff: r.draw_cut_off,
    drawDistributionAsOn: r.draw_distribution_as_on,
    drawYear: r.draw_year,
  }));
}

export async function getPool(): Promise<PoolData[]> {
  const rows =
    await sql`SELECT * FROM ee_candidate_pool ORDER BY draw_distribution_as_on::date DESC`;

  return rows.map((r) => ({
    drawDistributionAsOn: r.draw_distribution_as_on,
    range601_1200: r.range601_1200,
    range501_600: r.range501_600,
    range451_500: r.range451_500,
    range491_500: r.range491_500,
    range481_490: r.range481_490,
    range471_480: r.range471_480,
    range461_470: r.range461_470,
    range451_460: r.range451_460,
    range401_450: r.range401_450,
    range441_450: r.range441_450,
    range431_440: r.range431_440,
    range421_430: r.range421_430,
    range411_420: r.range411_420,
    range401_410: r.range401_410,
    range351_400: r.range351_400,
    range301_350: r.range301_350,
    range0_300: r.range0_300,
    totalCandidates: r.total_candidates,
  }));
}
