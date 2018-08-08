<template>
    <section class="page">
        <topbar title="确认订单"></topbar>
        <!-- 收货人 -->
        <div v-show="addressList.length > 0" class="card address-card" :class="{'text-gray': addressFormVisible === true}" @click="handleShowAddress">
           <div class="addr-icon">
               <img src="@/assets/img/icon-location.png">
           </div>
           <div class="addr-content">
               <div class="consignee">
                   <span class="name ellipsis">{{currentAddress.contact}}</span>
                   <span class="phone">{{currentAddress.mobile}}</span>
               </div>
               <div class="address">
                   <!-- <label>地址：</label> -->
                   <span>{{currentAddress.regionName + currentAddress.address}}</span>
               </div>
           </div>
           <div class="addr-more">
               <i class="iconfont icon-fanhui-you"></i>
           </div>
        </div>
        <!-- 新增收货地址 -->
        <div class="card address-form-card" v-show="addressFormVisible">
            <div class="card-item address-header">
                <label class="card-item-title">收货地址</label>
                <i class="form-close" v-if="addressList.length > 0" @click.stop="cancelNewAddress">取消</i>
            </div>
            <div class="address-form">
                <div class="form-item">
                    <label class="form-item-label">收货人</label>
                    <div class="form-item-input">
                        <input v-model.trim="addressForm.contact" class="form-input" type="text" placeholder="请输入收货人姓名">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">手机号</label>
                    <div class="form-item-input">
                        <input v-model.trim="addressForm.mobile" class="form-input" type="text" maxlength="11" placeholder="请输入正确的手机号">
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">所在地区</label>
                    <div class="form-item-input" @click="cityPickerVisible = true">
                        <span v-if="selectedAddress">{{this.selectedAddress}}</span>
                        <span v-else class="text-gray">请选择所在地区</span>
                        <i class="iconfont icon-fanhui-you"></i>
                    </div>
                </div>
                <div class="form-item">
                    <label class="form-item-label">详细地址</label>
                    <div class="form-item-input">
                        <input v-model.trim="addressForm.detailedAddress" class="form-input" type="text" placeholder="请输入详细收货地址">
                    </div>
                </div>
            </div>
        </div>
        <!-- 订单详情 -->
        <div class="card order-card">
            <div class="order-title">订单</div>
            <div class="order-content">
                <div class="order-pic">
                    <img :src="orderInfo.skuUrl">
                </div>
                <div class="order-detail">
                    <div class="d-name">{{orderInfo.skuName}}</div>
                    <div class="d-tag"> 
                        <span>{{orderInfo.origin}}</span>
                        <span v-for="item in orderInfo.repair" :key="item">{{item}}</span>
                    </div>
                    <div v-show="orderInfo.imei" class="d-imei">
                        <label>IMEI：</label>
                        <span>{{orderInfo.imei}}</span>
                    </div>
                </div>
            </div>
            <div class="order-price text-red">
                <span><strong class="youpin">优品价</strong><i class="font-rmb">￥</i>{{orderInfo.price}}</span>
            </div>
        </div>
        <!-- 优惠券 留言 -->
        <div class="card message-card">
            <div v-show="couponSelectVisible" class="coupon card-item">
                <label>优惠券</label>
                <div class="selected-coupon">
                    <!-- <div v-if="!couponInfo.acodeId" class="text-gray">
                        <span>没有可使用的优惠券</span>
                        <i class="iconfont icon-fanhui-you"></i>
                    </div> -->
                    <div class="hasCoupon" @click.stop="handleShowCoupon">
                        <span v-if="discount <= 0">选择优惠券</span>
                        <span v-else>
                            <span>使用优惠券</span>
                            <i class="amount text-red">-{{discount}}元</i>
                        </span>
                        <i class="iconfont icon-fanhui-you"></i>
                    </div>
                </div>
            </div>
            <div class="express card-item">
                <label for="">配送方式</label>
                <div>顺丰快递</div>
            </div>
            <div class="message">
                <textarea rows="5" v-model="remark" placeholder="用户留言（最多50个字）" maxlength="50" class="m-textarea"></textarea>
            </div>
        </div>
        <!-- 固定底部 -->
        <div class="footbar">
            <div class="total">
                <div class="price">
                    <span class="text">总计：</span>
                    <span class="amount text-red"><i class="font-rmb">￥</i>{{orderInfo.price - discount}}</span>
                </div>
                <div class="discount text-gray">
                    <span>已优惠{{discount}}元</span>
                </div>
            </div>
            <div class="purchase">
                <button class="purchase-button bg-red" @click="handleCommitOrder">提交订单</button>
            </div>
        </div>
        <!-- 选择优惠券 -->
        <fixed-modal :visible="couponVisible" @close="couponVisible = false">
            <div class="coupon-panel">
                <div class="panel-header">
                    <h3 class="panel-title">优惠券</h3>
                    <button class="close-button" @click.stop="couponVisible = false">取消</button>
                </div>
                <div class="panel-body">
                    <div class="coupon-exchange">
                        <input type="text" v-model.trim="acode" placeholder="兑换A码" class="ex-input">
                        <button class="ex-button" @click="handleExchange">兑换</button>
                    </div>
                    <!-- 优惠券 -->
                    <!-- <coupon v-if="couponInfo.acodeId" :data="couponInfo" @couponClick="handleCouponClick"></coupon> -->
                    <div v-if="couponList.length > 0" class="coupon-box">
                        <div v-for="(item, index) in couponList" :key="index" class="coupon-item">
                            <coupon v-if="item.idAcode" :data="item" :disabled="(Number(orderInfo.price) < Number(item.useLine))" @couponClick="handleCouponClick"></coupon>
                        </div>
                    </div>
                    <div v-else class="coupon-none">暂无可用优惠券</div>
                    <!-- <div v-if="couponList.length > 0" class="show-more">
                        <button class="more-button text-gray" @click.stop="handleShowMore">查看更多优惠券</button>
                    </div> -->
                </div>
            </div>
        </fixed-modal>
        <!-- 收货地址列表 -->
        <fixed-modal :visible="addressVisible" @close="addressVisible = false">
            <div class="address-box">
                <div class="address-list">
                    <div class="card address-card" v-for="(item, index) in addressList" :key="index" @click="handleSelectedAddress(item)">
                        <div class="addr-icon">
                            <!-- <i  class="iconfont icon-duigou icon-selected text-yellow"></i> -->
                            <img v-if="currentAddress.id === item.id" src="@/assets/img/icon-selected.png" class="icon-selected">
                            <i v-else class="icon-unselected"></i>
                        </div>
                        <div class="addr-content">
                            <div class="consignee">
                                <span class="name ellipsis">{{item.contact}}</span>
                                <span class="phone">{{item.mobile}}</span>
                            </div>
                            <div class="address">
                                <!-- <label></label> -->
                                <span>{{item.regionName + item.address}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="address-add">
                    <button class="add-button bg-yellow" @click="useNewAddress">使用新的收货地址</button>
                </div>
            </div>
        </fixed-modal>
        <!-- 省市区选择 -->
        <modal-layer :visible="cityPickerVisible" @close="cityPickerVisible = false">
            <div class="picker-wrap" @touchmove.prevent>
                <div class="picker-button">
                    <button class="btn btn-confirm bg-yellow" @click.stop="confirmSelectedCity">确定</button>
                </div>
                <picker 
                    ref="regionPicker"
                    v-model="value" 
                    :data="regionList" 
                    :columns="3"
                    @on-change="onRegionChange">
                </picker>
                <!-- <mt-picker v-if="regionList.length > 0" :slots="addressSlots" value-key="name" @change="onValuesChange">
                </mt-picker> -->
            </div>
        </modal-layer>
    </section>
</template>
<script>
import modalLayer from '@/components/modal-layer';
import fixedModal from '@/components/fixed-modal';
import coupon from '@/components/coupon';
import { getAdvanceOrder, getRegionList, choiceCoupon, obtainCoupon, getAcodeList, getAddersslist, saveUserAddress, createOrder } from '@/api';
export default {
    name: 'Order',
    components: {
        modalLayer,
        fixedModal,
        coupon,
    },
    data() {
        return {
            value: [],
            userId: '',
            productId: '',
            serialNumber: '',
            remark: '',
            currentAddress: {},
            addressFormVisible: false,
            addressList: [],
            orderInfo: {},
            discount: 0,
            couponInfo: {},
            couponId: '',
            addressVisible: false,
            couponVisible: false,
            modalVisible: false,
            acode: '',
            buttonText: '获取验证码',
            buttonDisabled: false,
            cityPickerVisible: false,
            regionCodeTemp: '',
            selectedAddressTemp: '',
            selectedAddress: '',
            regionList: [],
            addressSlots: [
                {
                  flex: 1,
                  values: [],
                  defaultIndex: 0,
                  className: 'slot1',
                  textAlign: 'center'
                }, {
                  divider: true,
                  content: '-',
                  className: 'slot2',
                  textAlign: 'center',
                }, {
                  flex: 1,
                  values: [],
                  defaultIndex: 0,
                  className: 'slot3',
                  textAlign: 'center'
                }, {
                  divider: true,
                  content: '-',
                  className: 'slot4',
                  textAlign: 'center',
                }, {
                  flex: 1,
                  values: [],
                  defaultIndex: 0,
                  className: 'slot5',
                  textAlign: 'center'
                }
            ],
            addressForm: {
                contact: '',
                mobile: '',
                regionCode: '',
                detailedAddress: '',
            },
            couponList: [],
            couponSelectVisible: false,
            utmSource: '',
            utmMedium: '',
        }
    },
    methods: {
        // 获取订单详情
        getOrderInfo() {
            let data = {
                serialNumber: this.serialNumber,
                utmSource: this.utmSource,
                utmMedium: this.utmMedium
            }
            getAdvanceOrder(data).then(res => {
                if(res.code == '0') {
                    this.orderInfo = res.body;
                    this.orderInfo.skuUrl = this.orderInfo.skuUrl + '@165w_165h_1e_1c.jpg';
                    this.getAddersslists()
                    this.getCouponList()
                    if(!/^act_.*/.test(this.utmMedium)) {
                        this.getOptimalCoupon()
                    }
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取省市区
        getRegions() {
            getRegionList().then(res => {
                if(res.code === '0') {
                    this.regionList = res.body;
                    // this.addressSlots[0].values = res.body;
                    // this.addressSlots[2].values = res.body[0].cityResponseList;
                    // this.addressSlots[4].values = res.body[0].cityResponseList[0].districtResponseList;
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                 console.log(err)
            })
        },
        // 获取收货地址列表
        getAddersslists() {
            getAddersslist().then(res => {
                this.addressList = [];
                if(res.code === '0') {
                    this.addressList = res.body;
                    if(this.addressList.length !== 0) {
                        let defaultAddress = this.addressList.filter(addr => addr.isDefault === 1);
                        if(defaultAddress.length === 0) {
                            this.currentAddress = this.addressList[0];
                        } else {
                            this.currentAddress = defaultAddress[0];
                        }
                    } else {
                        this.addressFormVisible = true;
                        this.getRegions();
                    }
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取优惠券列表
        getCouponList() {
            let params = '1';
            getAcodeList(params).then(res => {
                if(res.code === '0') {
                    this.couponList = res.body;
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取优惠券
        getOptimalCoupon() {
            let data = {
                skuId: Number(this.productId),
                serialNumber: this.serialNumber
            }
            choiceCoupon(data).then(res => {
                if(res.code === '0') {
                    if(res.body) {
                        this.couponInfo = res.body;
                        this.couponId= this.couponInfo.acodeId;
                        this.discount = this.couponInfo.acodeValue || 0;
                    }
                } else {
                    this.$showToast(res.message);
                }
            }).catch(err => {
                this.$showToast(err)
            })
        },
        // 显示更多收货地址列表
        handleShowAddress() {
            this.addressVisible = true;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.10.ListAddress', '60.10.ListAddress']);
        },
        // 选择收货地址
        handleSelectedAddress(item) {
            if(this.currentAddress.id === item.id) return;
            this.currentAddress = item;
            this.addressVisible = false;
            this.addressFormVisible = false;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.11.SelectOldAddress', '60.11.SelectOldAddress']);
        },
        // 查看优惠券列表
        handleShowCoupon() {
            this.couponVisible = true;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.14.ListCoupon', '60.14.ListCoupon']);
        },
        // 兑换优惠券
        exchangeCoupon() {
            let data = {
                acode: this.acode,
            }
            obtainCoupon(data).then(res => {
                if(res.code === '0') {
                    this.$showToast('兑换成功')
                    this.acode = '';
                    this.getCouponList();
                } else {
                    this.$showToast(res.message)
                }
            })
        },
        // 点击兑换
        handleExchange() {
            if(!this.acode) {
                this.$showToast('请输入兑换A码');
                return;
            }
            this.exchangeCoupon()
        },
        // 选中优惠券
        handleCouponClick(coupon) {
            if(coupon.useLine >= this.orderInfo.price) {
                this.$showToast('该优惠券不可使用哦^_^');
                return;
            }
            this.couponId= coupon.idAcode;
            this.discount = coupon.value;
            this.couponVisible = false;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.15.SelectCoupon', '60.15.SelectCoupon']);
        },
        // 更多优惠券
        handleShowMore() {
            this.$router.push('/mycenter/coupon');
        },
        // 使用新地址
        useNewAddress() {
            if(this.regionList.length === 0) {
                this.getRegions();
            }
            this.addressFormVisible = true;
            this.addressVisible = false;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.12.UseNewAddress', '60.12.UseNewAddress']);
        },
        //  取消使用新地址
        cancelNewAddress() {
            this.addressFormVisible = false;
            _paq.push(['trackEvent', '60.ConfirmPage', '60.13.CancelNewAddress', '60.13.CancelNewAddress']);
        },
        // 新增收货地址
        addAddress() {
            if(this.addressForm.contact == '') {
                this.$showToast('请输入收货人姓名');
                return;
            } else if(!/^1[3-9][\d]{9}$/.test(this.addressForm.mobile)) {
                this.$showToast('请输入正确手机号');
                return;
            } else if(!this.selectedAddress) {
                this.$showToast('请选择所在地区');
                return;
            } else if(!this.addressForm.detailedAddress) {
                this.$showToast('请输入详细地址');
                return;
            }
            let data = {
                data: {
                    contact: this.addressForm.contact,
                    mobile: this.addressForm.mobile,
                    idRegion: this.addressForm.regionCode,
                    address: this.addressForm.detailedAddress,
                }
            }
            saveUserAddress(data).then(res => {
                if(res.code === '0') {
                    this.currentAddress.id = res.body;
                    this.submitOrder()
                } else {
                    this.$showToast(res.message)
                }
            })
        },
        // 提交按钮点击
        handleCommitOrder() {
            if(this.addressFormVisible) {
                this.addAddress()
            } else {
                this.submitOrder()
            }
            _paq.push(['trackEvent', '60.ConfirmPage', '60.16.SubmitOrder', '60.16.SubmitOrder']);
        },
        // 提交订单
        submitOrder() {
            let data = {
                utmMedium: this.utmMedium,
                utmSource: this.utmSource,
                imei: this.orderInfo.imei,
                num: 1,
                acodeId: this.couponId,
                remark: this.remark,
                addressId: this.currentAddress.id,
                serialNumber: this.serialNumber,
            }
            createOrder(data).then(res => {
                if(res.code === '0') {
                    this.$router.push(`/product/pay?tradeNo=${res.body.tradeNo}`)
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                 console.log(err)
            })
        },
        onRegionChange(val) {
            this.selectedAddressTemp = this.$refs.regionPicker.getNameValues();
            this.regionCodeTemp = val[2];

        },
        // 地址选择变化
        onValuesChange(picker, values) {
            picker.setSlotValues(1, values[0].cityResponseList);
            picker.setSlotValues(2, values[1].districtResponseList);
            this.selectedAddressTemp = values[0].name + values[1].name + values[2].name;
            this.regionCodeTemp = values[2].id;
        },
        // 确定地址选择
        confirmSelectedCity() {
            this.addressForm.regionCode = this.regionCodeTemp;
            this.selectedAddress = this.selectedAddressTemp;
            this.cityPickerVisible = false;
        }
    },
    created() {
        this.utmSource = localStorage.getItem('utm_source') || this.$utm_source;
        this.utmMedium = localStorage.getItem('utm_medium') || this.$utm_medium;
        if(!/^act_.*/.test(this.utmMedium)) {
            this.couponSelectVisible = true;
        }
        this.productId = this.$route.query.skuId;
        this.serialNumber = this.$route.query.serialNumber;
        if(this.serialNumber) {
            this.getOrderInfo()
        } else {
            this.$showToast('页面有误！')
        }
        this.getRegions()
    }
}
</script>
<style lang="scss" scoped>
    .page {
        padding: 0.3rem 0.3rem 0.98rem 0.3rem;
    }
    .card {
        width: 100%;
        padding: .3rem;
        margin-bottom: .2rem;
        border-radius: 8px;
        box-shadow: 1px 1px 1px #f2f2f2;
        background: #fff;
        &:last-child {
            margin-bottom: 0;
        }
        .card-item {
            display: flex;
            justify-content: space-between;
            padding: 0.25rem 0;
            border-bottom: 1px solid #f2f2f2;
            &:last-child {
                border-bottom: 0;
            }
            .card-item-title {
                font-weight: bolder;
                font-size: .28rem;
            }
        }
        .form-item {
            display: flex;
            height: .8rem;
            line-height: .8rem;
            .form-item-label {
                width: 1.4rem;
            }
            .form-item-input {
                display: flex;
                justify-content: space-between;
                flex: 1;
                overflow: hidden;
                border-bottom: 1px solid #e5e5e5;
                input {
                    width: 100%;
                }
            }
            .form-input {
                font-size: .24rem;
                border: none;
            }
            .item-code {
                display: flex;
                justify-content: space-between;
                .form-input {
                    width: 50%;
                }
                .send-button {
                    height: .4rem;
                    padding: 0 .2rem;
                    line-height: .4rem;
                    margin-top: .2rem;
                    border: none;
                    font-size: .24rem;
                    border-radius: .2rem;
                }
            }
        }
    }
    .address-card {
        display: flex;
        .addr-icon {
            width: .32rem;
            height: .32rem;
            line-height: .32rem;
            margin-right: .3rem;
            img {
                width: .21rem;
            }
            .icon-selected {
                width: .32rem;
                height: .32rem;
            }
            .icon-unselected {
                display: inline-block;
                width: .32rem;
                height: .32rem;
                border: 1px solid #f0f0f0;
                border-radius: 50%;
                background: #ededed;
            }
        }
        .addr-content {
            flex: 1;
            overflow: hidden;
            .consignee {
                margin-bottom: .2rem;
                font-size: .32rem;
                font-weight: bolder;
                .name {
                    display: inline-block;
                    max-width: 2rem;
                    margin-right: .1rem;
                    vertical-align: bottom;
                }
            }
            .address {
                display: flex;
                width: 100%;
                font-size: .28rem;
                label {
                    width: .9rem;
                }
                span {
                    flex: 1;
                }
            }
        }
        .addr-more {
            position: relative;
            width: 0.32rem;
            text-align: center;
            i {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.32rem;
            }
        }
    }
    .address-form-card {
        .address-header {
            padding-top: 0;
            .form-close {
               font-size: .24rem;
            }
        }
    }
    .order-card {
        padding: 0.2rem;
        .order-title {
            font-size: 0.32rem;
            font-weight: bolder;
        }
        .order-content {
            display: flex;
            padding: 0.2rem 0;
            margin-top: .25rem;
            border-top:1px solid #f2f2f2;
            border-bottom: 1px solid #f2f2f2;
            .order-pic {
                width: 1.65rem;
                height: 1.65rem;
                margin-right: .2rem;
            }
            .order-detail {
                flex: 1;
                > div {
                    margin-bottom: 0.2rem;
                    &:last-child {
                        margin-bottom: 0;
                    }
                }
                .d-name {
                    font-size: .28rem;
                    font-weight: bolder;
                }
                .d-tag {
                    display: flex;
                    flex-wrap: wrap;
                    margin-bottom: .05rem;
                    span {
                        white-space: nowrap;
                        padding: 2px 8px;
                        margin-right: 4px;
                        margin-bottom: 4px;
                        border-radius: 4px;
                        background: #fff8d0;
                    }
                }
            }
        }
        .order-price {
            display: flex;
            justify-content: flex-end;
            padding-top: 0.25rem;
            font-size: 0.36rem;
            font-weight: bolder;
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
    }
    .message-card {
        .coupon {
            padding: 0 0 .2rem;
            label {
                font-weight: bolder;
            }
            .selected-coupon {
                .amount {
                    margin: 0 0.2rem 0 0.1rem;
                    font-weight: bolder;
                }
                .iconfont {
                    vertical-align: middle;
                }
            }
        }
        .express {
            font-weight: bolder;
        }
        .message {
            margin-top: .25rem;
            .m-textarea {
                width: 100%;
                padding: .2rem;
                border: 0;
                border-radius: 8px;
                background: #f0f0f0;
                outline: none;
                font-family: sans-serif;
            }
        }
    }
    .footbar {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 3;
        display: flex;
        width: 100%;
        height: 0.98rem;
        line-height: 0.98rem;
        background: #fff;
        .total {
            flex: 2;
            padding: 0 .3rem;
            display: flex;
            justify-content: space-between;
            .amount {
                vertical-align: bottom;
                font-size: 0.5rem;
                font-weight: bolder;
                .font-rmb {
                    font-size: .24rem;
                }
            }
        }
        .purchase {
            flex: 1;
            .purchase-button {
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 0.32rem;
                border: none;
            }
        }
    }
    .coupon-panel {
        width: 100%;
        min-height: 8rem;
        border-radius: 8px 8px 0 0;
        background: #fff;
        .panel-header {
            position: relative;
            padding: .4rem .4rem 0 .4rem;
            .panel-title {
                text-align: center;
            }
            .close-button {
                position: absolute;
                right: .4rem;
                top: .4rem;
                border: 0;
                background: transparent;
            }
        }
        .panel-body {
            position: relative;
            min-height: 4rem;
            padding: .4rem .4rem 0 .4rem;
            .coupon-exchange {
                display: flex;
                height: .8rem;
                line-height: .8rem;
                border-radius: 8px;
                border: 1px solid #f2f2f2;
                // box-shadow: 0 0 1px 1px #e5e5e5;
                .ex-input {
                    flex: 1;
                    padding: 0 .3rem;
                    border: none;
                    background: #ededed;
                    border-radius: 8px 0 0 8px;
                }
                .ex-button {
                    width: 1.45rem;
                    border: none;
                    background: #fff;
                    border-radius: 0 8px 8px 0;
                }
            }
            .coupon-box {
                max-height: 6rem;
                overflow-y: auto;
                margin-top: .3rem;
                .coupon-item {
                    margin: .2rem 0;
                }
            }
            .coupon-none {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, 50%);
                font-size: .28rem;
                text-align: center;
                color: #999;
            }
            .show-more {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, 50%);
                text-align: center;
                .more-button {
                    font-size: .24rem;
                    border: none;
                    background: none;
                }
            }
        }
    }
    .picker-wrap {
        background: #fff;
        .picker-button {
            position: relative;
            top: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #f2f2f2;
            .btn {
                width: 100%;
                padding: .2rem;
                color: #fff;
                border: none;
                font-size: .32rem;
            }
        }
        .picker {
            background: #fff;
        }
    }
    .address-box {
        padding-top: .2rem;
        background: #fff;
        .card {
            padding: .2rem .3rem;
            margin-bottom: 0;
            border-radius: 0;
            border-bottom: 1px solid #f2f2f2;
        }
        .address-list {
            height: 6rem;
            overflow: auto;
        }
        .address-add {
            .add-button {
                width: 100%;
                padding: .3rem;
                border: none;
                font-weight: bolder;
            }
        }
    }
</style>
