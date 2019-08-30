import {
  hasPermission,
} from '@/utils/permission';
import store from '@/store/index';

// eslint-disable-next-line no-param-reassign
const hide = (element) => { element.style.display = 'none'; };
// eslint-disable-next-line no-param-reassign
const show = (element) => { element.style.display = ''; };

/**
 * 控制按钮权限指令
 */
function permission(el, bind) {
  const permissions = bind.value;
  if (permissions === undefined) {
    hide(el);
  }

  if (!Array.isArray(permissions)) {
    throw new Error('permission is not an Array');
  }

  const userPermissions = store.getters.permissions;
  const isPermissionOk = hasPermission(permissions, userPermissions);

  if (isPermissionOk) {
    show(el);
  } else {
    hide(el);
  }
}

export default {
  insert: permission,
  update: permission,
};
