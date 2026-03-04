// Main entry point
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

// Create Vue app with plugins
const app = createApp(App)

app.use(vuetify)  // UI components
app.use(router)   // Page routing

app.mount('#app')
