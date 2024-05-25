import { type KVNamespace } from '@cloudflare/workers-types';

export type KVContext<Key extends string = 'namespace'> = {
  [key in Key]: KVNamespace;
};
