import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': new URL('./resources/js', import.meta.url).pathname,
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./resources/js/tests/setup.ts'],
        include: ['resources/js/**/*.test.{ts,tsx}'],
    },
});
