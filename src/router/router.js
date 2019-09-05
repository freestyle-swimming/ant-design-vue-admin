import Vue from 'vue';
import Router from 'vue-router';
import constantRouters from '@/router/constantRouters';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: constantRouters,
});
