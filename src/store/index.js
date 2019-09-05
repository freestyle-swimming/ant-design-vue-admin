import Vue from 'vue';
import Vuex from 'vuex';
import vuexLoading from '@/plugins/vuexLoading';
// eslint-disable-next-line import/no-cycle
import user from '@/store/modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [vuexLoading],
  modules: {
    user,
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
});
