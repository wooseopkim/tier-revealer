import cachedFetch from '@tier-revealer/lib/cache/cachedFetch';

interface Params {
  accessToken: string;
}

export default async function getMySummoner({ accessToken }: Params) {
  const fetch = cachedFetch(getMySummoner, { ttl: 600 });
  const res = await fetch('https://kr.api.riotgames.com/tft/summoner/v1/summoners/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
}
