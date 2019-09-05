/* eslint-disable import/no-cycle */
import Vue from 'vue';
import {
  ACCESS_TOKEN,
} from '@/constants/types';
import {
  requestLogin,
  requestGetUserBaseInfo,
  // eslint-disable-next-line import/named
  requestVerifyCode,
} from '@/apis/user';

export default {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // 登录
    async login(context, body) {
      try {
        const res = await requestLogin(body);
        Vue.ls.set(ACCESS_TOKEN, res.data.token, res.data.expire);
        context.dispatch('getUserBaseInfo');
        return res;
      } catch (error) {
        return error.data;
      }
    },
    // 获取验证码
    async verifyCode() {
      return requestVerifyCode();
    },
    // 获取基础信息
    async getUserBaseInfo() {
      const res = await requestGetUserBaseInfo();
      return res;
    },
  },
};
