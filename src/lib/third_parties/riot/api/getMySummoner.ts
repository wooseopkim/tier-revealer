interface Params {
  accessToken: string;
}

export default async function getMySummoner({ accessToken }: Params) {
  const res = await fetch('https://kr.api.riotgames.com/tft/summoner/v1/summoners/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
}
