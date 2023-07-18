// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import axios from 'axios'
import VueAxios from 'vue-axios'
import infiniteScroll from 'vue-infinite-scroll';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)

app.use(VueAxios,axios)
app.use(infiniteScroll)
app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
