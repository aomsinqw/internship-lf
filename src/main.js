import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // import router
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia'


import 'bootstrap/dist/js/bootstrap.bundle.min.js'
const app = createApp(App)

app.config.globalProperties.$axios = axios
app.use(router)
app.use(createPinia())
app.mount('#app')