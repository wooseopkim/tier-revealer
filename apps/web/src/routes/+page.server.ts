import getOrCreateAuthChallenge from '@tier-revealer/interactors/getOrCreateAuthChallenge';
import verifyAndUpdateMe from '@tier-revealer/interactors/riot/verifyAndUpdateMe';
import getCookieValue from '@tier-revealer/lib/http/getCookieValue';

export async function load({ request, platform }) {
  const riotIdToken = getCookieValue(request, 'riot_id_token');
  if (riotIdToken === undefined) {
    return;
  }

  const me = await verifyAndUpdateMe(
    {
      namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
      database: platform!.env.D1_DB,
    },
    { idToken: riotIdToken },
  );
  if (me instanceof Error) {
    console.error(me);
    return;
  }

  const authChallenge = await getOrCreateAuthChallenge(
    { namespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES },
    { riotIdToken },
  );
  if (authChallenge instanceof Error) {
    return {
      riotData: me,
    };
  }

  return {
    riotData: me,
    authChallenge,
  };
}
