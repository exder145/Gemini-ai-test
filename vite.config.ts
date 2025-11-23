import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const basePath = (() => {
    // 优先使用手动指定；其后在 Vercel 等根路径环境用根路径；最后默认仓库名以适配 GitHub Pages
    const raw = env.VITE_BASE_PATH ?? (env.VERCEL ? '' : 'Gemini-ai-test');
    const cleaned = raw.replace(/^\/+|\/+$/g, '');
    return cleaned ? `/${cleaned}/` : '/';
  })();

  return {
    // GitHub Pages 需要设置 base，保证资源路径正确
    base: mode === 'production' ? basePath : '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
