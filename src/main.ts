import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import App from './App.vue'
import ElementPlus from 'element-plus'
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
app.use(ElementPlus)
app.mount('#app')
