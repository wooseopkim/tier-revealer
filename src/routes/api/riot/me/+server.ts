import getMe from '$lib/interactors/riot/getMe.js';
import getRiotTokens from '$lib/third_parties/cloudflare/kv/getRiotTokens.js';

export async function GET({ request, platform }) {
  const idToken = request.headers.get('Authorization')?.replace(/^Bearer /, '');

  if (idToken === null || idToken === undefined) {
    return new Response('', { status: 403 });
  }

  const tokens = await getRiotTokens({
    namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
    idToken,
  });

  if (tokens === undefined || tokens === null) {
    return new Response('', { status: 404 });
  }
  const { access_token: accessToken } = JSON.parse(tokens);

  const { tier, rank, gameName } = await getMe({ accessToken });
  return new Response(
    JSON.stringify({
      tier,
      rank,
      gameName,
    }),
  );
}
