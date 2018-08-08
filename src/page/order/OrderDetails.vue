<template>
    <div class="orderdetails-warp">
        <topbar title="订单详情"></topbar>

        <div class="bg"></div>

        <div class="order-details">
            <div class="title">
                <span>{{info.tradeNo}}</span>
                <span  :style="info.status == '1'?'color:#eb2828':''">{{info.statusName}}</span>
            </div>

            <div class="order-infor">
                <i ></i>
                <div class="">
                    <p>{{info.contact}}&nbsp;&nbsp;{{info.mobile}}</p>
                    <p>{{info.regionName}}{{info.address}}</p>
                </div>
            </div>
        </div>

        <div class="product-infor">
            <div class="phone" @click="showDetail(info)">
                    <div class="img">
                        <img :src="info.coverImg+'@125w_125h_1e_1c.jpg'">
                    </div>
                    <div>
                        <div class="name">
                            {{info.name}}
                        </div>
                        <div class="label" v-if="info.orderType !== 'fittings'"> 
                            <span>{{info.sourceTypeName}}</span>
                            <span v-for="(item,index) in info.repairTypeNameList" :key="index">{{item}}</span>
                        </div>
                        <div class="imie" v-if="info.orderType !== 'fittings'">
                            IMEI:{{info.imei}}
                        </div>
                    </div>    
                </div>

            <div class="sum">
                商品总价
                <span><i>￥</i>{{info.sum}}</span>
            </div>

            <div class="freight">
                运费
                <span>￥0</span>
            </div>
            <div class="coupon">
                优惠券
                <span>-￥{{info.discount}}</span>
            </div>
        </div>

        <div class="bottom">
            <div v-if="info.status == 1">
                <div @click="cancelOrder">取消订单</div>
                <div class="pay" @click="pay(info.tradeNo)">去支付</div>
            </div>
            
            <div  v-else-if="info.status == 5">
                <div v-if="info.afterSaleId !== ''" @click="AfterSales(info,1)">查看售后</div>
                <!-- <div v-else @click="AfterSales(info,1)">申请售后</div> -->
                <div @click="Logistics">查看物流</div>
                <!-- <div class="pay">确认收货</div> -->
                
            </div>
            <div  v-else-if="info.status == 9">
                <div v-if="info.afterSaleId !== ''" @click="AfterSales(info,2)">查看售后</div>
                <div v-else @click="AfterSales(info,2)">申请售后</div>
            </div>
            <div  v-else-if="(info.status == 2)||(info.status == 7)">
                <div style="background:#ededed;border:none;">已取消</div>
            </div>
            <div v-else>
                <div v-if="info.afterSaleId !== ''" @click="AfterSales(info,1)">查看售后</div>
                <div v-else @click="AfterSales(info,1)">申请售后</div>
            </div>
        </div>
    </div>
</template>

<script>
import { deleteOrder,getOrderDatil } from "@/api/index.js"
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            info:{}
        }
    },
    components : {
        topbar
    },
    methods:{
        //因为这个页面点返回需要上一个页面状态
        back(){
            this.$router.go(-1)
        },
        //  跳转查看物流
        Logistics(){
            let expressCode = this.info.expressCode;
            let expressNumber = this.info.expressNumber;
            this.$router.push(`/mycenter/myorder/logistics?expressCode=${expressCode}&expressNumber=${expressNumber}`)            
        },
        // 跳转支付页面
        pay(tradeNo){
            _paq.push(['trackEvent', '83.OrderDetailPage', '83.11.PayOrder', '83.11.PayOrder']);                                        
            this.$router.push(`/product/pay?tradeNo=${tradeNo}`)                        
        },
        // 跳转售后申请
        AfterSales(item,type){
             //如果售后id为空去申请页面    不为空去售后详情页面
            if(item.afterSaleId === ''){
                if (type === 1) {
                    this.$showToast("亲，商品正在出库中，如需退换货请您联系在线客服!",2000)
                }else{
                    this.$router.push({
                        name:'aftersales',
                        params:{
                            item:item,
                            type:type
                        }
                    })
                }
            }else{
                let id = item.afterSaleId;
                let type = item.afterSaleType;
                this.$router.push(`/mycenter/aftersaleslist/aftersalesdetail?id=${id}&type=${type}`)
                
            }
        },
        // 取消详情
        cancelOrder(){
            _paq.push(['trackEvent', '83.OrderDetailPage', '83.10.CancelOrder', '83.10.CancelOrder']);                                        
            let data={
                tradeNo:this.info.tradeNo,
                serialNumber:this.info.serialNumber
            }
            deleteOrder(data).then(res=>{
                if(res.code == 0){
                    getOrderDatil(this.$route.query.id).then(res=>{
                        this.info=res.body 
                    })
                    this.$showToast("订单取消成功！")
                }else{
                    this.$showToast(res.message)
                }
            })
        },
        // 跳转详情
        showDetail(info) {
            this.$router.push(`/product/detail?serialNumber=${info.serialNumber}&origin=orderPage`)
        }
    },
    beforeMount(){
        getOrderDatil(this.$route.query.id).then(res=>{
            this.info=res.body 
        })
    }
}
</script>

<style lang="less" scoped>
body,html{
    width: 100%;
    height: 100%;
    background:  #ededed;
}

.bg{
    width: 100%;
    height: 1.3rem;
    background: #f3c91e;
    margin: 0 auto;
    z-index: -1;
}

.order-details{
    background: #fff  ;
    margin: -.7rem auto .2rem;
    padding: .25rem .3rem;
    border-radius: .16rem; 
    width: 6.9rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    
    .title{
        padding: 0 0 .13rem  0;
        border-bottom: solid .01rem #f2f2f2;
        font-size: .26rem;
        font-weight:bold;
        span{
            &:last-child{
                float: right;
            }
        }
    }

    .order-infor{
        &>i{
            display: block;
            width: .25rem;
            height: .37rem;
            margin: .3rem .35rem .3rem 0;
            float: left;
            background: url('../../img/dizhi.png') no-repeat;
            background-size: 100%;
        }
        div{
            margin-left: .6rem;
            height: 100%;
            p{
                &:first-child{
                    padding: .25rem 0 .15rem;
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
    
}

.product-infor{
    width: 6.9rem;
    margin: 0 auto;
    padding: .3rem;
    background: #fff;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd; 
    .phone{
        width: 100%;
        border-bottom: solid .01rem #f2f2f2;
        padding: .1rem;
        position: relative;
        display: flex;
        .img{
            display: block;
            width:1.8rem;
            height: 1.8rem;
            margin-right: .2rem;
            background: #fff;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .name,.label,.imie{
            font-size: .24rem;
            margin-left: .2rem;
        }
        .name{
            font-weight: bold;
            margin-bottom: .15rem;
        }
        .label{
            margin-bottom: .15rem;
            span{
                display: block;
                border-radius: 4px;
                background: #fff8d0;
                float: left;
                font-size: .22rem;
                margin: 0 .1rem .2rem 0;
                padding: .03rem .2rem;

            }
        }
        .imie{
            clear: both;
            padding-left: .1rem;
            margin-bottom: .15rem;            
        }
    }
    .sum,.freight,.coupon{
        padding-top: .3rem;
        font-size: .24rem;
        span{
            float: right;
            font-weight: 600;
        }
    }
    .sum{
        line-height: .5rem;
        span{
            color: #eb2828;
            font-size: .36rem;
            i{
                font-weight: bold;
                font-size: .22rem;
                font-style: normal;
            }
        }
    }

}

.bottom{
    width: 100%;
    height: .98rem;
    background: #fff;
    position: fixed;
    border-top: solid .01rem #f2f2f2;
    bottom: 0;
    &>div{
        float: right;
        div{
            float: left;
            margin: .18rem .2rem;
            padding: .12rem .3rem;
            border: solid .01rem #999;
            border-radius: .5rem;
            font-size: .26rem;
        }
    }
    .pay{
        background: #f3c91e;
        border: none;
        font-weight: bold;
    }
}


</style>
