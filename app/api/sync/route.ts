import sql from "@/lib/db";
import { createTables } from "@/lib/schema";
import { NextResponse } from "next/server";

function toNum(str: string): number {
  return parseInt(str.replace(/,/g, ""), 10) || 0;
}

function isActiveWeek(torontoTime: Date): boolean {
  const startDate = new Date("2026-04-13T00:00:00");
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceStart = Math.floor(
    (torontoTime.getTime() - startDate.getTime()) / msPerWeek,
  );
  return weeksSinceStart % 2 === 0; // even = active week (Apr 13, Apr 27, May 11...)
}

export async function GET(request: Request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  // Get current Toronto time
  const now = new Date();
  const torontoTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Toronto" }),
  );

  // Don't run before Apr 13 2026
  const startDate = new Date("2026-04-13T00:00:00");
  if (torontoTime < startDate) {
    return Response.json({ ok: false, message: "Not started yet" });
  }

  // Only run on active weeks (every 2 weeks from Apr 13)
  if (!isActiveWeek(torontoTime)) {
    return Response.json({ ok: false, message: "Off week — skipping" });
  }

  // Only run on weekdays (safety net for DST edge cases)
  const day = torontoTime.getDay(); // 0 = Sun, 6 = Sat
  if (day === 0 || day === 6) {
    return Response.json({ ok: false, message: "Weekend — skipping" });
  }

  // Only run between 10am–4pm Toronto time
  const hour = torontoTime.getHours();
  if (hour < 10 || hour >= 16) {
    return Response.json({ ok: false, message: "Outside hours — skipping" });
  }

  try {
    // Make sure tables exist
    await createTables();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${Date.now()}`, {
      cache: "no-store",
    });
    console.log(res);
    const json = await res.json();
    const rounds = json.rounds;

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
    return NextResponse.json({
      success: true,
      message: "Cron execute successfully",
    });
    return Response.json({ ok: true, synced: rounds.length });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Cron Failed",
      },
      {
        status: 500,
      },
    );
  }
}
