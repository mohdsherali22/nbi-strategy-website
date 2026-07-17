import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        services: 'services.html',
        about: 'about.html',
        insights: 'insights.html',
        contact: 'contact.html'
      }
    }
  }
});
