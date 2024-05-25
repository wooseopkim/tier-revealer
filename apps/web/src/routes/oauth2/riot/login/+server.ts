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
    },
    { code },
  );
  if (result instanceof Error) {
    const { response } = result;
    return Response.json(
      {
        code: 'OAUTH2_FAILED',
        message: 'Riot OAuth2 authentication failed',
        original: await response.json(),
      },
      { status: response.status },
    );
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
