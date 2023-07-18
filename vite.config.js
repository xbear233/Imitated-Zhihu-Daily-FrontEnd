import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //https://juejin.cn/post/7170952274045304868
  server:{
    base: "./",
    proxy:{
       '/api':{
          //  target:"https://news-at.zhihu.com/api/4", //跨域地址 
           target:"http://locahost:8080", //跨域地址
           changeOrigin:true, //支持跨域
           rewrite:(path) => path.replace(/^\/api/, "")//重写路径,替换/api
       }
    }
 }


})
