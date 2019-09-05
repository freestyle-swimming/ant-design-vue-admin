/* eslint-disable no-const-assign */
const moduleName = 'loading';
const SHOW_VUEX_LOADING = 'SHOW_VUEX_LOADING';
const HIDE_VUEX_LOADING = 'HIDE_VUEX_LOADING';
const RESET_VUEX_LOADING = 'RESET_VUEX_LOADING';
const vuexLoadingStore = {
  namespace: true,
  state: {
    actions: {},
  },
  mutations: {
    [SHOW_VUEX_LOADING]: (state, payload) => {
      state.actions = {
        ...state.actions,
        [payload.type]: true,
      };
    },
    [RESET_VUEX_LOADING]: (state) => {
      // eslint-disable-next-line no-restricted-syntax
      const actions = Object.assign(state.actions);
      const keys = Object.keys(actions);
      const loading = {};
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (actions[key]) {
          loading[key] = false;
        }
      }
      state.actions = {
        ...state.actions,
        ...loading,
      };
    },
    [HIDE_VUEX_LOADING]: (state, payload) => {
      state.actions = {
        ...state.actions,
        [payload.type]: false,
      };
    },
  },
};

const vuexLoading = (store) => {
  store.registerModule([moduleName], vuexLoadingStore);

  store.subscribeAction({
    before: ({ type }) => {
      store.commit(SHOW_VUEX_LOADING, { type });
    },
    after: ({ type }) => {
      store.commit(HIDE_VUEX_LOADING, { type });
    },
  });
};

export default vuexLoading;
