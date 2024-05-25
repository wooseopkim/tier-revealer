import getOrCreateAuthChallenge from '@tier-revealer/interactors/getOrCreateAuthChallenge';
import getMe from '@tier-revealer/interactors/riot/getMe';
import getCookieValue from '@tier-revealer/lib/http/getCookieValue';

export async function load({ request, platform }) {
  const riotIdToken = getCookieValue(request, 'riot_id_token');
  if (riotIdToken === undefined) {
    return;
  }

  const authChallenge = await getOrCreateAuthChallenge({
    context: {
      namespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES,
    },
    riotIdToken,
  });

  try {
    const me = await getMe({
      context: {
        namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
        database: platform!.env.D1_DB,
      },
      riotIdToken,
    });
    if (me === null) {
      return;
    }
    const { riotIdentity, connections } = me;
    return {
      riotIdentity,
      authChallenge,
      connections,
    };
  } catch {
    return;
  }
}