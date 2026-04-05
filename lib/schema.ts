import sql from "./db";

export async function createTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS ee_draws (
      draw_number           TEXT PRIMARY KEY,
      draw_number_url       TEXT,
      draw_date             DATE,
      draw_date_full        TEXT,
      draw_name             TEXT,
      draw_size             INT,
      draw_crs              TEXT,
      mitext                TEXT,
      draw_text1            TEXT,
      draw_text2            TEXT,
      draw_date_time        TEXT,
      draw_cut_off          TEXT,
      draw_distribution_as_on TEXT,
      draw_year             INT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS ee_candidate_pool (
      draw_distribution_as_on TEXT PRIMARY KEY,
      range601_1200   INT,
      range501_600    INT,
      range451_500    INT,
      range491_500    INT,
      range481_490    INT,
      range471_480    INT,
      range461_470    INT,
      range451_460    INT,
      range401_450    INT,
      range441_450    INT,
      range431_440    INT,
      range421_430    INT,
      range411_420    INT,
      range401_410    INT,
      range351_400    INT,
      range301_350    INT,
      range0_300      INT,
      total_candidates INT
    )
  `;
}
