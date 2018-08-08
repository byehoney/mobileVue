<template>
    <section ref="tabHook" class="page">
        <div v-title :data-title="$route.name"></div>
        <!-- headerbar -->
        <div class="headerbar">
            <div class="hd-button">
                <i class="iconfont icon-fanhui1" @click="handleBack"></i>
            </div>
            <ul class="tabbar">
                <li
                    v-for="(item, index) in tabList"
                    :key="index" class="tab-item"
                    :class="{active: index === tabIndex}"
                    @click="handleTabSelected(index)">
                    <span>{{item}}</span>
                </li>
            </ul>
            <div class="hd-button"></div>
        </div>
        <div style="height: 1rem;"></div>
        <!-- banner -->
        <div class="banner-wrap">
            <div class="wrap-layer">
                <p class="tips">Tips: 您看到的机器，就是您所买的机器！</p>
                <div class="indicator">
                    <span>{{bannerIndex}}/{{bannerList.length}}</span>
                </div>
            </div>
            <!-- <mt-swipe :show-indicators="false" :auto="0" style="width: 100%; height: 4.8rem;" @change="handleChange">
                <mt-swipe-item v-for="(item, index) in bannerList" :key="index">
                    <img :src="item">
                </mt-swipe-item>
            </mt-swipe> -->
            <div id="bannerSwiper" class="swiper-container" style="width: 100%; height: 4.8rem;">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in bannerList" :key="index">
                        <img :src="item" style="width: 100%; height: 4.8rem;">
                    </div>
                </div>
            </div>
            <!-- <div class="back-button" @click="handleBack">
                <i class="iconfont icon-fanhui1"></i>
            </div> -->
        </div>
        <!-- 本机信息 -->
        <div class="device-info">
            <div class="device">
                <label class="device-label text-gray">本机信息</label>
                <ul class="info-list">
                    <li v-if="baseInfo.skuOrigin" class="info-item">{{baseInfo.skuOrigin}}</li>
                    <li v-for="(item, index) in baseInfo.skuRepair" :key="baseInfo.imei + index" class="info-item">{{item}}</li>
                </ul>
            </div>
            <div class="imei">
                <div class="imei-info">
                    <p class="device-battery">电池效率：{{stateInfo.battery}}%</p>
                    <label class="imei-label">IMEI：</label>
                    <span id="emeiCode" class="imei-code">{{baseInfo.imei}}</span>
                    <p class="tips text-red">提示：成功支付订单后，在个人中心查看IMEI信息。</p>
                </div>
                <!-- <div class="imei-copy">
                    <button class="copy-button" data-clipboard-target="#emeiCode" @click="handleCopy">复制</button>
                </div> -->
                <div v-show="serialNumberIndex > 0" class="last-one" @click="handleChangeOne(-1)">
                  <img src="@/assets/img/icon-last-one.png">
                </div>
            </div>
        </div>
        <!-- 价格信息 -->
        <div class="device-base">
            <div class="device-name">
                <div class="name">
                  <span class="chengse bg-yellow">{{stateInfo.condition}}</span>
                  {{baseInfo.name}}
                </div>
                <!-- 换一台 -->
                <div v-if="isPayVisible" v-show="changeOneVisible" class="change-one" @click="handleChangeOne(1)">
                    <img src="@/assets/img/icon-change.png">
                    <!-- <i class="iconfont icon-huanyitai bg-yellow"></i>
                    <span>换一台</span> -->
                </div>
            </div>
            <div class="device-price" v-if="isPayVisible">
                <div class="price">
                    <div class="current-price text-red">
                        <i class="font-rmb">￥</i>
                        <span class="amount">{{baseInfo.price || 0}}</span>
                    </div>
                    <div v-show="changeOneVisible" class="new-price">
                        <label>新机</label>
                        <i class="font-rmb">￥</i><span class="amount">{{baseInfo.newPrice || 0}}</span>
                    </div>
                </div>
                <div v-show="changeOneVisible" class="save">
                    <i class="font-icon bg-red">省</i>
                    <span class="amount"><i class="font-rmb">￥</i>{{(baseInfo.newPrice - baseInfo.price) || 0}}</span>
                </div>

            </div>
        </div>
        <!-- 承诺 -->
        <div class="device-service">
            <ul class="service-list">
                <li class="service-item">
                    <img src="@/assets/img/icon-7day.png" class="icon"><span class="text">七天退换</span>
                </li>
                <li class="service-item">
                    <img src="@/assets/img/icon-switch.png" class="icon"><span class="text">十五天换货</span>
                </li>
                <li class="service-item">
                    <img src="@/assets/img/icon-wrench.png" class="icon"><span class="text">一年机器保修</span>
                </li>
            </ul>
        </div>
        <!-- 支付方式 -->
        <div class="pay">
            <div class="pay-item">
                <label class="pay-label text-gray">赠品</label>
                <span>国产充电套装（充电头+数据线）</span>
            </div>
            <div class="pay-item pay-way">
                <label class="pay-label text-gray">支付方式</label>
                <ul class="payway-list">
                    <li class="payway-item">
                        <img src="@/assets/img/icon-alipay.png" class="icon">
                    </li>
                    <li class="payway-item">
                        <img src="@/assets/img/icon-wxpay.png" class="icon">
                    </li>
                    <li class="payway-item">
                        <img src="@/assets/img/icon-lbfpay.png" class="icon">
                    </li>
                </ul>
            </div>
        </div>
        <!-- 本机质检 -->
        <div class="quality-testing hook">
            <h3 class="test-title">本机质检</h3>
            <div class="test-content">
                <div class="quality-result">
                    <div class="quality-inspector">
                        <div class="inspector-avatar">
                            <img :src="inspectorInfo.url" class="avatar">
                        </div>
                        <div class="inspector-name">
                            <p class="name">{{inspectorInfo.name}}</p>
                            <p class="title">{{inspectorInfo.identity}}</p>
                        </div>
                        <div class="quality-auth">
                            <img src="../../img/report-auth.png">
                        </div>
                    </div>
                    <div class="test-tip text-red">
                        <p>友情提示</p>
                        <p>此手机通过哐叽长达8小时煲机测试，请放心使用！</p>
                    </div>
                    <!-- <div class="quality-detail">
                        <div class="detail-item result">
                            <p>检测结果： {{inspectorInfo.result}}</p>
                        </div>
                        <div class="detail-item avaluate">
                            <p>整机评估：{{inspectorInfo.assess}}</p>
                        </div>
                    </div> -->
                </div>
                <div class="state">
                    <h3 class="state-title">参数信息</h3>
                    <div class="state-detail">
                        <div class="detail-col">
                            <ul class="state-list">
                                <li class="state-item">
                                    <label class="item-name">生产日期</label>
                                    <span class="item.value">{{stateInfo.date}}</span>
                                </li>
                                <li>
                                    <label class="item-name">电池效率</label>
                                    <span>{{stateInfo.battery}}%</span>
                                </li>
                                <li>
                                    <label class="item-name">机器来源</label>
                                    <span>{{stateInfo.origin}}</span>
                                </li>
                                <li>
                                    <label class="item-name">外观成色</label>
                                    <span>{{stateInfo.condition}}</span>
                                </li>
                            </ul>
                        </div>
                         <div class="detail-col">
                            <ul class="state-list">
                                <li class="state-item">
                                    <label class="item-name">系统</label>
                                    <span class="item.value">{{stateInfo.system}}</span>
                                </li>
                                <li>
                                    <label class="item-name">版本</label>
                                    <span>{{stateInfo.edition}}</span>
                                </li>
                                <li class="state-repair">
                                    <label class="item-name">维修记录</label>
                                    <p>
                                        <span v-for="item in stateInfo.repair" :key="item">{{item}}&nbsp;&nbsp;</span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="function">
                    <h3 class="function-title">功能检测</h3>
                    <ul class="function-list">
                        <li v-for="(item, index) in functionList" :key="index">
                            <label class="function-name">{{item}}</label>
                            <img src="@/assets/img/icon-circle-check.png" class="icon">
                        </li>
                    </ul>
                </div>
                <div class="params">
                    <h3 class="params-title">机器参数</h3>
                    <div class="params-body">
                        <div class="params-group">
                            <h4 class="group-name">基础参数</h4>
                            <ul class="params-list">
                                <!-- <li class="params-item">
                                    <label class="param-name">型号</label>
                                    <p>{{paramsInfo.model}}</p>
                                </li> -->
                                <li class="params-item">
                                    <label class="param-name">内存</label>
                                    <p>{{paramsInfo.capacity}}</p>
                                </li>
                                <li class="params-item">
                                    <label class="param-name">颜色</label>
                                    <p>{{paramsInfo.colour}}</p>
                                </li>
                                <!-- <li class="params-item">
                                    <label class="param-name">成色</label>
                                    <p>{{paramsInfo.condition}}</p>
                                </li> -->
                                <!-- <li class="params-item">
                                    <label class="param-name">版本</label>
                                    <p>{{paramsInfo.edition}}</p>
                                </li> -->
                                <li class="params-item">
                                    <label class="param-name">网络</label>
                                    <p>{{paramsInfo.network}}</p>
                                </li>
                            </ul>
                        </div>
                        <div class="params-group">
                            <h4 class="group-name">屏幕信息</h4>
                            <ul class="params-list">
                                <li class="params-item">
                                    <label class="param-name">分辨率</label>
                                    <p>{{paramsInfo.resolution}}</p>
                                </li>
                            </ul>
                        </div>
                         <div class="params-group">
                            <h4 class="group-name">外观信息</h4>
                            <ul class="params-list">
                                <li class="params-item" style="width: 40%">
                                    <label class="param-name">手机尺寸</label>
                                    <p>{{paramsInfo.size}}</p>
                                </li>
                                <li class="params-item" style="width: 50%">
                                    <label class="param-name">SIM卡规格</label>
                                    <p>{{paramsInfo.sim}}</p>
                                </li>
                            </ul>
                        </div>
                         <div class="params-group">
                            <h4 class="group-name">摄像头信息</h4>
                            <ul class="params-list">
                                <li class="params-item">
                                    <label class="param-name">前置摄像头</label>
                                    <p>{{paramsInfo.frontCamera}}像素</p>
                                </li>
                                <li class="params-item">
                                    <label class="param-name">后置摄像头</label>
                                    <p>{{paramsInfo.backCamera}}像素</p>
                                </li>
                            </ul>
                        </div>
                         <div class="params-group">
                            <h4 class="group-name">硬件信息</h4>
                            <ul class="params-list">
                                <li class="params-item" style="width: 50%">
                                    <label class="param-name">CPU</label>
                                    <p>{{paramsInfo.cpu}}</p>
                                </li>
                                <!-- <li class="params-item">
                                    <label class="param-name">主频</label>
                                    <p>{{paramsInfo.frequency}}</p>
                                </li> -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 质检流程 -->
        <div class="process">
            <div class="process-pic">
                <img src="../../img/detail/process.png" onclick="return false">
            </div>
            <div class="process-video">
                <video
                  ref="myVideo"
                  class="video"
                  x5-playsinline="" playsinline="" webkit-playsinline=""
                  src="https://imgs.kjershou.com/video/db7b387c2f589dbd079ba036b418ee1e.mp4"
                  poster="https://imgs.kjershou.com/video/69276d2c9f5410c22d6af784a16bbb27.mp4?x-oss-process=video/snapshot,t_4500,f_jpg,w_345,h_194,m_fast"
                  >
                </video>
                <div v-show="videoPlayShow" class="video-layer">
                    <img src="@/assets/img/play.png" @click="videoPlay">
                </div>
            </div>
        </div>
        <!-- 包装清单 -->
        <div class="packing-list">
            <div class="title">
                <h4>包装清单</h4>
                <p>手机主机/3C认证充电头/3C认证数据线/插针</p>
            </div>
            <img src="../../img/detail/qingdan.png" onclick="return false">
        </div>
        <!-- 常见问题 -->
        <div class="problem hook">
            <div class="p-title">
                <h4>常见问题</h4>
            </div>
            <div class="p-body">
                <ul class="problem-list">
                    <li class="problem-item">
                        <div class="item-questions">
                            <i class="iconfont icon-wenti text-yellow"></i>
                            <h4 class="q-text">什么是“二手手机”？</h4>
                        </div>
                        <div class="item-answer">
                            <p>二手手机分两种：</p>
                            <p>1.个人用户需要更新换代时闲置下来的手机。</p>
                            <p>2.在厂家保修政策内返厂处理后的手机，也叫“官翻机”。</p>
                        </div>
                    </li>
                     <li class="problem-item">
                        <div class="item-questions">
                            <i class="iconfont icon-wenti text-yellow"></i>
                            <h4 class="q-text">我们手机的来源是什么？</h4>
                        </div>
                        <div class="item-answer">
                            <p>1.个人机：每日哐叽驻场质检师从爱回收大库中精心挑选的优质二手手机，全部来自于对旧机爱护有加的个人卖家。</p>
                            <p>2.官方机：全部来自于手机官方授权代理商，100%正品保证。</p>
                            <p>3.自营机：哐叽拥有数百家合作商户，经过繁琐的质检过程优中选优，只为能给您找到更好的那一台。</p>
                        </div>
                    </li>
                     <li class="problem-item">
                        <div class="item-questions">
                            <i class="iconfont icon-wenti text-yellow"></i>
                            <h4 class="q-text">我购买的二手手机品质怎么保障？</h4>
                        </div>
                        <div class="item-answer">
                            <p>哐叽所有的二手物品，均来源于合法正规渠道，从源头保证机器处于良好的使用状态，每件二手商品都经过质检工程师的深度检测，严格把控手机品质，可以放心购机。我们对用户购买的每部手机都提供质检报告，同时整机质量问题质保1年。</p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="p-more">
                <button class="show-more text-yellow" @click="toProblemPage">查看更多常见问题</button>
            </div>
        </div>
        <!-- 售后 -->
        <div class="after-sale hook">
            <div class="s-header">
                <h4>售后</h4>
            </div>
            <div class="s-body">
                <img src="../../img/detail/shouhou.png" onclick="return false">
            </div>
        </div>
        <!-- 用户评价 -->
        <div class="evaluation hook">
            <div class="ev-header">
                <h4>消费者反馈</h4>
            </div>
            <div class="ev-body">
                <ul class="evaluation-list">
                    <li class="evaluation-item" v-for="(item, index) in evaluationList" :key="index">
                        <div class="item-header">
                            <div class="user">{{item.userName}}</div>
                            <div class="device">
                                <span>{{item.name}}</span>
                                <span class="ev-date text-gray">{{item.dtCreated}}</span>
                            </div>
                        </div>
                        <div class="item-body">
                            <div class="ev-content">
                                <p>{{item.content}}</p>
                            </div>
                            <ul class="ev-pic-list">
                                <li class="pic" v-for="(picUrl, index) in item.picture" :key="index">
                                    <img :src="picUrl" @click="showPicture(picUrl)">
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- footbar -->
        <div v-if="isPayVisible" style="height: 1rem;"></div>
        <div class="footbar" v-if="isPayVisible">
            <div class="kefu" v-kefu @click="callService">
                <i class="iconfont icon-erji"></i>
                <p class="text">客服</p>
            </div>
            <div class="price text-red">
                <i class="font-rmb">￥</i>
                <span class="amount">{{(baseInfo.price) || 0}}</span>
            </div>
            <div class="button">
                <button class="purchase-button" @click="handlePurchase">立即购买</button>
            </div>
        </div>
        <div v-show="picShow" class="page-layer" @click="picShow = false">
            <img ref="previewPic" :src="picUrl" onclick="return false;">
        </div>
    </section>
</template>
<script>
// import ClipBoard from "clipboard";
import { getProductDetailById, getReviewList, weixinShare } from "@/api";
export default {
  name: 'Detail',
  data() {
    return {
      skuId: '',
      serialNumber: '',
      serialNumberList: [],
      serialNumberIndex: 0,
      timer: null,
      isBackShow: false,
      tabList: ["质检", "常见问题", "售后", "评价"],
      tabIndex: 0,
      bannerIndex: 1,
      tabBodyHeight: [],
      functionList: [
        "触摸",
        "屏幕显示",
        "通话",
        "音量键",
        "HOME键",
        "静音键",
        "指纹识别",
        "前置摄像头",
        "后置摄像头",
        "闪光灯",
        "WIFI",
        "蓝牙",
        "GPS",
        "NFC",
        "SIM卡识别",
        "距离感应",
        "指南针",
        "陀螺仪",
        "重力感应",
        "扬声器",
        "话筒",
        "听筒",
        "耳机",
        "USB连接",
        "充电"
      ],
      bannerList: [],
      baseInfo: {},
      inspectorInfo: {},
      stateInfo: {},
      paramsInfo: {},
      evaluationList: [],
      picShow: false,
      picUrl: '',
      productKey: '',
      videoPlayShow: true,
      swiper: null,
      changeTimer: null,
      changeOneVisible: false,
      utmMedium: '',
      utmSource: '',
      isPayVisible: true,
    };
  },
  methods: {
    // 获取商品详情
    getProductDetail() {
      let data = {
        utmMedium: this.utmMedium,
        utmSource: this.utmSource,
        visitor: '',
        serialNumber: this.serialNumber,
      };
      getProductDetailById(data)
        .then(res => {
          if (res.code === "0") {
            if (!res.body) {
              this.$showToast("服务器响应错误！");
              return;
            }
            let productDetail = res.body;
            this.skuId = productDetail.skuId;
            this.serialNumber = productDetail.serialNumber;
            this.bannerList = productDetail.skuUrlList;
            this.baseInfo = {
              name: productDetail.skuName,
              price: productDetail.price,
              newPrice: productDetail.newPrice,
              imei: productDetail.imei,
              skuRepair: productDetail.skuRepair,
              skuOrigin: productDetail.skuOrigin
            };
            this.inspectorInfo = productDetail.skuInspectResponse;
            this.stateInfo = productDetail.repairStateResponse;
            this.paramsInfo = productDetail.skuParamResponse;
            document.title = productDetail.skuName;
            let that = this;
            this.bannerIndex = 1;
            if(this.swiper !== null) {
              this.swiper.autoplay.stop();
            }
            this.$nextTick(() => {
              setTimeout(() => {
                this.swiper = new Swiper("#bannerSwiper", {
                  slidesPerView: "auto",
                  centeredSlides: true,
                  spaceBetween: 0,
                  initialSlide: 0,
                  autoplay: {
                    disableOnInteraction: true,
                  },
                  on: {
                    slideChangeTransitionStart() {
                      that.bannerIndex = this.activeIndex + 1;
                    }
                  }
                })
              }, 500)
            });
          } else {
            this.$showToast(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 微信分享
    wxShare() {
      let params = {
        url: location.href.split('#')[0],
      }
      weixinShare(params).then(res => {
        if(res && res.appId) {
          wx.config({
              debug: false,
              appId: res.appId,
              timestamp: res.timestamp,
              nonceStr: res.nonceStr,
              signature: res.signature,
              jsApiList: [
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage'
              ]
          });
          // wx.ready(function() {
          //     wx.onMenuShareAppMessage({
          //         title: '哐叽 - 爱回收旗下二手手机直卖平台',
          //         desc: '一机一拍，一机一卖，来源明确，维修标注',
          //         link: `http://capitest.kdyoupin.com/product/detail?serialNumber=${this.serialNumber}`,
          //         imgUrl: 'https://wx.kuangjifix.com/img/round-logo.png'
          //     });
          //     wx.onMenuShareTimeline({
          //         title: '哐叽 - 爱回收旗下二手手机直卖平台',
          //         desc: '一机一拍，一机一卖，来源明确，维修标注',
          //         link: `http://capitest.kdyoupin.com/product/detail?serialNumber=${this.serialNumber}`,
          //         imgUrl: 'https://wx.kuangjifix.com/img/round-logo.png'
          //     });
          // })
          wx.ready(function () {
              wx.onMenuShareAppMessage({
                  title: '哐叽 - 爱回收旗下二手手机直卖平台',
                  desc: '一机一拍，一机一卖，来源明确，维修标注',
                  link: "https://m.kjershou.com?utm_source=kj&utm_medium=wx",
                  imgUrl: 'https://imgs.kjershou.com/static/logo/logo.jpg'
              });
              wx.onMenuShareTimeline({
                  title: '哐叽 - 爱回收旗下二手手机直卖平台',
                  desc: '一机一拍，一机一卖，来源明确，维修标注',
                  link: "https://m.kjershou.com?utm_source=kj&utm_medium=wx",
                  imgUrl: 'https://imgs.kjershou.com/static/logo/logo.jpg'
              });
          })
        } else {
          this.$showToast('分享参数有误！')
        }
      })
    },
    // 返回上一页
    handleBack() {
      this.$router.back();
    },
    // 轮播图切换
    handleChange(index) {
      this.bannerIndex = index + 1;
    },
    handleCopy() {
      this.$showToast("已复制到粘贴板");
      _paq.push(['trackEvent', '50.DetailPage', '50.14.CopyImei', '50.14.CopyImei']);
    },
    // 换一台
    handleChangeOne(inc) {
      clearTimeout(this.changeTimer);
      this.changeTimer = setTimeout(() => {
        if(this.serialNumberList.length === 0) {
          this.$showToast('暂无相似商品');
          return;
        }
        let maxIndex = this.serialNumberList.length - 1;
        if(inc > 0) {
          if(this.serialNumberIndex === maxIndex) {
            // this.serialNumberIndex = 0;
            this.$showToast('已经是最后一台了');
            return;
          } else {
             this.serialNumberIndex++;
          }
        } else {
          if(this.serialNumberIndex === 0) {
            // this.serialNumberIndex = maxIndex;
            this.$showToast('已经是第一台了');
            return;
          } else {
            this.serialNumberIndex--;
          }
        }
        this.serialNumber = this.serialNumberList[this.serialNumberIndex];
        this.getProductDetail();
        _paq.push(['trackEvent', '50.DetailPage', '50.15.ChangeImei', '50.15.ChangeImei']);
      }, 200)
    },
    // 导航栏切换并滚动到相应内容
    handleTabSelected(index) {
      this.tabIndex = index;
      window.scrollTo(0, this.tabBodyHeight[index] + 1);
      switch(index) {
        case 0 :
           _paq.push(['trackEvent', '50.DetailPage', '50.10.Check', '50.10.Check']);
           break;
        case 1 :
           _paq.push(['trackEvent', '50.DetailPage', '50.11.Question', '50.11.Question']);
           break;
        case 2 :
           _paq.push(['trackEvent', '50.DetailPage', '50.12.AfterSale', '50.12.AfterSale']);
           break;
        case 3 :
           _paq.push(['trackEvent', '50.DetailPage', '50.13.Rate', '50.13.Rate']);
           break;
      }
    },
    // 计算各个标签内容高度
    calcuateTabBodyHeight() {
      let tabList = this.$refs.tabHook.getElementsByClassName("hook");
      for (let i = 0; i < tabList.length; i++) {
        let item = tabList[i];
        this.tabBodyHeight.push(tabList[i].offsetTop - 40);
      }
      // console.log(this.tabBodyHeight)
    },
    // 高亮当前滚动位置的标签
    highLightCurrentTab(scrollY) {
      let lastNavIndex = this.tabList.length - 1;
      if (scrollY < this.tabBodyHeight[0]) {
        this.tabIndex = 0;
        return;
      } else if (scrollY > this.tabBodyHeight[lastNavIndex]) {
        this.tabIndex = lastNavIndex;
        return;
      }
      for (let i = 0; i < this.tabBodyHeight.length; i++) {
        if (
          scrollY >= this.tabBodyHeight[i] &&
          scrollY <= this.tabBodyHeight[i + 1]
        ) {
          this.tabIndex = i;
        }
      }
    },
    // 滚动监听
    scrollEvent() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        let scrollY =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        this.highLightCurrentTab(Math.round(scrollY));
        // console.log(Math.round(scrollY))
        this.isBackShow = scrollY > 35 ? true : false;
      }, 20);
    },
    // 更多常见问题
    toProblemPage() {
      let scrollY =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      sessionStorage.setItem("scrollY", Math.round(scrollY));
      this.$router.push("/product/problem");
      _paq.push(['trackEvent', '50.DetailPage', '50.17.MoreQuestion', '50.17.MoreQuestion']);
    },
    // 立即购买
    handlePurchase() {
      _paq.push(['trackEvent', '50.DetailPage', '50.19.PlaceOrder', '50.19.PlaceOrder']);
      this.$router.push(`/product/order?skuId=${this.skuId}&serialNumber=${this.serialNumber}`);
    },
    // 评论列表
    getEvaluations() {
      getReviewList().then(res => {
        if (res.code === "0") {
          this.evaluationList = res.body;
        } else {
          this.$showToast(res.message);
        }
      });
    },
    // 查看大图
    showPicture(picUrl) {
      this.picShow = true;
      this.picUrl = picUrl;
    },
    // 播放视频
    videoPlay() {
      _paq.push(['trackEvent', '50.DetailPage', '50.16.WatchVideo', '50.16.WatchVideo']);
      let video = this.$refs.myVideo;
      video.play();
      video.controls = true;
      this.videoPlayShow = false;
    },
    // 联系客服
    callService() {
      _paq.push(['trackEvent', '50.DetailPage', '50.18.CustomService', '50.18.CustomService']);
    }
  },
  mounted() {
    this.utmSource = localStorage.getItem('utm_source') || this.$utm_source;
    this.utmMedium = localStorage.getItem('utm_medium') || this.$utm_medium;
    this.serialNumber = this.$route.query.serialNumber;
    if(!/^act_.*/.test(this.utmMedium)) {
        this.changeOneVisible = true;
    }
    if(this.$route.query.origin && this.$route.query.origin === 'orderPage') {
      this.isPayVisible = false;
    }
    this.getProductDetail();
    this.getEvaluations();
    this.wxShare();
    setTimeout(() => {
      this.calcuateTabBodyHeight();
      document.addEventListener("scroll", this.scrollEvent);
    }, 500);
    // new ClipBoard(".copy-button");
    let scrollH = sessionStorage.getItem("scrollY") - 0;
    if (scrollH) {
      setTimeout(() => {
        window.scrollTo(0, scrollH);
        sessionStorage.removeItem("scrollY");
      }, 200);
    }
    if(localStorage.getItem('serialNumber')) {
      this.serialNumberList = JSON.parse(localStorage.getItem('serialNumber'))
    }
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.scrollEvent);
  }
};
</script>
<style lang="scss" scoped>
.headerbar {
  position: fixed;
  top: 0;
  z-index: 3;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  // border-bottom: 1px solid #f2f2f2;
  background: transparent;
  .hd-button {
    position: absolute;
    width: 0.6rem;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    .iconfont {
      position: relative;
      left: 0.16rem;
      font-size: 0.6rem;
    }
  }
  .tabbar {
    display: flex;
    flex: 1;
    padding: 0 0.6rem;
    background: #fff;
    .tab-item {
      flex: 1;
      font-size: 0.28rem;
      text-align: center;
      span {
        padding-bottom: 10px;
      }
      &.active {
        font-weight: bolder;
        span {
          position: relative;
          &:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 100%;
            height: 3px;
            background: #f3c91e;
            border-radius: 3px;
          }
        }
      }
    }
  }
}
.banner-wrap {
  position: relative;
  .wrap-layer {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 2;
    width: 100%;
    height: 30%;
    box-shadow: 0 -1rem 1rem -0.4rem rgba(0, 0, 0, 0.8) inset;
    .tips {
      position: absolute;
      bottom: 0.3rem;
      left: 0.3rem;
      color: #fff;
      font-size: 0.28rem;
    }
    .indicator {
      position: absolute;
      bottom: 0.3rem;
      right: 0.3rem;
      padding: 2px 8px;
      color: #fff;
      font-size: 12px;
      letter-spacing: 2px;
      border-radius: 15px;
      background: rgba(0, 0, 0, 0.5);
    }
  }
  .back-button {
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    .iconfont {
      border-radius: 50%;
      color: #fff;
      font-size: 0.4rem;
      background: rgba(0, 0, 0, 0.6);
      &::before {
        position: relative;
        right: 0;
        top: 0;
      }
    }
  }
  .mint-swipe-item {
    width: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.device-info {
  padding: 0.3rem;
  background: #fff;
  .device {
    display: flex;
    padding: 0.2rem 0;
    .device-label {
      width: 1.2rem;
      line-height: 0.4rem;
      vertical-align: bottom;
    }
    .info-list {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      .info-item {
        margin-right: 0.12rem;
        margin-bottom: 0.1rem;
        padding: 2px 10px;
        border-radius: 0.08rem;
        border: 1px solid #f3c91e;
        background: #fff8d0;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  .imei {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 0;
    line-height: 0.4rem;
    .imei-info {
      font-size: 0.28rem;
      font-weight: bold;
      .tips {
        font-weight: 100;
        font-size: .2rem;
      }
    }
    .device-battery {
      margin-bottom: .2rem;
    }
    .last-one {
      img {
        width: 1.6rem;
      }
    }
    .imei-copy {
      .copy-button {
        width: 0.9rem;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
        text-align: center;
        font-size: 0.24rem;
        border-radius: 0.28rem;
        border: 1px solid #f3c91e;
        background: #fff;
      }
    }
  }
}
.device-base {
  padding: 0.3rem;
  margin-top: 0.2rem;
  background: #fff;
  .device-name {
    display: flex;
    justify-content: space-between;
    .chengse {
      font-size: .2rem;
      width: 1rem;
      height: .36rem;
      line-height: .36rem;
      margin-right: .1rem;
      padding: .06rem .12rem .06rem;
      border-radius: .2rem;
      font-size: .2rem;
      position: relative;
      top: -0.06rem;
    }
    .name {
      flex: 1;
      margin-bottom: 0.5rem;
      font-weight: bolder;
      font-size: 0.32rem;
    }
    .change-one {
      width: 1.73rem;
      height: .74rem;
      margin-left: 0.3rem;
      text-align: right;
      img {
        width: 1.91rem;
      }
    }
  }
  .device-price {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    .price {
      display: flex;
      align-items: baseline;
    }
    .current-price {
      margin-right: 0.2rem;
      font-weight: bold;
      font-size: 0.52rem;
      .font-rmb {
        font-size: 0.32rem;
        margin-right: 2px;
      }
      .amount {
        margin-left: -8px;
        font-size: 0.56rem;
      }
    }
    .new-price {
      label {
        margin-right: -2px;
      }
      .font-rmb {
        margin-right: -0.02rem;
      }
      .amount {
        text-decoration: line-through;
      }
    }
    .save {
      display: flex;
      min-width: 1.3rem;
      height: 0.44rem;
      line-height: 0.44rem;
      margin-left: 0.4rem;
      border-radius: 0.08rem;
      border: 1px solid #eb2828;
      position: relative;
      top: -0.1rem;
      overflow: hidden;
      .font-icon {
        height: 100%;
        padding: 0 0.08rem;
        color: #fff;
        font-size: 0.22rem;
      }
      .amount {
        padding-left: 0.02rem;
        color: #353535;
        font-size: 0.26rem;
        border-radius: 0 0.08rem 0.08rem 0;
        .font-rmb {
          font-size: 0.24rem;
        }
      }
    }
  }
  .device-new-price {
    display: flex;
    justify-content: space-between;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
    // .change-one {
    //     line-height: 1.4;
    //     padding: .02rem .06rem;
    //     border: 1px solid #e5e5e5;
    //     border-radius: 12px;
    //     .iconfont {
    //         padding: .075rem .06rem .04rem;
    //         border-radius: 50%;
    //         font-size: .20rem;
    //         vertical-align: middle;
    //     }
    //     span {
    //         font-size: .22rem;
    //     }
    // }
  }
}
.device-service {
  background: #f0f0f0;
  .service-list {
    display: flex;
    height: 0.7rem;
    line-height: 0.7rem;
    .service-item {
      flex: 1;
      text-align: center;
      position: relative;
      &:after {
        content: "";
        position: absolute;
        top: 0.2rem;
        right: 0;
        width: 1px;
        height: 0.3rem;
        background: #e5e5e5;
      }
      &:last-child {
        &:after {
          background: transparent;
        }
      }
      .icon {
        display: inline-block;
        width: 0.4rem;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
}
.pay {
  padding: 0.4rem;
  margin-top: 0.2rem;
  background: #fff;
  .pay-item {
    display: flex;
  }
  .pay-label {
    display: inline-block;
    width: 1.6rem;
  }
  .pay-way {
    margin-top: 10px;
    .payway-list {
      display: flex;
      .payway-item {
        margin-right: .3rem;
        &:last-child {
          margin-right: 0;
        }
        .icon {
          height: 0.35rem;
        }
      }
    }
  }
}
.quality-testing {
  padding: 10px;
  margin-top: 10px;
  background: #fff;
  .test-title {
    margin-bottom: 0.3rem;
    font-size: 0.32rem;
    font-weight: bolder;
  }
  .test-content {
    padding: 0.3rem 0.3rem 0 0.3rem;
    box-shadow: 0 0 3px 1px #eee;
    border-radius: 0.16rem;
  }
  .quality-result {
    .quality-inspector {
      position: relative;
      display: flex;
      padding-bottom: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f2f2f2;
      .inspector-avatar {
        width: 1.3rem;
        height: 1.3rem;
        margin-right: 0.3rem;
        border-radius: 50%;
        border: 1px solid #f2f2f2;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .inspector-name {
        margin-top: 0.1rem;
        .name {
          font-size: 0.28rem;
          margin: 0.1rem 0 0.1rem 0.1rem;
        }
        .title {
          padding: 1px 0.24rem;
          color: #fff;
          border-radius: 0.32rem;
          background: rgba(0, 0, 0, 0.8);
        }
      }
      .quality-auth {
        flex: 1;
        position: relative;
        img {
          position: absolute;
          right: 0;
          bottom: -0.3rem;
          width: 1.64rem;
          height: 1.64rem;
        }
      }
    }
    .test-tip {
      padding: 0.3rem;
      text-align: center;
      background: #fafafa;
      border-radius: 8px;
      font-weight: bolder;
      p {
        line-height: 1.4;
      }
    }
    .quality-detail {
      .detail-item {
        margin-bottom: 15px;
      }
    }
  }
  .state {
    .state-title {
      margin: 0.3rem auto;
      text-align: center;
    }
    .state-detail {
      display: flex;
      padding: 0.1rem 0;
      border-radius: 8px;
      background: #fffce3;
      .detail-col {
        flex: 1;
        padding: 0 0.3rem;
        border-right: 1px solid #fff;
        &:last-child {
          border-right: 0;
        }
        li {
          display: flex;
          margin: 0.2rem 0;
          &.state-repair {
            display: flex;
            flex-wrap: wrap;
            p {
              flex: 1;
            }
          }
          .item-name {
            width: 1.2rem;
            color: #999;
          }
        }
      }
    }
  }
  .function {
    padding-bottom: 15px;
    border-bottom: 1px solid #fafafa;
    .function-title {
      margin: 0.3rem auto;
      text-align: center;
    }
    .function-list {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        padding: 5px;
        text-align: center;
        .function-name {
          display: inline-block;
          width: 100px;
          text-align: left;
        }
        .icon {
          position: relative;
          right: 0.2rem;
          width: 0.28rem;
          height: 0.28rem;
        }
      }
    }
  }
  .params {
    .params-title {
      margin: 0.3rem auto;
      text-align: center;
    }
    .params-body {
      .params-group {
        .group-name {
          padding: 0;
          font-size: 0.24rem;
          vertical-align: middle;
          line-height: 20px;
          color: #f3c91e;
          font-weight: normal;
          &:before {
            content: "";
            display: inline-block;
            margin-right: 8px;
            margin-top: -4px;
            width: 2px;
            height: 10px;
            background: #f3c91e;
            vertical-align: middle;
          }
        }
        .params-list {
          display: flex;
          flex-wrap: wrap;
          padding: 10px;
          .params-item {
            width: 33%;
            margin-bottom: 10px;
            .param-name {
              color: #999;
            }
            p {
              margin-top: 5px;
            }
          }
        }
      }
    }
  }
}
.process {
  padding: 0.3rem;
  background: #fff;
  .process-img {
    img {
      width: 100%;
    }
  }
  .process-video {
    position: relative;
    margin-top: 0.4rem;
    .video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .video-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.1);
      img {
        width: 1rem;
        height: 1rem;
      }
    }
  }
}
.packing-list {
  margin-top: 0.2rem;
  padding-bottom: 0.3rem;
  background: #fff;
  .title {
    padding: 0.3rem 0;
    margin: 0.3rem 0.4rem;
    border-bottom: 1px solid #eee;
    h4 {
      margin-bottom: 0.2rem;
      font-weight: bolder;
      font-size: 0.32rem;
    }
  }
}
.problem {
  margin-top: 0.2rem;
  padding: 0.3rem;
  background: #fff;
  .p-title {
    font-size: 0.32rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #eee;
  }
  .problem-list {
    .problem-item {
      margin-top: 0.3rem;
      .item-questions {
        margin-bottom: 0.3rem;
        .q-text {
          display: inline-block;
          margin-left: 0.1rem;
          font-size: 0.28rem;
        }
      }
      .item-answer {
        padding-left: 0.5rem;
        font-size: 0.28rem;
        color: #999;
        p {
          line-height: 1.4;
        }
      }
    }
  }
  .p-more {
    margin-top: 0.3rem;
    padding-top: 0.3rem;
    border-top: 1px solid #eee;
    text-align: center;
    .show-more {
      font-weight: 0.28rem;
      border: none;
      background: none;
    }
  }
}
.after-sale {
  margin-top: 0.2rem;
  padding: 0.3rem;
  background: #fff;
  .s-header {
    padding-bottom: 0.2rem;
    margin-bottom: 0.3rem;
    font-size: 0.32rem;
    border-bottom: 1px solid #eee;
  }
}
.evaluation {
  margin: 0.2rem 0;
  padding: 0.3rem;
  background: #fff;
  .ev-header {
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #f2f2f2;
    h4 {
      font-size: 0.32rem;
    }
  }
  .ev-body {
    margin-top: 0.3rem;
    .evaluation-item {
      margin-top: 0.3rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid #f2f2f2;
      &:last-child {
        padding-bottom: 0;
        border-bottom: 0;
      }
      .item-header {
        .user {
          font-weight: bolder;
          margin-bottom: 0.1rem;
        }
        .device {
          display: flex;
          justify-content: space-between;
        }
      }
      .item-body {
        margin-top: 0.3rem;
        .ev-content {
          margin: 0.3rem 0;
        }
        .ev-pic-list {
          display: flex;
          flex-wrap: wrap;
          .pic {
            width: 1.2rem;
            height: 1.2rem;
            margin-right: 0.2rem;
            &.last-child {
              margin-right: 0;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
.footbar {
  position: fixed;
  left: 0;
  bottom: -1px;
  display: flex;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  border-top: 1px solid #eee;
  background: #fcfcfc;
  > div {
    text-align: center;
  }
  .kefu {
    flex: 2;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 1rem;
    line-height: 1;
    padding-top: 0.1rem;
    &:after {
      content: "";
      position: absolute;
      top: 15px;
      right: 0;
      width: 0.5px;
      height: 20px;
      background: #e5e5e5;
    }
    .iconfont {
      margin-bottom: 5px;
      font-size: 0.4rem;
    }
  }
  .price {
    flex: 3;
    font-weight: bold;
    .amount {
      margin-left: 0;
      font-size: 0.52rem;
    }
    .font-rmb {
      font-size: 0.32rem;
    }
  }
  .button {
    flex: 3;
    .purchase-button {
      width: 100%;
      height: 100%;
      color: #fff;
      font-size: 16px;
      border: 0;
      outline: none;
      background: #eb2828;
    }
  }
}
</style>
