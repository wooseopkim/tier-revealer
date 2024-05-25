import { RIOT_API_KEY } from '$env/static/private';
import cachedFetch from '$lib/cache/cachedFetch';

interface Params {
  summonerId: string;
}

export default async function getLeagueEntry({ summonerId }: Params) {
  const fetch = cachedFetch(getLeagueEntry, { ttl: 300 });
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
