import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '@/assets/css/reset.scss'
import router from './router';

const app = createApp(App)
const pinia = createPinia();

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

pinia.use(createPersistedState({
    storage: sessionStorage // 存储引擎，默认为 localStorage
}))

app.use(router)
app.use(pinia)
app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')
