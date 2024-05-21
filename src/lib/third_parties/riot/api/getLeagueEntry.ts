import { RIOT_API_KEY } from '$env/static/private';

interface Params {
  summonerId: string;
}

export default async function getLeagueEntry({ summonerId }: Params) {
  const res = await fetch(
    `https://kr.api.riotgames.com/tft/league/v1/entries/by-summoner/${summonerId}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    },
  );
  return res;
}
