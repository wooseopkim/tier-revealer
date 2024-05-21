interface Params {
  accessToken: string;
}

export default async function getMyAccount({ accessToken }: Params) {
  const res = await fetch('https://asia.api.riotgames.com/riot/account/v1/accounts/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res;
}
