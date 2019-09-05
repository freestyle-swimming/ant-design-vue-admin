import axios from 'axios';
import Vue from 'vue';
import {
  Modal,
  notification,
  message,
} from 'ant-design-vue';
// eslint-disable-next-line import/no-cycle
import store from '@/store/index';
import router from '@/router/router';
import { ACCESS_TOKEN } from '@/constants/types';
import {
  responseCodeKey,
  responseSuccessCodeValue,
  responsMessageKey,
  responsErrorKey,
  notFoundStatuCode,
  notFoundStatuMessage,
  unauthorizedStatuCode,
  unauthorizedStatuMessage,
  serverErrorStatuMessage,
  serverErrorStatuCode,
  unloginStatuCode,
  unloginStatuCodeMessage,
} from '@/constants/config';

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 6000,
});
// 全局promise异常错误监听
window.addEventListener('unhandledrejection', (evt) => {
  evt.promise.catch((error) => {
    // 错误先重置loading
    store.commit('RESET_VUEX_LOADING');
    // todo 全局promise错误处理
    console.log(error);
  });
});
const notLoginOkHandler = () => {
  router.push({ name: 'login' });
};
// 请求拦截处理
const requestInterceptorHandler = (config) => {
  // 获取token
  const token = Vue.ls.get(ACCESS_TOKEN);
  console.log(token);
  const obj = Object.assign(config, {});
  if (token) {
    obj.headers.Authorization = `Bearer ${token}`;
  }
  // 默认为json格式
  if (!config.headers['Content-Type']) {
    obj.headers['Content-Type'] = 'application/json;charset=utf-8';
  }
  return obj;
};
// 响应拦截处理
const responseInterceptorHandler = (response) => {
  // 业务返回code
  const code = response.data[responseCodeKey];
  // 业务数据返回正常处理
  if (code === responseSuccessCodeValue) {
    return response.data;
  }
  const resmessage = response.data[responsMessageKey];
  const errors = response.data[responsErrorKey];
  // 业务异常处理
  switch (code) {
    case 422:
      // 处理422异常
      notification.error({
        message: resmessage,
        description: errors,
      });
      break;
    case unloginStatuCode:
      Modal.error({
        title: '未登录',
        content: unloginStatuCodeMessage,
        onOk: notLoginOkHandler,
      });
      break;
    case 9001:
      message.error(resmessage);
      break;
    default:
      store.commit('RESET_VUEX_LOADING');
      message.error(resmessage);
  }
  // 错误抛停止代码运行
  return Promise.reject(response);
};
// 请求错误处理
const requestErrorHandle = error => Promise.reject(error);
// 响应错误处理
const responseErrorHandle = (error) => {
  store.commit('RESET_VUEX_LOADING');
  if (error.response) {
    const {
      status,
    } = error.response;
    // 404 处理
    if (status === notFoundStatuCode) {
      Modal.error({
        title: '404',
        content: notFoundStatuMessage,
      });
    }
    // 401 处理
    if (status === unauthorizedStatuCode) {
      Modal.error({
        title: '登录过期',
        content: unauthorizedStatuMessage,
      });
      // 跳转到登录页面 todo
    }
    // 500 处理
    if (status === serverErrorStatuCode) {
      Modal.error({
        title: '服务器错误',
        content: serverErrorStatuMessage,
      });
    }
  } else {
    // 网络错误
    Modal.error({
      title: '请检查网络',
      content: error.message,
    });
  }
  // 错误抛出统一收集处理
  return Promise.reject(error);
};
// 请求拦截器
axiosInstance.interceptors.request.use(requestInterceptorHandler, requestErrorHandle);
// 响应拦截器
axiosInstance.interceptors.response.use(responseInterceptorHandler, responseErrorHandle);
export default axiosInstance;
