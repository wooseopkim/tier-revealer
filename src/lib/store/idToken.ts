import { writable } from 'svelte/store';

const idToken = writable(undefined as undefined | null | string);

export default idToken;
