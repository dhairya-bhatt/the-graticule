import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.BASE_URL || (process.env.NODE_ENV === 'production' ? '/the-graticule/' : '/'),
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        journal: resolve(__dirname, 'journal/index.html'),
        post: resolve(__dirname, 'post/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        firstEdition: resolve(__dirname, 'first-edition/index.html'),
        editorialTeam: resolve(__dirname, 'editorial-team/index.html'),
        disclaimer: resolve(__dirname, 'disclaimer/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
        faq: resolve(__dirname, 'faq/index.html'),
        helpResources: resolve(__dirname, 'help-resources/index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  }
});
