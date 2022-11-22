const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/emby': {
        target: process.env.PROXY_HOST,
        changeOrigin: true,
      },
    }
  },
});
