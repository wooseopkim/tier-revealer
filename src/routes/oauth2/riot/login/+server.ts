import getOauth2Tokens from '$lib/third_parties/riot/api/getOauth2Tokens.js';
import putRiotTokens from '$lib/third_parties/cloudflare/kv/putRiotTokens.js';

export async function GET({ url, platform }) {
  const code = url.searchParams.get('code');

  if (code === null) {
    return new Response('search parameter `code` is required', { status: 400 });
  }

  const res = await getOauth2Tokens({ code });

  if (!res.ok) {
    return new Response(await res.text(), { status: 500 });
  }

  const payload = (await res.json()) as {
    refresh_token: string;
    id_token: string;
    access_token: string;
  };
  await putRiotTokens({
    namespace: platform!.env.KV_NAMESPACE_RIOT_TOKENS,
    payload,
  });

  const params = new URLSearchParams();
  params.set('riot_id_token', payload.id_token);

  return new Response('', { status: 307, headers: { Location: `/?${params.toString()}` } });
}
