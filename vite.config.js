// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      'threejs-miniprogram': 'threejs-miniprogram/dist/index.esm.js',
      'threejs-miniprogram/loaders/GLTFLoader': 'threejs-miniprogram/dist/loaders/GLTFLoader.js'
    }
  },
  build: {
    rollupOptions: {
      external: ['threejs-miniprogram']
    }
  }
})