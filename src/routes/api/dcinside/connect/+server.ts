import connectDcinsideAccount from '$lib/adapters/cloudflare/d1/connectDcinsideAccount.js';
import getAuthChallenge from '$lib/adapters/cloudflare/kv/getAuthChallenge.js';
import getGallogPosts from '$lib/adapters/dcinside/getGallogPosts.js';
import getRiotIdToken from '$lib/http/getRiotIdToken.js';

export async function POST({ request, platform }) {
  const riotIdToken = getRiotIdToken(request);
  if (riotIdToken === undefined) {
    return new Response('', { status: 401 });
  }
  const { identificationCode: dcinsideIdentificationCode } = await request.json();

  const gallogPosts = await getGallogPosts({ identificationCode: dcinsideIdentificationCode });
  const authChallenge = await getAuthChallenge({
    namespace: platform!.env.KV_NAMESPACE_AUTH_CHALLENGES,
    riotIdToken,
  });
  if (authChallenge === null) {
    return new Response('', { status: 404 });
  }

  const post = gallogPosts.find(
    ({ galleryId, postTitle }) => galleryId === 'lolpet' && postTitle === authChallenge,
  );
  if (post === undefined) {
    return new Response('', { status: 400 });
  }

  await connectDcinsideAccount({
    database: platform!.env.D1_DB,
    riotIdToken,
    dcinsideIdentificationCode,
  });

  return Response.json({});
}
