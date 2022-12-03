import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

// Import the PocketBase JS library
import client from '@/pocketbase';

// Import custom pocketBase type
import { pocketBaseSymbol } from "@/symbols/injectionSymbols"

//import { easepick, RangePlugin, LockPlugin } from '@easepick/bundle';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.provide(pocketBaseSymbol, client)
app.use(vuetify)

app.mount('#app')