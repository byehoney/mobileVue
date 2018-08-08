// import Vue from 'vue'
// import Router from 'vue-router'
Vue.use(VueRouter)
//component:() => import('../components/Home.vue'), 分模块加载
export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/index'
    },
    {
      path: '/index',
      name: '哐叽首页',
      component: () => import('@/page/home')
    },
    {
      path: '/product',
      name: '产品页',
      component: () => import('@/page/product/index'),
      children: [
        { path: 'search', name: '商品搜索', component: () => import('@/page/product/search') },
        { path: 'category', name: '商品分类', component: () => import('@/page/product/category') },
        { path: 'list', name: '商品列表', component: () => import('@/page/product/list') },
        { path: 'detail', name: '商品详情', component: () => import('@/page/product/detail') },
        { path: 'order', name: '确认订单', component: () => import('@/page/product/order') },
        { path: 'pay', name: '订单支付', component: () => import('@/page/product/pay') },
        { path: 'paysuccess', name: '支付成功', component: () => import('@/page/product/paySuccess') },
        { path: 'problem', name: '常见问题', component: () => import('@/page/product/problem') },
        { path: 'checkreport', name: '质检报告', component: () => import('@/page/product/testReport') },
      ]
    },
    {
      path: '/support',
      name: '产品支持',
      component: () => import('@/page/support/index'),
      children: [
        { path: 'purchase', name: '企业采购', component: () => import('@/page/support/purchase') },
        { path: 'mobileorigin', name: '手机来源', component: () => import('@/page/support/mobileOrigin') },
        { path: 'mobilebattery', name: '手机电池', component: () => import('@/page/support/mobileBattery') },
      ]
    },
    { path: '/mycenter/about', name: '关于我们', component: () => import('@/page/support/about') },
    {
      path: '/myCenter',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/Mycenter.vue')
    },
    {
      path: '/mycenter/dizhiguanli',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/address/DZGL.vue')
    },
    {
      path: '/mycenter/dizhiguanli/xinjiandizhi',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/address/addres.vue')
    },
    {
      path: '/mycenter/myorder',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/order/MyOrder.vue')
    },
    {
      name: "orderdetails",
      path: '/mycenter/myorder/orderdetails',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/order/OrderDetails.vue')
    },
    {
      path: '/mycenter/coupon',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/coupon/CouponList.vue')
    },
    {
      path: '/receivecoupons',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/coupon/ReceiveCoupons.vue')
    },
    {
      path: '/mycenter/myorder/orderdetails/aftersales',
      name: "aftersales",
      meta: {
        requireAuth: true
      },
      component: () => import('../page/aftersales/AfterSales.vue')
    },
    {
      path: '/mycenter/myorder/logistics',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/order/Logistics.vue')
    },
    {
      path: '/mycenter/aftersaleslist',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/aftersales/AfterSalesList.vue')
    },
    {
      path: '/mycenter/aftersaleslist/aftersalesdetail',
      meta: {
        requireAuth: true
      },
      component: () => import('../page/aftersales/AfterSaleDetail.vue')
    },
    {
      path: '/login',
      component: () => import('../page/Login.vue')
    },
    {
      path: '/useragremment',
      component: () => import('../page/userAgreement.vue')
    },
    {
      path: '/zhibao',
      component: () => import('../page/zhibao.vue')
    },
    {
      path:"/peijian",
      name:"配件",
      component:()=>import('../page/peijian/index.vue'),
      redirect:'/peijian/list',
      children:[
        {path:"list",name:"配件列表",component:()=>import('../page/peijian/list.vue')},
        {path:"detail",name:"配件详情",component:()=>import('../page/peijian/detail.vue')},
        {path:"order",name:"确认下单",component:()=>import('../page/peijian/order.vue')}
      ]
    },
    {
      path:"/activi",
      name:"活动",
      component:()=>import('../page/activity/index.vue'),
      redirect:'/index',
      children:[
        {path:"androidlist",name:"安卓特卖列表",component:()=>import('../page/activity/androidList.vue')}
      ]
    }

  ]
})

