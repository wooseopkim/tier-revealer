import type RiotLeagueEntry from '@tier-revealer/lib/models/riot/RiotLeagueEntry';
import type D1Context from './D1Context';

interface Context extends D1Context {}

interface Params {
  summonerId: string;
  game: string;
  leagueEntries: RiotLeagueEntry[];
}

export default async function upsertRiotAccount(
  { database }: Context,
  { summonerId, game, leagueEntries }: Params,
) {
  const statements = leagueEntries.map(({ tier, rank, queueType, leaguePoints }) => {
    return database
      .prepare(
        `
          INSERT INTO riot_league_entries(summoner_id, game, queue_type, tier, rank, league_points)
          VALUES(?, ?, ?, ?, ?, ?)
          ON CONFLICT(summoner_id, game, queue_type)
          DO UPDATE SET tier=excluded.tier, rank=excluded.rank, league_points=excluded.league_points;
        `,
      )
      .bind(summonerId, game, queueType, tier, rank, leaguePoints);
  });
  return statements.map(async (x) => {
    try {
      return await x.run();
    } catch (e: unknown) {
      return e as Error;
    }
  });
}
