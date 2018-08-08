// import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
// import store from './vuex/store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Toast } from 'mint-ui'
Vue.use(MintUI)
import { Picker } from 'vux'  
Vue.component(Picker.name, Picker)
import '@/assets/js/rem.js'
import '@/assets/css/base.scss'
// 自定义组件
import Topbar from '@/components/topbar/index';
Vue.use(Topbar)
// 页面标题
Vue.directive('title', {
  inserted(el, binding) {
    document.title = el.dataset.title;
  }
})
// 客服
Vue.directive('kefu', {
  inserted(el, binding) {
    el.onclick = () => {
      document.querySelector('#kefu').click();
    }
  }
})
// 返回上一页
Vue.directive('back', {
  inserted(el, binding) {
    el.onclick = () => {
      router.back()
    }
  }
})

// 全局提示
Vue.prototype.$showToast = (message, duration = 1000) => {
  Toast({
    message,
    duration
  })
}
// 跳转页面返回顶部
router.afterEach((to, from, next) => {
  window.scrollTo(0,0);
})
// 保存utm_medium utm_source
Vue.prototype.$utm_medium = 'mobile';
Vue.prototype.$utm_source = 'kj';
router.beforeEach((to, from, next) => {
  let utmMedium = Array.isArray(to.query.utm_medium) ? to.query.utm_medium[0] : to.query.utm_medium,
      umtSource = Array.isArray(to.query.utm_source) ? to.query.utm_source[0] : to.query.utm_source;
  if(utmMedium) {
    localStorage.setItem('utm_medium', utmMedium);
  }
  if(umtSource) {
    localStorage.setItem('utm_source', umtSource);
  }
  next()
})
// 路由拦截
// router.beforeEach((to, from, next) => {
//   if(to.meta && to.meta.requireAuth) {
//     let isLogin = localStorage.getItem('token');
//     if(isLogin) {
//       next()
//     } else {
//       next(`/login?redirect=${to.fullPath}`)
//     }
//   } else {
//     next()
//   }
// })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
