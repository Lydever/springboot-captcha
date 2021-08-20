import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
/*应用全局样式*/
import './assets/css/global.css'

import { postRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { getRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
/*导入font-awesome*/
import 'font-awesome/css/font-awesome.css';
import { downloadRequest } from './utils/download';

/* 插件形式使用请求 */
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRrquest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;


Vue.use(ElementUI)
Vue.config.productionTip = false

/* 全局导航守卫（路由跳转时加载菜单） */
router.beforeEach((to,from,next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router,store)
      //判断用户信息是否存在
      /*if(!window.sessionStorage.getItem('user')){
        return getRequest('/admin/info').then(resp => {
          if(resp){
            //存入用户信息
            window.sessionStorage.setItem('user',JSON.stringify(resp));
            next();
          }
        })
      }*/
      next();
  }else {
    // 如果用户未登录访问内部页面则跳转到登录页面
    if (to.path == '/') {
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
