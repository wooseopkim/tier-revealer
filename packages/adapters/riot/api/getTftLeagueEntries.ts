import cachedFetch from '@tier-revealer/lib/cache/cachedFetch';
import { RIOT_API_KEY } from '@tier-revealer/lib/env/private';

interface Params {
  summonerId: string;
}

export default async function getTftLeagueEntries({ summonerId }: Params) {
  const fetch = cachedFetch(getTftLeagueEntries, { ttl: 300 });
  const res = await fetch(
    `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${encodeURIComponent(summonerId)}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    },
  );
  return res;
}
