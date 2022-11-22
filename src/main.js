import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import '@/assets/scss/main.scss';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(router)
  .use(PrimeVue)
  .use(store)
  .use(ToastService)
  .use(ConfirmationService)
  .mount('#app');
