<template>
    <section class="page">
        <topbar title="支付页面"></topbar>
        <!-- 订单信息 -->
        <div class="card order-info">
            <div class="card-item">
                <label style="font-size: .32rem;">订单详情</label>
            </div>
            <div class="card-item order-name">
                <label>商品名称：</label><span>{{ orderInfo.skuName}}</span>
            </div>
            <div class="card-item order-amount">
                <label>订单总额：</label>
                <span class="amount text-red"><strong class="youpin">优品价</strong><i class="font-rmb">￥</i>{{orderInfo.totalPrice}}</span>
            </div>
            <div class="card-item order-tips">
                <p>请您在20分钟内完成支付，否则订单将自动关闭。</p>
                <p class="count-down text-red text-right">{{leftTime.h}}:{{leftTime.m}}:{{leftTime.s}}</p>
            </div>
        </div>
        <!-- 支付方式 -->
        <div class="card pay-way">
            <div class="card-item">
                <label style="font-size: .32rem;">付款方式</label>
            </div>
            <div class="card-item pay-item" v-for="(item, index) in payMethodList" :key="index" @click="payMethodChange(item)">
                <div class="pay-name">
                    <img :src="'//imgs.kjershou.com/static/pay/'+item.methodIcon" class="pay-icon">
                    <span class="pay-text">{{item.methodName}}</span>
                </div>
                <div class="item-button">
                    <img v-if="methodCode === item.methodCode" src="@/assets/img/icon-selected.png" class="icon-selected">
                    <!-- <i class="iconfont icon-fanhui-you"></i> -->
                </div>
            </div>
        </div>
        <!-- 分期列表 -->
        <div v-if="termsList.length > 0" class="terms">
            <!-- <label class="title">选择期数</label> -->
            <ul class="term-list">
                <li v-for="(item, index) in termsList" :key="index" class="term-item" :class="{active: item.txnTerms === selectedTerm.txnTerms}">
                    <div @click="handleSelectTerm(item)">
                        <p class="item-row row1">
                            <!-- (含手续费<i class="font-rmb">￥</i>{{item.poundage}}/期) -->
                            {{item.txnTerms}}期总额：<i class="font-rmb">￥</i><strong>{{item.totalPrice}}</strong>
                        </p>
                        <p class="item-row row-2">
                            <i class="font-rmb">￥</i><strong>{{item.price}}</strong>
                            <span>&times;{{item.txnTerms}}期</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
        <!-- 支付按钮 -->
        <div style="height: 1rem"></div>
        <div class="footerbar">
            <button class="pay-button" @click="handlePay">确认支付</button>
        </div>
        <!-- 模态框 -->
        <!-- <fixed-modal :visible="termsVisible" @close="termsVisible = false">
            <div class="terms-box">
                <ul class="terms-list">
                    <li v-for="(item, index) in termsList" :key="index" class="terms-item" :class="{'active': item.txnTerms === selectedTerm.txnTerms}">
                        <div class="terms-row" @click="handleSelectTerm(item)">
                            <i class="font-rmb">￥</i><strong>{{item.price}}</strong>
                            <span>&times; {{item.txnTerms}}期</span>
                            (含手续费<i class="font-rmb">￥</i>{{item.poundage}}/期)
                        </div>
                    </li>
                </ul>
                <div class="terms-button">
                    <button class="cancel-button" @click="termsVisible = false">取消</button>
                    <button class="confirm-button" @click="handleLbfPay">支付</button>
                </div>
            </div>
        </fixed-modal> -->
        <!-- 支付宝表单 -->
        <div v-if="aliPayForm" ref="aliPayForm" v-html="aliPayForm"></div>
    </section>
</template>
<script>
import fixedModal from '@/components/fixed-modal';
import { getOrderInfo, getPaymentMethod, getLbfPaymentPrice, doPayment } from '@/api';

export default {
    name: 'pay',
    components: {
        fixedModal
    },
    data() {
        return {
            tradeNo: '',
            channelCode: '',
            openId: '',
            orderInfo: {},
            endTime: 0,
            leftTime: {
                h: '00',
                m: '00',
                s: '00',
            },
            payMethodList: [],
            methodCode: '',
            aliPayForm: '',
            termsList: [],
            selectedTerm: {},
            termsVisible: false,
        }
    },
    methods: {
        // 倒计时
        countTime() {
            let that = this;
            let now = new Date().getTime();
            // let date = new Date();
            // let endTime = `2018-${date.getMonth()+1}-${date.getDate()+1}`;
            // let end = new Date(endTime);
            let leftTime = this.endTime - now;
            if(leftTime >= 0) {
                let h = Math.floor(leftTime/1000/60/60%24),
                    m = Math.floor(leftTime/1000/60%60),
                    s = Math.floor(leftTime/1000%60);
                that.leftTime.h = h >= 10 ? h : '0'+h;
                that.leftTime.m = m >= 10 ? m : '0'+m;
                that.leftTime.s = s >= 10 ? s : '0'+s;
            } else {
                clearTimeout(this.countTime);
                this.$showToast('支付超时，请重新下单', 2000);
                this.$router.push('/index');
                return;
            }
            setTimeout(this.countTime, 1000)
        },
        // 判断是否微信环境
        isWeiXin() {
            const ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
        // 获取openId
        getOpenId() {
            let currentPath = window.location.href;
            window.location.href = `${process.env.API_ROOT}/api/v1/wxauth/step1?red_url=${encodeURIComponent(currentPath)}`;
        },
        // 获取订单信息
        getOrder() {
            let data = {
                tradeNo: this.tradeNo,
            }
            getOrderInfo(data).then(res => {
                if(res.code === '0') {
                    this.orderInfo = res.body;
                    if(this.orderInfo.time > new Date().getTime()) {
                        this.endTime = this.orderInfo.time;
                        this.countTime()
                    } else {
                       this.$showToast('支付超时，请重新下单', 2000);
                       this.$router.push('/index');
                    }
                } else if(res.code === '201005') {
                    this.$showToast('支付超时，请重新下单', 2000);
                    setTimeout(() => {
                        this.$router.push('/index')
                    }, 1000)
                } else if(res.code === '201006') {
                    this.$showToast('该订单已支付完成');
                    setTimeout(() => {
                        this.$router.push('/index')
                    }, 1000)
                } else {
                    this.$showToast(res.message)
                }
            })
        },
        // 获取支付方式
        getPaymentMethodList() {
             getPaymentMethod().then(res => {
                if(res.code === '0') {
                    this.payMethodList = res.body;
                    this.methodCode = res.body[0].methodCode;
                    res.body.forEach(item => {
                        if(item.methodCode === 'lbf_pay_mobile') {
                            this.getLbfPayInfo()
                        }
                    })
                } else {
                    this.$toast({
                        message: res.message
                    })
                }
            })
        },
        // 获取乐百分支付期数
        getLbfPayInfo() {
            let data = {
                tradeNo: this.tradeNo,
                channelCode: 'lbf_pay_mobile'
            }
            getLbfPaymentPrice(data).then(res => {
                if(res.code === '0') {
                    this.termsList = res.body;
                    // this.selectedTerm = res.body[0];
                } else {
                    this.$showToast(res.message)
                }
            })
        },
        // 更换支付方式
        payMethodChange(item) {
            if(item.methodCode === 'lbf_pay_mobile') return;
            this.methodCode = item.methodCode;
            this.selectedTerm = {};
        },
        // 选择期数
        handleSelectTerm(item) {
            if(item.txnTerms === this.selectedTerm.txnTerms) return;
            this.selectedTerm = item;
            this.methodCode = 'lbf_pay_mobile';
        },
        // 微信支付
        weiXinPay(res) {
            // alert(JSON.stringify(res))
            WeixinJSBridge.invoke('getBrandWCPayRequest', {
                    "appId": res.appId, //公众号名称，由商户传入
                    "timeStamp": res.timeStamp, //时间戳
                    "nonceStr": res.nonceStr, //随机串
                    "package": res.package,
                    "signType": res.signType, //微信签名方式：
                    "paySign": res.paySign, //微信签名
                }, (res) => {
                    // alert(JSON.stringify(res))
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        this.$showToast('支付成功');
                        this.$router.push('/product/paysuccess')
                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        this.$showToast('支付已取消');
                    } else if (res.err_msg == "get_brand_wcpay_request:fail") {
                        this.$showToast('支付失败');
                    }
                }
            );
        },
        // 选择支付处理
        handlePay() {
            if(this.orderInfo.time < 0) {
                this.$showToast('支付超时，请重新下单')
                return;
            }
            let data = {
                tradeNo: this.tradeNo,
                channelCode: this.methodCode,
                openId: this.openId,
                txnTerms: this.selectedTerm.txnTerms
            }
            if(data.txnTerms) {
                data.channelCode = 'lbf_pay_mobile'
            }
            switch (this.methodCode) {
                case 'ali_pay_mobile':
                    _paq.push(['trackEvent', '70.PayPage', '70.10.AliPay', '70.10.AliPay']);                                                                  
                    break;
                case 'wx_pay_h5':
                    _paq.push(['trackEvent', '70.PayPage', '70.11.WechatPay', '70.11.WechatPay']);                                                                  
                    break;
                case 'wx_pay_public':
                    _paq.push(['trackEvent', '70.PayPage', '70.11.WechatPay', '70.11.WechatPay']);                                                                  
                    break;
                default:
                    break;
            }
            doPayment(data).then(res => {
                if(res.code === '0') {
                    let resBody = res.body;
                    if (resBody.aliMobilePay) {  //支付方式：ali_pay_mobile
                        this.aliPayForm = resBody.aliMobilePay;
                    } else if (resBody.appId) {  //支付方式：wx_pay_public
                        this.weiXinPay(resBody)
                    } else if (resBody.wxPayMwebUrl) {  //支付方式：wx_pay_h5
                        window.location.href = resBody.wxPayMwebUrl;
                    } else if (resBody.lbfUrl) { // 乐百分分期
                        window.location.href = resBody.lbfUrl;
                    } else {
                        // 支付方式：wx_pay_open_app_kuangji
                        console.log('支付方式：wx_pay_open_app_kuangji')
                    }
                } else {
                    this.$showToast(res.message)
                }
            }).then(_ => {
                if(this.aliPayForm) {
                    this.$refs.aliPayForm.querySelector('form').submit();
                }
            })
        }
    },
    mounted() {
        document.title = '支付页面';
        this.tradeNo = this.$route.query.tradeNo;
        this.openId = this.$route.query.openid || localStorage.getItem('openId') || '';
        if(this.tradeNo) {
            this.getOrder();
            this.getPaymentMethodList();
        } else {
            this.$showToast('页面有误！');
            return;
        }
        if(this.openId) {
            localStorage.setItem('openId', this.openId)
        } else {
            if(this.isWeiXin()) {
                this.getOpenId();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .page {
        padding: .2rem .3rem 0;
    }
    .card {
        width: 100%;
        padding: 0 .3rem;
        margin-bottom: .2rem;
        border-radius: 8px;
        box-shadow: 1px 1px 1px #f2f2f2;
        background: #fff;
        .card-item {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            border-bottom: 1px solid #f2f2f2;
            &:last-child {
                border-bottom: 0;
            }
            label {
                font-weight: bolder;
                font-size: .28rem;
            }
        }
       
    }
    .order-info {
        .order-name {
            display: flex;
            justify-content: flex-start;
            label {
                width: 1.6rem;
            }
            span {
                flex: 1;
                font-size: .26rem;
            }
        }
        .order-amount {
            padding-right: .2rem;
            font-weight: bolder;
            font-size: .36rem;
            .font-rmb {
                font-size: .24rem;
            }
            .youpin {
                font-weight: normal;
                font-size: .22rem;
                font-style: italic;
                margin-right: .1rem;
            }
        }
        .order-tips {
            display: block;
            font-size: .28rem;
            border-bottom: 0;
            .count-down {
                padding: .2rem .2rem 0 0;
                font-size: .28rem;
                font-weight: bolder;
            }
        }
    }
    .pay-way {
        .pay-item {
            padding: .3rem 0;
            .pay-icon {
                width: .4rem;
                height: .4rem;
                vertical-align: middle;
                margin-right: .4rem;
            }
            .pay-text {
                font-size: .32rem;
                vertical-align: middle;
            }
            .item-button {
                .icon-selected {
                    width: .3rem;
                    height: .3rem;
                }
            }
        }
    }
    .terms {
        .title {
            display: inline-block;
            margin-bottom: .3rem;
            font-size: .28rem;
            font-weight: bolder;
        }
        .term-list {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .term-item {
                width: 45%;
                padding: .2rem;
                margin-right: .2rem;
                text-align: center;
                background: #ddd;
                border-radius: .16rem .16rem 0 0;
                position: relative;
                &:last-child {
                    margin-right: 0;
                }
                .item-row {
                    line-height: 1.6;
                    font-size: .22rem;
                }
                strong {
                    font-size: .26rem;
                }
                &.active {
                    color: #fff;
                    background: #f3c91e;
                }
            }
        }
    }
    .footerbar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        .pay-button {
            width: 100%;
            height: 100%;
            color: #fff;
            font-size: .28rem;
            background: #eb2828;
        }
    }
    .terms-box {
        background: #fff;
        .terms-list {
            .terms-item {
                height: 1rem;
                line-height: 1rem;
                padding: 0 .3rem;
                font-size: .24rem;
                border-bottom: 1px solid #f0f0f0;
                &:last-child {
                    border-bottom: 0;
                }
                &.active {
                    background: #f3c91e;
                }
            }
            .terms-row {
                text-align: center;
            }  
        }
        .terms-button {
            display: flex;
            button {
                flex: 1;
                width: 100%;
                margin: 0;
                padding: .3rem;
                background: #ddd;
            }
            .confirm-button {
                color: #fff;
                background: #eb2828;
            }
        }
    }
</style>
