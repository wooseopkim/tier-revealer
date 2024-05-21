import { writable } from 'svelte/store';

const riotIdToken = writable(undefined as undefined | null | string);

export default riotIdToken;
