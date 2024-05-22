import getLeagueEntry from '$lib/third_parties/riot/api/getLeagueEntry';
import getMyAccount from '$lib/third_parties/riot/api/getMyAccount';
import getMySummoner from '$lib/third_parties/riot/api/getMySummoner';

interface Params {
  accessToken: string;
}

export default async function getMe({ accessToken }: Params) {
  const [entries, account] = await Promise.all(
    [
      getMySummoner({ accessToken })
        .then((x) => x.json())
        .then(({ id: summonerId }) => getLeagueEntry({ summonerId })),
      getMyAccount({ accessToken }),
    ].map(async (x) => {
      const res = await x;
      if (res.status !== 200) {
        throw new Error(`${res.url}:${res.status}`);
      }
      return res.json();
    }),
  );
  const { tier, rank } = entries.find(
    ({ queueType }: { queueType: string }) => queueType === 'RANKED_TFT',
  );
  const { gameName } = account;
  return {
    tier,
    rank,
    gameName,
  };
}