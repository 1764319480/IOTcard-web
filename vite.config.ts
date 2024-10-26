import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser', // 必须启用：terserOptions配置才会有效
    terserOptions: {
      compress: {
        // 生产环境时移除console.log调试代码
        drop_console:true,
        drop_debugger: true,
      }
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  server: {
    port: 5173,
    // 本地代理跨域，axios baseUrl 需要改为当前域名+端口号，如：http://localhost:5173，不用真实的接口地址（仅本地开发环境）
    proxy: {
      '/api': {
        target: 'http://192.168.43.22:3000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
