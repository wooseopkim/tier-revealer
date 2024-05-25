import getAccountConnections from '$lib/adapters/cloudflare/d1/getAccountConnections.js';
import getRiotTokens from '$lib/adapters/cloudflare/kv/getRiotTokens.js';
import getRiotIdToken from '$lib/http/getRiotIdToken.js';
import getAuthChallenge from '$lib/interactors/getAuthChallenge.js';
import getMe from '$lib/interactors/riot/getMe.js';

export async function load({ request, platform }) {
  const riotIdToken = getRiotIdToken(request);
  if (riotIdToken === undefined) {
    return;
  }

  const tokens = await getRiotTokens({
    namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
    idToken: riotIdToken,
  });
  if (!tokens) {
    return new Response('', { status: 404 });
  }

  const { access_token: accessToken } = JSON.parse(tokens);
  const authChallenge = await getAuthChallenge({
    namespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES,
    riotIdToken,
  });

  const { results: connections } = await getAccountConnections({
    database: platform!.env.D1_DB,
    riotIdToken,
  });

  try {
    const { tier, rank, gameName } = await getMe({ accessToken });
    const riotIdentity: Record<string, string> = {
      tier,
      rank,
      gameName,
    };
    return {
      riotIdentity,
      authChallenge,
      connections,
    };
  } catch {
    return;
  }
}
