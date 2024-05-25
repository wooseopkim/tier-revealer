import { writable } from 'svelte/store';

const riotIdentity = writable<undefined | null | Record<string, string>>(undefined);

export default riotIdentity;
