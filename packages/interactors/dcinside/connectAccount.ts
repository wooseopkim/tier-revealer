import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import connectDcinsideAccount from '@tier-revealer/adapters/cloudflare/d1/connectDcinsideAccount';
import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/getAuthChallenge';
import getGallogPosts from '@tier-revealer/adapters/dcinside/getGallogPosts';
import verifyToken from '../riot/verifyToken';

interface Params {
  riotIdToken: string;
  identificationCode: string;
}

export default async function connectAccount(
  context: KVContext & D1Context,
  { riotIdToken, identificationCode }: Params,
) {
  const { payload: claims } = await verifyToken({ token: riotIdToken });
  const riotSub = claims.sub!;

  const authChallenge = await getAuthChallenge(context, {
    riotSub,
  });
  if (authChallenge === null) {
    return new AuthChallengeNotFoundError();
  }
  const gallogPosts = await getGallogPosts({ identificationCode });

  const post = gallogPosts.find(
    ({ galleryId, postTitle }) => galleryId === 'lolpet' && postTitle === authChallenge,
  );
  if (post === undefined) {
    return new PostNotFoundError();
  }

  await connectDcinsideAccount(context, {
    riotSub,
    dcinsideIdentificationCode: identificationCode,
  });
}

class AuthChallengeNotFoundError extends Error {
  code = 'AUTH_CHALLENGE_NOT_FOUND';
  message = 'auth challenge not found';
}

class PostNotFoundError extends Error {
  code = 'POST_NOT_FOUND';
  message = 'DCInside authentication post not found';
}
