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
    ].map(async (x) => (await x).json()),
  );
  const { tier, rank } = entries.filter(
    ({ queueType }: { queueType: string }) => queueType === 'RANKED_TFT',
  )[0];
  const { gameName } = account;
  return {
    tier,
    rank,
    gameName,
  };
}
