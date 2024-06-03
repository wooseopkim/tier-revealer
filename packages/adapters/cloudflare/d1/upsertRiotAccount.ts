import type D1Context from './D1Context';

interface Context extends D1Context {}

interface Params {
  summonerId: string;
  gameName: string;
}

export default async function upsertRiotAccount(
  { database }: Context,
  { summonerId, gameName }: Params,
) {
  const statement = database
    .prepare(
      `
        INSERT INTO riot_accounts(summoner_id, game_name)
        VALUES(?, ?)
        ON CONFLICT(summoner_id) DO UPDATE SET game_name=excluded.game_name;
      `,
    )
    .bind(summonerId, gameName);
  try {
    await statement.run();
  } catch (e: unknown) {
    return e as Error;
  }
}
