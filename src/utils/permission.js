import store from '@/store';

function actionToObject(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log('err', e.message);
  }
  return [];
}

/**
 * 检查路由是否有权限配置
 */
function hasRoutePermissionConfig(route) {
  if (!route.meta || !route.meta.permission) {
    return false;
  }
  if (!Array.isArray(route.meta.permission)) {
    throw new Error('permission is not an Array');
  }
  return true;
}
// 判断权限值是否在权限列表里面
function hasPermission(routePermissionList, userPermissionList) {
  return routePermissionList.some(permissionKey => userPermissionList.includes(permissionKey));
}

/**
 * 检查路由是否有权限(同步)
 */
function hasRoutePermissionAsync(route, userPermissionList) {
  // route没有权限配置，认为始终有权限
  if (!hasRoutePermissionConfig(route)) {
    return true;
  }

  const routePermissionList = route.meta.permission;
  return hasPermission(routePermissionList, userPermissionList);
}
/**
 * 获取用户权限信息
 */
async function getUserPermissionList() {
  await store.dispatch('getUserInfo');
  const userPermissions = store.getters.permissions;
  return userPermissions;
}
/**
 * 检查路由是否有权限(异步)
 */
async function hasRoutePermission(route) {
  // route没有权限配置，认为始终有权限
  if (!hasRoutePermissionConfig(route)) {
    return true;
  }

  const userPermissionList = await getUserPermissionList();
  return hasRoutePermissionAsync(route, userPermissionList);
}

/**
 * 过滤具有权限的路由
 */
function filterAsyncRouter(asyncRouterMap, permissionList) {
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (hasRoutePermissionAsync(route, permissionList)) {
      if (route.children && route.children.length) {
        // eslint-disable-next-line no-param-reassign
        route.children = filterAsyncRouter(route.children, permissionList);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

export {
  actionToObject,
  hasPermission,
  hasRoutePermission,
  hasRoutePermissionAsync,
  filterAsyncRouter,
};
