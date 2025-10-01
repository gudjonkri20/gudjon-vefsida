import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// Copy about.md to public folder during build
const copyAboutMd = () => {
  return {
    name: 'copy-about-md',
    buildStart() {
      try {
        // Create public directory if it doesn't exist
        if (!fs.existsSync('public')) {
          fs.mkdirSync('public');
        }
        
        // Make sure about.md exists in public
        if (fs.existsSync('src/data/about.md')) {
          const aboutContent = fs.readFileSync('src/data/about.md', 'utf-8');
          fs.writeFileSync('public/about.md', aboutContent);
          console.log('Successfully copied about.md to public folder');
        } else if (!fs.existsSync('public/about.md')) {
          // If about.md doesn't exist in src/data, but exists in public/about.md, we're good
          if (fs.existsSync('public/about.md')) {
            console.log('about.md already exists in public folder');
          } else {
            console.warn('about.md not found in src/data or public, but continuing build');
            // Create an empty file to prevent build failures
            fs.writeFileSync('public/about.md', '# About\n\nContent coming soon.');
          }
        }
      } catch (error) {
        console.error('Error handling about.md:', error);
        // Don't fail the build on this error
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
    // Add this to see more detailed build errors
    minify: true,
    sourcemap: true,
    // Make build more tolerant of errors
    emptyOutDir: true,
    rollupOptions: {
      // External dependencies that shouldn't be bundled
      external: [],
      output: {
        // Ensure proper chunking
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'react-markdown', 'remark-gfm'],
        }
      }
    }
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