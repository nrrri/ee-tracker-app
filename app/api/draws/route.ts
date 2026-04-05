import sql from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM ee_draws ORDER BY draw_date DESC`;

  const draws = rows.map((r) => ({
    drawNumber: r.draw_number,
    drawNumberURL: r.draw_number_url,
    drawDate: r.draw_date,
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

  return Response.json({ draws });
}
