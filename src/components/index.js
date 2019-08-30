import Vue from 'vue';
import VueStorage from 'vue-ls';
import Hello from './HelloWorld.vue';
import {
  storageOptions,
} from '@/constants/config';

Vue.use(Hello);
Vue.use(VueStorage, storageOptions);
