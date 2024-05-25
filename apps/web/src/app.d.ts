import type { D1Database, KVNamespace } from '@cloudflare/workers-types/experimental';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        KV_NAMESPACE_RIOT_TOKENS: KVNamespace;
        KV_NAMESPACE_AUTH_CHALLENGES: KVNamespace;
        D1_DB: D1Database;
      };
    }
  }
}
