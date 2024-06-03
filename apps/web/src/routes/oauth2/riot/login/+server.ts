import authenticate from '@tier-revealer/interactors/riot/authenticate';

export async function GET({ url, platform }) {
  const code = url.searchParams.get('code');

  if (code === null) {
    return new Response('search parameter `code` is required', { status: 400 });
  }

  const result = await authenticate(
    {
      authChallengeNamespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES,
      riotTokensNamespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
      database: platform!.env.D1_DB,
    },
    { code },
  );
  if (result instanceof Error) {
    return Response.json(result, { status: 500 });
  }

  const { idToken, idTokenExpires } = result;

  return new Response('', {
    status: 307,
    headers: {
      Location: '/',
      'Set-Cookie': `riot_id_token=${idToken}; Expires=${idTokenExpires}; Secure; HttpOnly; Path=/`,
    },
  });
}
