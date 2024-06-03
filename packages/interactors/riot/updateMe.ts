import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import upsertRiotAccount from '@tier-revealer/adapters/cloudflare/d1/upsertRiotAccount';
import upsertRiotLeagueEntries from '@tier-revealer/adapters/cloudflare/d1/upsertRiotLeagueEntries';
import getMyAccount from '@tier-revealer/adapters/riot/api/getMyAccount';
import getMyTftSummoner from '@tier-revealer/adapters/riot/api/getMyTftSummoner';
import getTftLeagueEntries from '@tier-revealer/adapters/riot/api/getTftLeagueEntries';
import type BaseError from '@tier-revealer/lib/models/BaseError';
import BaseHttpError from '@tier-revealer/lib/models/BaseHttpError';
import type RiotAccount from '@tier-revealer/lib/models/riot/RiotAccount';
import type RiotLeagueEntry from '@tier-revealer/lib/models/riot/RiotLeagueEntry';

interface Context extends D1Context {}

interface Params {
  accessToken: string;
}

export default async function updateMe(context: Context, { accessToken }: Params) {
  const res = await getMyTftSummoner({ accessToken });
  const { id: summonerId } = await res.json();

  const riotApiCalls = Promise.all(
    [getTftLeagueEntries({ summonerId }), getMyAccount({ accessToken })].map(async (x) => {
      const res = await x;
      if (res.status !== 200) {
        return ApiError.from(res);
      }
      return res.json();
    }),
  );
  const riotResponses = (await riotApiCalls) as [RiotLeagueEntry[] | Error, RiotAccount | Error];
  const riotError = riotResponses.find((x) => x instanceof Error);
  if (riotError instanceof Error) {
    return riotError;
  }

  const [entries, account] = riotResponses as [RiotLeagueEntry[], RiotAccount];
  const { gameName } = account;
  const tftLeagueEntries = entries.map(({ tier, rank, queueType, leaguePoints }) => ({
    tier,
    rank,
    queueType,
    leaguePoints,
  }));

  const databaseOperations = [
    upsertRiotAccount(context, { summonerId, gameName }),
    ...(await upsertRiotLeagueEntries(context, {
      summonerId,
      game: 'tft',
      leagueEntries: tftLeagueEntries,
    })),
  ];

  const databaseResults = await Promise.all(databaseOperations);
  const databaseError = databaseResults.find((x) => x instanceof Error);
  if (databaseError instanceof Error) {
    return new DatabaseError(databaseError);
  }

  return {
    account: {
      gameName,
    },
    leagueEntries: {
      tft: tftLeagueEntries,
    },
  };
}

class ApiError extends BaseHttpError {
  static async from(res: Response) {
    return await BaseHttpError.from(res, 'RIOT_API_ERROR');
  }
}

class DatabaseError extends Error implements BaseError {
  code = 'DATABASE_ERROR';
  message: string;

  constructor(cause: Error) {
    super();
    this.message = cause.message;
  }
}
