import sql from "@/lib/db";
import { createTables } from "@/lib/schema";

function toNum(str: string): number {
  return parseInt(str.replace(/,/g, ""), 10) || 0;
}

export async function GET() {
  // // Cron job
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }

  try {
    // Make sure tables exist
    await createTables();

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${Date.now()}`, {
    //   cache: "no-store",
    // });

    const url = `${process.env.NEXT_PUBLIC_API_URL}${Date.now()}`;
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status}`);
    }

    const json = await res.json();
    const rounds = json.rounds.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) => r.drawName !== "No Program Specified",
    );
    // Save draws
    for (const draw of rounds) {
      await sql`
        INSERT INTO ee_draws (
          draw_number, draw_number_url, draw_date, draw_date_full,
          draw_name, draw_size, draw_crs, mitext, draw_text1, draw_text2,
          draw_date_time, draw_cut_off, draw_distribution_as_on, draw_year
        ) VALUES (
          ${draw.drawNumber},
          ${draw.drawNumberURL},
          ${draw.drawDate},
          ${draw.drawDateFull},
          ${draw.drawName},
          ${toNum(draw.drawSize)},
          ${draw.drawCRS},
          ${draw.mitext},
          ${draw.DrawText1},
          ${draw.drawText2},
          ${draw.drawDateTime},
          ${draw.drawCutOff},
          ${draw.drawDistributionAsOn},
          ${new Date(draw.drawDate).getFullYear()}
        )
        ON CONFLICT (draw_number) DO UPDATE SET
          draw_name    = EXCLUDED.draw_name,
          draw_size    = EXCLUDED.draw_size,
          draw_crs     = EXCLUDED.draw_crs
        RETURNING draw_number
      `;
    }

    // Save candidate pool (deduplicated by drawDistributionAsOn)
    const seen = new Set<string>();
    for (const draw of rounds) {
      if (toNum(draw.dd17) === 0) continue; // filter zero-pool
      if (seen.has(draw.drawDistributionAsOn)) continue; // deduplicate
      seen.add(draw.drawDistributionAsOn);

      await sql`
        INSERT INTO ee_candidate_pool (
          draw_distribution_as_on,
          range601_1200, range501_600, range451_500, range491_500,
          range481_490, range471_480, range461_470, range451_460,
          range401_450, range441_450, range431_440, range421_430,
          range411_420, range401_410, range351_400, range301_350,
          range0_300, total_candidates
        ) VALUES (
          ${draw.drawDistributionAsOn},
          ${toNum(draw.dd1)},  ${toNum(draw.dd2)},  ${toNum(draw.dd3)},
          ${toNum(draw.dd4)},  ${toNum(draw.dd5)},  ${toNum(draw.dd6)},
          ${toNum(draw.dd7)},  ${toNum(draw.dd8)},  ${toNum(draw.dd9)},
          ${toNum(draw.dd10)}, ${toNum(draw.dd11)}, ${toNum(draw.dd12)},
          ${toNum(draw.dd13)}, ${toNum(draw.dd14)}, ${toNum(draw.dd15)},
          ${toNum(draw.dd16)}, ${toNum(draw.dd17)}, ${toNum(draw.dd18)}
        )
        ON CONFLICT (draw_distribution_as_on) DO NOTHING
      `;
    }
    return Response.json({
      success: true,
      inserted: rounds.length,
    });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    return Response.json(
      { success: false, message: String(err) },
      { status: 500 },
    );
  }
}
