// import axios from 'axios';
import QS from'querystring';
import { Indicator } from 'mint-ui';
import router from '../router';
const API_HOST = process.env.API_ROOT;
const TEST_URL = process.env.TEST_URL;
axios.defaults.baseURL = API_HOST;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
let flag = false;
//请求拦截器
axios.interceptors.request.use(config => {
  if(!flag) {
    Indicator.open()
    flag = true;
  }
  let token = window.localStorage.getItem('token');
  if(token) {
    config.headers.Token = token;
  }
  return config;
}, err => {
  return Promise.reject(err)
})
//响应拦截器
axios.interceptors.response.use(res => {
    Indicator.close()
    flag = false;
    //token过期处理
    if (res.data && res.data.code === "401401") {
        if (router.currentRoute.path == "/login") {
          return res.data;
        }
        router.replace(`/login?redirect=${encodeURIComponent(router.currentRoute.fullPath)}`);
        return res.data;
    }
  return res.data;
}, err => {
  Indicator.close()
  if (err && err.response) {
      switch (err.response.status) {
          case 400: err.message = '请求错误(400)' ; break;
          case 401: err.message = '未授权，请重新登录(401)'; break;
          case 403: err.message = '拒绝访问(403)'; break;
          case 404: err.message = '请求出错(404)'; break;
          case 408: err.message = '请求超时(408)'; break;
          case 500: err.message = '服务器错误(500)'; break;
          case 501: err.message = '服务未实现(501)'; break;
          case 502: err.message = '网络错误(502)'; break;
          case 503: err.message = '服务不可用(503)'; break;
          case 504: err.message = '网络超时(504)'; break;
          case 505: err.message = 'HTTP版本不受支持(505)'; break;
          default: err.message = `连接出错(${err.response.status})!`;
      }
  }else{
      err.message = '连接服务器失败!'
  }
  return Promise.reject(err)
})
// 通用参数
function params(url, data){
  return {
    methodName: url,
    timestamp: new Date().getTime(),
    version: '1.0',
    sign: '',
    channel: 'mobile',
    pageNumber: 0,
    pageSize: 10,
    data: JSON.stringify(data)
  }
}

function jsonParams (url, data){
  return {
    methodName: url,
    timestamp: new Date().getTime(),
    version: '1.0',
    sign: '',
    channel: 'mobile',
    pageNumber: data.pageNumber,
    pageSize: data.pageSize,
    data: data
  }
}
// ******************** 商品相关接口 ************************//

//获取banner
export const getBanner = () => { return axios.get("/api/v1/banner/getBannerList") }

//获取抢购列表
export const getQiangGouList = () => { return axios.get('/api/v1/flashSale/getFlashSaleList') }

// 获取热门商品
export const getHotProduct = () => { return axios.get('/api/v1/hotSku/getHotProduct') }

//微信分享 
export const weixinShare = params => { return axios.get('/api/v1/wxauth/wxSign', {params: params}) }

//获取品牌列表数据
export const getPinPaiList = (data) => {
  let p = params('getBrandSkuList', data);
  return axios.post('/api/v1/brandSearch/getBrandSkuList', QS.stringify(p))
}
//获取专题列表
export let getLowPricePhone = function(data){
  //console.log(QS.stringify(data))
   let p = params('getSubjectSkuList',data);
  return axios({
    method:'post',
    url:'/api/v1/subjectSearch/getSubjectSkuList',
    data:QS.stringify(p),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
//获取用户评论
export let getReviewList = function(data){
  let p = params('getReviewsList',data);
  return axios({
    method:'post',
    url:'/api/v1/share/getReviewsList',
    data:QS.stringify(p),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
//获取爆款信息
export let getBaoKuan = function(){
  let p = params('search',{});
  return axios({
    method:'post',
    url:'/api/v1/hotSku/search',
    data:QS.stringify(p),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
//发送企业邮箱
export let companyPost = function(data){
  let p = params('sendEmail',data);
  return axios({
    method:'post',
    url:'/api/v1/mail/sendEmail',
    data:QS.stringify(p),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
//*********************  商品分类相关接口 ********************//
//商品分类列表
export const getCategoryList = data => {
  let _data = QS.stringify(params('/api/v1/category/getCategoryList', data)) ;
  return axios.post('/api/v1/category/getCategoryList', _data);
}
//商品品牌列表
export const getBrandList = (data) => {
  let p = params('getBrandList', data);
  return axios.post('/api/v1/category/getBrandList', QS.stringify(p))
}
//商品品牌型号列表
export const getSkuByBrandList = (data) => {
  let p = params('getSkuByBrandList',data);
  return axios.post('/api/v1/category/getSkuByBrandList', QS.stringify(p))
}
//*************************** 搜索相关接口 ********************//
//获取筛选条件
export const getConditions = (data) => {
  let p = params('getConditions', data);
  return axios.post('/api/v1/conditions/getConditions', QS.stringify(p))
}

// 热门搜索
export const getHotSearch = data => {
  let _data = QS.stringify(params('/api/v1/search/getHotSearch', data)) ;
  return axios.post('/api/v1/search/getHotSearch', _data);
}

//获取搜索商品列表
export const searchProductList = (data) => {
  let p = params('search', data);
  return axios.post('/api/v1/search/search', QS.stringify(p))
}
//获取搜索商品
export const searchProductAll = (data) => {
  let p = params('search', data);
  return axios.post('/api/v1/search/searchAll', QS.stringify(p))
}
//获取商品详情
export const getProductDetailById = (data) => {
  let p = params('getProdDetail', data);
  return axios.post('/api/v1/product/getProdDetail', QS.stringify(p))
}
// 质检报告
export const getTestReport = (data) => {
  let p = params('getTestReport', data);
  return axios.post('/api/v1/product/getTestReport', QS.stringify(p))
}

// ******************** 订单相关接口 ************************//
// 获取最优优惠券
export const choiceCoupon = (data) => {
  let p = params('choiceCoupon', data);
  return axios.post('/api/v1/coupon/choiceCoupon', QS.stringify(p))
}
// 兑换优惠券
export const obtainCoupon = (data) => {
  let p = params('obtainCoupon', data);
  return axios.post('/api/v1/coupon/obtainCoupon', QS.stringify(p))
}
// 订单商品详情
export const getAdvanceOrder = (data) => {
  let p = params('getAdvanceOrder', data);
  return axios.post('/api/v1/order/getAdvanceOrder', QS.stringify(p))
}
// 创建订单
export const createOrder = (data) => {
  let p = params('createOrder', data);
  return axios.post('/api/v1/order/createOrder', QS.stringify(p))
}
// 获取订单信息
export const getOrderInfo = (data) => {
  let p = params('getOrderInfo', data);
  return axios.post('/api/v1/order/getOrderInfo', QS.stringify(p))
}

// ******************** 支付相关接口 ************************//
//获取支付方式
export const getPaymentMethod = (data) => {
  let p = params('getPaymentMethod', data);
  return axios.post('/api/v1/payment/getPaymentMethod', QS.stringify(p));
}
//获取乐百分分期期数
export const getLbfPaymentPrice = (data) => {
  let p = params('getLbfPaymentPrice', data);
  return axios.post('/api/v1/payment/getLbfPaymentPrice', QS.stringify(p));
}
//用户支付
export const doPayment = (data) => {
  let p = params('doPayment', data);
  return axios.post('/api/v1/payment/doPayment', QS.stringify(p));
}

// ******************** 收货地址相关接口 ************************//
// 获取地址列表
export let getAddersslist=function(){
  return axios.get('/api/v1/user/userAddressList')
}

//用id查询地址列表
export let getUserAddress=function(id){
  let url = "/api/v1/user/getUserAddress/"+id
  return axios.get(url)
}

//新增收货地址
export let saveUserAddress=function(data){
  return axios({
    method:'post',
    url:'/api/v1/user/saveUserAddress',
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

// 修改收货地址
export let updateUserAddress=function(data){
  let p = params('updateUserAddress',data);
  return axios({
    method:'put',
    url:'/api/v1/user/updateUserAddress',
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  }) 
}

//删除收货地址
export let deleteUserAssres=function(data){
  let p = params('deleteUserAddress',data);
  return axios({
    method:'delete',
    url:`/api/v1/user/deleteUserAddress/${data.id}`,
    data:QS.stringify(p),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }) 
}
// ******************** 订单相关接口 ************************//
// 订单列表
export let tradeList=function(data){
  let p = params('tradeList',data);
  return axios({
    method:"get",
    url:'/api/v1/user/tradeList',
    params:data
  })
}

// 订单数量统计
export let tradeCount=function(status){
  return axios.get(`/api/v1/user/tradeCount?status=${status}`)
}



//订单详情
export const getOrderDatil=(data)=>{
  return axios.get(`/api/v1/user/tradeDetail?data=${data}` )
}

// 取消订单
export const deleteOrder=(data)=>{
  let p = params('deleteOrder', data);
  return axios.post('/api/v1/order/deleteOrder', QS.stringify(p))
}


//物流查询
export const getOrderExpress=(data)=>{
  let p = params('getOrderExpressRouter', data);
  return axios.post('/api/v1/order/getOrderExpressRouter', QS.stringify(p))
}

// ******************** 优惠券相关接口 ************************//



// 优惠券列表
 export let getAcodeList=function(status){
   return axios({
     method:"get",
     url:"/api/v1/user/acode",
     params:{
      pageNumber:"0",
      pageSize:"100",
      status:status
     }
   })
 }


 //领取优惠券
 export const fetchCoupon=function(data){
  return axios({
    method:"post",
    url:"/api/v1/coupon/fetchCoupon",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

//活动优惠券coed
export let standardActivityCodeList = function(){
  return axios.get("/api/v1/coupon/standardActivityCodeList")
}


// ******************** 登录相关接口 ************************//

// 验证码短信接口
export let smsCode=function(data){
  return axios({
    method:"get",
    url:"/api/v1/login/smsCode",
    params:data
  })
}

//登录接口
export let login = function(data){
  return axios({
    method:"post",
    url:"/api/v1/login/login",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'
    }
  })
}

// 用户退出
export let logout = function(){
  return axios({
    method:"post",
    url:"/api/v1/login/logout",
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

//地址列表
export let getRegionList = function(){
  return axios.get("/api/v1/region/getRegionList")
}

// ******************** 售后相关接口 ************************//
// 获取售后原因列表
export const getReasonList = function(type){
  return axios.get(`/api/v1/user/reasonList?category=1&type=${type}`)
}

// 售后换货申请
export const barter=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/barter",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

// 售后维修申请
export const repair=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/repair",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

// 售后退货申请
export const returnGoods=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/returnGoods",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}


// 售后换货列表
export const barterList=()=>{
  return axios.get("/api/v1/user/barterList")
}

// 售后维修列表
export const repairList=()=>{
  return axios.get("/api/v1/user/repairList")
}

//售后退货列表
export const returnGoodsList=()=>{
  return axios.get("/api/v1/user/returnGoodsList")
}

//售后换货详情
export const barterDetail=(id)=>{
  return axios.get(`/api/v1/user/barterDetail?id=${id}`)
}

//售后维修详情
export const repairDetail=(id)=>{
  return axios.get(`/api/v1/user/repairDetail?id=${id}`)
}

//售后退货详情
export const returnGoodsDetail=(id)=>{
  return axios.get(`/api/v1/user/returnGoodsDetail?id=${id}`)
}


// 取消售后换货接口
export const cancelBarter=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/cancelBarter",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

// 取消售后维修接口
export const cancelRepair=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/cancelRepair",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}

// 取消售后退货按钮
export const cancelReturnGoods=function(data){
  return axios({
    method:"post",
    url:"/api/v1/user/cancelReturnGoods",
    data:JSON.stringify(data),
    headers:{
      'Content-Type': 'application/json'      
    }
  })
}



//活动接口
//配件列表接口
export const getFittingsList = (data) => {
  let p = jsonParams('getFittingsList', data);
  return axios.post('/api/v1/fittings/getFittingsList', p)
}

//配件详情接口
export const getFittingsDetails = (data) => {
  let p = jsonParams('getFittingsDetails', data);
  return axios.post('/api/v1/fittings/getFittingsDetails', p)
}


//热门配件
export const getHotFittings = (data) => {
  let p = jsonParams('getHotFittings',data);
  return axios.post('/api/v1/fittings/getHotFittings',p)
}

//配件提交订单
export const createFittingsTrade = (data)=>{
  let p = jsonParams('createFittingsTrade',data);
  return axios.post('/api/v1/fittingsTrade/createFittingsTrade',p)
}


//安卓促销接口
export const getMoreBrandSkuList = (data)=>{
  let p = jsonParams('getMoreBrandSkuList',data);
  return axios.post('/api/v1/activity/getMoreBrandSkuList',p)
}
