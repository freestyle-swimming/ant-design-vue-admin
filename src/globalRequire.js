import Vue from 'vue';
// 注册指令
import '@/directive/index';
// 全局样式
import '@/styles/index.less';
// 全局组件
import '@/components/index';
// 引入antd样式
import 'ant-design-vue/dist/antd.css';
// 全局使用antd-vue
import Antd from 'ant-design-vue';

Vue.use(Antd);
