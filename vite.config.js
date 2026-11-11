import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'cinepulse-app' with your exact GitHub repository name!
export default defineConfig({
  plugins: [react()],
  base: '/cinepulse-app/',
});