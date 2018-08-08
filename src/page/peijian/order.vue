<template>
    <!-- 下单 -->
    <div class="order-warp">
        <topbar title="确认订单"></topbar>
        <!-- 收货地址 -->
        <div class="addres-warp">
            <!-- 默认地址 -->
            <div class="default-address"  v-show="addressList.length > 0" @click="handleShowAddress" :style="save === true?'color:#999':''">
                <i ></i>
                <div class="">
                    <p :style="save === true?'color:#999':''">{{DefaultAddress.contact}}&nbsp;&nbsp;{{DefaultAddress.mobile}}</p>
                    <p :style="save === true?'color:#999':''">{{DefaultAddress.regionName}}{{DefaultAddress.address}}</p>
                </div>
                <i class="iconfont icon-fanhui-you"></i>
            </div>

            <!-- 新增地址 -->
            <div class="save-address" v-if="save">
                <div>
                    <span>收货地址</span>
                    <span @click="hidesave" v-show="addressList.length > 0">取消</span>
                </div>
                <div >
                    <label>收货人</label>
                    <input type="text" placeholder="请输入收件人"  v-model="addressForm.contact"> 
                </div>
                <!-- 手机号 -->
                <div >
                    <label>手机号</label>
                    <input type="tel" maxlength="11" onkeyup="value=value.replace(/[^\d\.]/g,'')" onblur="value=value.replace(/[^\d\.]/g,'')" placeholder="请输入手机号" v-model="addressForm.mobile"> 
                </div>
                <!-- 区域选择器 -->
                <div >
                    <label>所在地区</label>
                    <div   :style="regionName === '请选择'?'color:#999':'color:#353535'" @click="showpicker" >
                        <span >{{regionName}}</span>
                        <i class="iconfont icon-fanhui-you"></i>
                    </div>
                </div>
                <!-- 详细地址 -->
                <div class="">
                    <label>详细地址</label>
                    <input type="text"  placeholder="请填写详细收货地址" v-model="addressForm.detailedAddress"> 
                </div>
            </div>

            <!-- 地址列表 -->
            <div class="picker-warp"  v-show="picker"  @click="hidepicker" @touchmove.prevent>
                <div class="hidepicker" @click="confirm" >确定</div>
                <picker class="picker"  :data='regiondata' v-model='value'  :columns=3  @on-change="addeschange" ref="picker"></picker>
            </div>
        </div>

        <!-- 订单详情 -->
        <div class="order-card">
            <div class="order-title">订单</div>
            <div class="order-content">
                <div class="order-pic">
                    <img :src="orderInfo.img + '@100w_100h_1e_1c.jpg'">
                </div>
                <div class="order-detail">
                    <div class="d-name">{{orderInfo.name}}</div>
                </div>
            </div>
            <div class="order-price text-red">
                <span><i class="font-rmb">￥</i>{{orderInfo.price}}</span>
            </div>
        </div>

        <!-- 留言 -->
        <div class="message-card">
            <div class="express card-item">
                <label for="">配送方式</label>
                <div>平邮</div>
            </div>
            <div class="message">
                <textarea rows="5" v-model="remark" placeholder="用户留言（最多50个字）" maxlength="50" class="m-textarea"></textarea>
            </div>
        </div>

        <!-- 提交订单 -->
        <div class="submit-order">
            <div class="price">
                总价：
                <span>￥{{orderInfo.price}}</span>
            </div>
            <div class="submit" @click="handleCommitOrder">
                提交订单
            </div>
        </div>

    <!-- 收货地址列表 -->
        <fixed-modal :visible="addressVisible" @close="addressVisible = false">
            <div class="address-box">
                <div class="address-list">
                    <div class="card address-card" v-for="(item, index) in addressList" :key="index" @click="handleSelectedAddress(item)">
                        <div class="addr-icon">
                            <img v-if="DefaultAddress.id === item.id" src="@/assets/img/icon-selected.png" class="icon-selected">
                            <i v-else class="icon-unselected"></i>
                        </div>
                        <div class="addr-content">
                            <div class="consignee">
                                <span class="name ellipsis">{{item.contact}}</span>
                                <span class="phone">{{item.mobile}}</span>
                            </div>
                            <div class="address">
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
    </div>
</template>

<script>
import fixedModal from '@/components/fixed-modal';
import {getAddersslist ,getRegionList, saveUserAddress, getFittingsDetails,createFittingsTrade} from '../../api/index.js'
export default {
    components: {
        fixedModal
    },
    data(){
        return{
            DefaultAddress:{},
            regionName:"请选择",
            regiondata:['-'],
            addressList:['-'],
            value:["上海", "海淀区", "西三旗"],
            picker:false,
            idRegion:null,
            save:false,
            addressVisible: false,
            orderInfo:{},
            remark:"",
            addressForm: {
                contact: '',
                mobile: '',
                regionCode: '',
                detailedAddress: '',
            },
        }
    },
    methods:{
        //获取地址列表并赋值给选择器
        RegionList(){
            getRegionList().then(res=>{
                this.regiondata = res.body;
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
                            this.DefaultAddress = this.addressList[0];
                        } else {
                            this.DefaultAddress = defaultAddress[0];
                        }
                    } else {
                        this.save = true;
                        this.RegionList();
                    }
                } else {
                    this.$showToast(res.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
         // 显示地址选择器
        showpicker(){  
            this.picker=true;
        },
        // 隐藏地址选择器
        hidepicker(){
            this.picker=false;
        },
        // 确定按钮
        confirm(){
            this.picker=false;
            this.addressForm.regionCode = this.$refs.picker.value[2];
            this.regionName=this.$refs.picker.getNameValues()
        },
        // 隐藏新建地址
        hidesave(){
            this.save = false;
        },
        useNewAddress(){
            this.addressVisible = false;
            this.save =true;
        },
        handleShowAddress() {
            this.addressVisible = true;
        },
        handleSelectedAddress(item) {
            if(this.DefaultAddress.id === item.id) return;
            this.DefaultAddress = item;
            this.addressVisible = false;
            this.save = false;
        },
        //详情
        FittingsDetails(){
            let data = {
                utmSource:localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source,
                utmMedium:localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium,
                categoryId:15,
                skuId:this.$route.query.skuid
                }

            getFittingsDetails(data).then(res=>{
                if (res.code === '0') {
                    this.orderInfo = res.body
                }
            })
        },
        handleCommitOrder(){
            if (this.save) {
                this.addAddress() 
            }else{
                this.submitOrder()
            }
        },
        // 提交订单
        submitOrder(){
            let data = {
                utmSource: localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source,
                utmMedium: localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium,
                skuId:this.$route.query.skuid,
                addressId:this.DefaultAddress.id,
                remark:this.remark
            }
            createFittingsTrade(data).then(res=>{
                if (res.code === '0') {
                    this.$router.push(`/product/pay?tradeNo=${res.body}`)
                }else{
                    this.$showToast(res.message)
                }
            })
            
        },
        // 新增收货地址
        addAddress() {
            if(this.addressForm.contact == '') {
                this.$showToast('请输入收货人姓名');
                return;
            } else if(!/^1[3-9][\d]{9}$/.test(this.addressForm.mobile)) {
                this.$showToast('请输入正确手机号');
                return;
            } else if(this.addressForm.regionCode === '') {
                this.$showToast('请选择所在地区');
                return;
            } else if(this.addressForm.detailedAddress === '') {
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
                    this.DefaultAddress.id = res.body;
                    this.submitOrder()
                } else {
                    this.$showToast(res.message)
                }
            })
        },
    },
    mounted(){
        this.RegionList();
        this.getAddersslists();
        this.FittingsDetails()
    }
}
</script>
 
<style lang="less" scoped>
.addres-warp{
    .default-address{
        width: 6.9rem;
        margin: .2rem auto;
        background: #fff;
        padding: .3rem .2rem;
        border-radius: .16rem;
        box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
        position: relative;
        &>i:first-child{
            display: block;
            width: .25rem;
            height: .37rem;
            margin: .03rem .35rem .3rem 0;
            float: left;
            background: url('../../img/dizhi.png') no-repeat;
            background-size: 100%;
        }
        &>i:last-child{
            display: block;
            position: absolute;
            right: .2rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: .48rem;
        }
        div{
            margin-left: .6rem;
            height: 100%;
            p{
                &:first-child{
                    padding: 0rem 0 .15rem;
                    font-size: .32rem;
                    font-weight: bold;
                }
                &:last-child{
                    color: #353535;
                    font-size: .26rem;
                }
            }
        }
    }

    .save-address{
        width:6.9rem;
        border-radius: .16rem;
        background: #fff;
        margin: .3rem auto .3rem;
        padding: .15rem .3rem .4rem;
        font-size: .28rem;
        box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
        div:first-child{
            line-height: .78rem;
            border-bottom:  .01rem  solid #f2f2f2;

            span{
                &:first-child{
                    font-weight: bold;
                }
                &:last-child{
                    float:right;
                }
            }
        }
        &>div{
            font-size: .28rem;
            overflow: hidden;
            margin-bottom: .15rem;
            
            &>label{
                padding: .15rem 0;
                display: block;
                width: 1.59rem;
                float: left;
            }
            &>input{
                color: #353535;
                box-sizing: border-box;
                font-size: .28rem;
                padding: .15rem .1rem ;
                display: block;
                float: right;
                outline: none;
                border: none;
                border-bottom:solid .01rem  #f2f2f2;
                width:4.71rem; 
            }
            &>div{
                color: #353535;
                box-sizing: border-box;
                font-size: .28rem;
                padding: .15rem .1rem ;
                display: block;
                float: right;
                outline: none;
                border: none;
                border-bottom:solid .01rem  #f2f2f2;
                width:4.71rem; 
                position: relative;
                span{
                    line-height: 0.5rem;
                }
                i{
                    position: absolute;
                    right: 0;
                    font-size: .34rem;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        
    }

    .picker-warp{
        z-index: 100;
        position: fixed;
        left: 0;
        top: 0;
        width:100%;
        height: 100%;
        background: rgba(0, 0, 0, .6);
        transition: all 1s;
        .hidepicker{
            width: 100%;
            position: absolute;
            bottom: 238px;
            padding: .2rem;
            font-size: .32rem;
            text-align: center;
            background: #f3c91e;
            box-sizing: border-box;

        }

        .picker{
            transition: all 1s;
            width: 100%;
            position: absolute;
            bottom: 0;
            background: #fff;
            .picker-slot{
                font-size: .32rem;
            }
        }

    }
}
.address-box {
    padding-top: .2rem;
    background: #fff;
    .card {
        display: flex;
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
    .addr-icon{
        width: .32rem;
        height: .32rem;
        line-height: .32rem;
        margin-right: .3rem;
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
    
}


.order-card{
    width: 6.9rem;
    margin: .2rem auto;
    background: #fff;
    padding: .3rem .2rem;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;

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
    width: 6.9rem;
    margin: .2rem  auto 1.2rem;
    background: #fff;
    padding: .3rem .2rem;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    .card-item {
        display: flex;
        justify-content: space-between;
        padding: 0rem 0 .25rem;
        border-bottom: 1px solid #f2f2f2;
        &:last-child {
            border-bottom: 0;
        }
        .card-item-title {
            font-weight: bolder;
            font-size: .28rem;
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

.submit-order{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: .96rem;
    border-top: solid .01rem  #f2f2f2;
    background: #fff;
    display: flex;
    justify-content: space-between;
    .price{
        padding-left: .3rem;
        font-size: .32rem;
        span{
        line-height: .96rem;
        font-size: .32rem;
        color: #EB2828;
        }
        
    }
    .submit{
        width: 3.04rem;
        height: 100%;
        text-align:center;
        line-height: .96rem;
        background: #EB2828;
        color: #fff;
        font-size: .32rem;
    }
        
}
</style>

