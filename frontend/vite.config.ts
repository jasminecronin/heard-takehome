import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // to ensure the server is accessible from inside the container
    port: 5173,
    strictPort: true,
  },
});
