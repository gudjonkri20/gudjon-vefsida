import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Copy about.md to public folder during build
const copyAboutMd = () => {
  return {
    name: 'copy-about-md',
    buildStart() {
      // Create public directory if it doesn't exist
      if (!fs.existsSync('public')) {
        fs.mkdirSync('public');
      }
      
      // Make sure about.md exists in public
      try {
        if (fs.existsSync('src/data/about.md')) {
          const aboutContent = fs.readFileSync('src/data/about.md', 'utf-8');
          fs.writeFileSync('public/about.md', aboutContent);
          console.log('Successfully copied about.md to public folder');
        } else if (!fs.existsSync('public/about.md')) {
          console.error('about.md not found in src/data or public');
        }
      } catch (error) {
        console.error('Error handling about.md:', error);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copyAboutMd()
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Ensure static assets are properly handled
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  // Improve asset handling
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // Configure server
  server: {
    port: 5173,
    strictPort: false,
    host: true,
  },
});