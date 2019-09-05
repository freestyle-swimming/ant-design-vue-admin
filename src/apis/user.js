// eslint-disable-next-line import/no-cycle
import request from '@/utils/request';
// 登录
export const requestLogin = data => request({
  url: '/auth/token',
  method: 'post',
  data,
});
// 获取验证码
export const requestVerifyCode = () => request({
  url: '/auth/verify-code',
});
// 获取用户信息及基础信息
export const requestGetUserBaseInfo = () => request({
  url: '/user/base-info',
});
