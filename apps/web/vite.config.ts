import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit(), basicSsl()],
  // https://github.com/sveltejs/kit/issues/11365
  server: {
    proxy: {},
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
  },
});
