import axios from 'axios';
import Vue from 'vue';
import {
  modal,
  notification,
} from 'ant-design-vue';
import store from '@/store/index';
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
    notification.error({
      message: 'Error',
      description: error.data || error.data[responsMessageKey] || error.data[responsErrorKey],
    });
  });
});

// 请求拦截处理
const requestInterceptorHandler = (config) => {
  // 获取token
  const token = Vue.ls.get(ACCESS_TOKEN);
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
  const message = response.data[responsMessageKey];
  const errors = response.data[responsErrorKey];
  // 业务异常处理
  switch (code) {
    case 422:
      // 处理422异常
      notification.error({
        message,
        description: errors,
      });
      break;
    case 9001:
      modal.error(message);
      break;
    default:
      modal.error(message);
  }
  // 错误抛停止代码运行
  return Promise.reject(response);
};
// 请求错误处理
const requestErrorHandle = error => Promise.reject(error);
// 响应错误处理
const responseErrorHandle = (error) => {
  const { status } = error.response;
  // 404 处理
  if (status === notFoundStatuCode) {
    modal.error(notFoundStatuMessage);
  }
  // 401 处理
  if (status === unauthorizedStatuCode) {
    modal.error(unauthorizedStatuMessage);
    // 跳转到登录页面 todo
  }
  // 500 处理
  if (status === serverErrorStatuCode) {
    modal.error(serverErrorStatuMessage);
  }
  // 错误抛出统一收集处理
  return Promise.reject(error);
};

// 请求拦截器
axiosInstance.interceptors.request.use(requestInterceptorHandler, requestErrorHandle);
// 响应拦截器
axiosInstance.interceptors.response.use(responseInterceptorHandler, responseErrorHandle);
export default axiosInstance;
