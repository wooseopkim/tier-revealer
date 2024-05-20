import type { KVNamespace } from '@cloudflare/workers-types/experimental';

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
      };
    }
  }
}

export {};
