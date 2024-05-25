import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import getAccountConnections from '@tier-revealer/adapters/cloudflare/d1/getAccountConnections';
import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getRiotTokens from '@tier-revealer/adapters/cloudflare/kv/getRiotTokens';
import getLeagueEntry from '@tier-revealer/adapters/riot/api/getLeagueEntry';
import getMyAccount from '@tier-revealer/adapters/riot/api/getMyAccount';
import getMySummoner from '@tier-revealer/adapters/riot/api/getMySummoner';
import verifyToken from './verifyToken';

interface Params {
  context: KVContext & D1Context;
  riotIdToken: string;
}

export default async function getMe({ context, riotIdToken }: Params) {
  const { payload: claims } = await verifyToken({ token: riotIdToken });
  const riotSub = claims.sub!;

  const tokens = await getRiotTokens(context, { riotSub });
  if (tokens === null) {
    return null;
  }
  const { accessToken } = tokens;

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

  const { results } = await getAccountConnections(context, { riotSub });

  return {
    riotIdentity: {
      tier,
      rank,
      gameName,
    } as Record<string, string>,
    connections: results,
  };
}
