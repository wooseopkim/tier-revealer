import getRiotTokens from '$lib/adapters/cloudflare/kv/getRiotTokens.js';
import getMe from '$lib/interactors/riot/getMe.js';

export async function load({ request, platform }) {
  const cookie = request.headers.get('Cookie');
  if (cookie === null) {
    return;
  }

  const riotIdToken = cookie
    .split('; ')
    .map((kv) => kv.split('=') as [string, string])
    .find(([k]) => k === 'riot_id_token')?.[1];
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

  try {
    const { tier, rank, gameName } = await getMe({ accessToken });
    const riotIdentity: Record<string, string> = {
      tier,
      rank,
      gameName,
    };
    return {
      riotIdentity,
    };
  } catch {
    return;
  }
}
