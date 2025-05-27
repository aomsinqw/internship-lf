import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // import router
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.config.globalProperties.$axios = axios
app.use(router)
app.use(createPinia())

// กำหนด options เป็น object ว่างถ้าไม่ต้องการตั้งค่า
const options = {}

app.use(Toast, options);

app.mount('#app')
