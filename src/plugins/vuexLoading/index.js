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
      const actions = Object.keys(state.actions);
      for (let i = 0; i < actions.length; i += 1) {
        const item = state[actions[i]];
        if (item) {
          state.actions = {
            ...state.actions,
            [item]: false,
          };
          break;
        }
      }
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
