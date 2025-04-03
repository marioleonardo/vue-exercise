// daylight-app/src/main.ts
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// PrimeVue Imports
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// import Lara from '@/presets/lara';

import Aura from '@primeuix/themes/aura';

// import 'primevue/resources/them'
// import 'primevue/resources/primevue.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css'; // PrimeFlex for layout utilities

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue,{
    // Default theme configuration
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

// Register PrimeVue components globally (or import locally in components)
app.component('Button', Button);
app.component('Card', Card);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Message', Message);
app.component('DataTable', DataTable);
app.component('Column', Column);


app.mount('#app')