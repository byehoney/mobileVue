<template>
    <!-- 订单列表 -->
    <div class="myorder">
        <!-- 头部 -->
        <topbar title="我的订单"></topbar>
        
        <!-- 订单状态选项卡 -->
        <div class="nav-bar">
            <div :class="$route.query.state=='fukuan'?'activ':''" @click="orderstate('fukuan')">
                <span>待付款</span>
                <i></i>
            </div>
            <div :class="$route.query.state=='fahuo'?'activ':''" @click="orderstate('fahuo')">
                <span>待发货</span>
                <i></i>
            </div>
            <div :class="$route.query.state=='shouhuo'?'activ':''" @click="orderstate('shouhuo')">
                <span>待收货</span>
                <i></i>
            </div>
            <div :class="$route.query.state=='quanbu'?'activ':''" @click="orderstate('quanbu')">
                <span>全部订单</span>
                <i></i>
            </div>                       
        </div>

        <!-- 订单列表 -->
        <mt-loadmore  v-if="this.order.length !== 0"  class="order-list" 
         :bottom-method="loadMore" :bottomLoadingText="bottomPullText" :bottom-all-loaded="loading" ref="loadmore">
            <div class="order"  v-for="(item,index) in order" :key="index" >
                <!-- 订单状态相关 -->
                <div class="order-top">
                    <span>订单号:{{item.tradeNo}}</span>
                    <span  :style="item.status == '1'?'color:#eb2828':''">{{item.statusName}}</span>
                </div>
                <!-- 商品相关 -->
                <div class="phone" @click="oderdetails(item)">
                    <div class="img">
                        <img :src="item.coverImg+'@125w_125h_1e_1c.jpg'">
                    </div>
                    <div class="der">
                        <div class="name">
                            {{item.name}}
                        </div>
                        <div class="label" v-if="item.orderType !== 'fittings'">
                            <span>{{item.sourceTypeName}}</span>
                            <span v-for="(i,index) in item.repairTypeNameList" :key="index">{{i}}</span>
                        </div>
                        <div class="imie" v-if="item.orderType !== 'fittings'">
                            IMEI:{{item.imei}}
                        </div>
                   </div> 
                </div>
                <!-- 价格 -->
                <div class="order-date">
                    <div class="date"><span>{{item.dtCreated}}</span></div>
                    <div class="sum">
                        <span>合计:<span><i>￥</i>{{item.sum}}</span></span>
                    </div>
                </div>

                <!-- 订单按钮相关 -->
                <div class="order-bottom">
                    <div v-if="item.status == '1' ">
                         20分钟内付款为您保留订单
                        <countdown  :endTime.sync='item.expireTime'  endText="这个订单取消了"></countdown>
                        <div class="pay" @click="pay(item.tradeNo)">去支付</div>
                    </div>
                    <div v-else-if="item.status == '5' ">
                        <!-- <div class="pay">确认收货</div> -->
                        <div @click="Logistics(item)">查看物流</div>
                        <!-- <div v-if="item.afterSaleId !== ''" @click="AfterSales(item,1)">查看售后</div> -->
                        <!-- <div  v-else @click="AfterSales(item,1)">申请售后</div>                         -->
                    </div>
                    <div  v-else-if="item.status == '9'">
                        <div v-if="item.afterSaleId !== ''" @click="AfterSales(item,2)">查看售后</div>
                        <div  v-else @click="AfterSales(item,2)">申请售后</div>
                    </div>
                    <div  v-else-if="(item.status == '2')||(item.status == '7') ">
                        <div style="background:#ededed;border:none;">已取消</div>
                    </div>
                    <div  v-else>
                        <div v-if="item.afterSaleId !== ''" @click="AfterSales(item,1)">查看售后</div>
                        <div  v-else @click="AfterSales(item,1)">申请售后</div>
                    </div>
                </div>
            </div>
        </mt-loadmore>
        <div class="order-list-kong" v-else>
            <img src="../../img/dingdankong.png">
            <p>亲，没有相关订单~</p>
        </div>

    </div>
</template>

<script>
import { tradeList } from "../../api/index.js"
import countdown from '../../components/CountDown'
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            order:[],
            pageNumber:1,
            loading:true,
            bottomPullText:"上拉加载更多",
            bottomText:'没有更多订单了'
        }
    },
    components : {
        countdown,
        topbar
    },
    methods:{
        //切换订单状态
        orderstate(state){
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.pageNumber=1;
            this.$router.replace(`/mycenter/myorder?state=${state}`);
            // this.loading=false;
            this.getlist();
        },
        // 跳转订单详情
        oderdetails(item){
            _paq.push(['trackEvent', '82.OrderListPage', '82.14.OrderDetail', '82.14.OrderDetail']);                                        
            this.$router.push(`/mycenter/myorder/orderdetails?id=${item.id}`)
        },
        // 获取订单列表'
        getOrderList(status){
            let data = {
                pageNumber:1,
                pageSize:"3",
                status:status,
            }
            tradeList(data).then(res=>{
                if(res.code == '0'){
                    this.order=res.body;
                    if(res.totalPage > 1){
                        this.loading=false;
                    }else{
                        this.loading=true;                        
                    }                         
                }else{
                    this.$showToast(res.message)
                }
            })
        },
        // 加载获取订单列表
        getlist(){
            let state =this.$route.query.state
            switch (state) {
                case "fukuan":
                    _paq.push(['trackEvent', '82.OrderListPage', '82.10.ToPayOrderList', '82.10.ToPayOrderList']);                                        
                    this.getOrderList("1")
                    break;
                case "fahuo":
                    _paq.push(['trackEvent', '82.OrderListPage', '82.11.ToDeliveryOrderList', '82.11.ToDeliveryOrderList']);                                        
                    this.getOrderList("3,4")
                    break;
                case "shouhuo":
                    _paq.push(['trackEvent', '82.OrderListPage', '82.12.ToReceiveOrderList', '82.12.ToReceiveOrderList']);                                        
                    this.getOrderList("5")
                    break;
                case "quanbu":
                    _paq.push(['trackEvent', '82.OrderListPage', '82.13.AllOrderList', '82.13.AllOrderList']);                                        
                    this.getOrderList()
                    break;
                default:
                    break;
            }
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
        // 跳转查看物流
        Logistics(item){
            _paq.push(['trackEvent', '82.OrderListPage', '82.16.DeliveryDetail', '82.16.DeliveryDetail']);                                        
            let expressCode = item.expressCode;
            let expressNumber = item.expressNumber;
            this.$router.push(`/mycenter/myorder/logistics?expressCode=${expressCode}&expressNumber=${expressNumber}`)            
        },
        // 跳转支付页面
        pay(tradeNo){
            _paq.push(['trackEvent', '82.OrderListPage', '82.15.PayOrder', '82.15.PayOrder']);                                        
            this.$router.push(`/product/pay?tradeNo=${tradeNo}`)                        
        },
        // 加载更多
        loadMore(){
            let state =this.$route.query.state
            switch (state) {
                case "fukuan":
                    this.load("1")
                    break;
                case "fahuo":
                    this.load("3,4")
                    break;
                case "shouhuo":
                    this.load("5")
                    break;
                case "quanbu":
                    this.load()
                    break;
                default:
                    break;
            }    
        },
        //上拉加载方法
        load(status){
            this.pageNumber +=1;
            let data = {
                pageNumber:this.pageNumber,
                pageSize:"3",
                status:status,
            }
            tradeList(data).then(res=>{
                if(res.totalPage === this.pageNumber){
                    this.loading=true;        
                }
                this.$refs.loadmore.onBottomLoaded();
                this.order=this.order.concat(res.body)
            })
        }
    },
    mounted(){
        document.title = "我的订单"
        this.getlist();        
    }
}
</script>


<style lang="less" scoped>
.myorder{
    overflow: hidden;
}

.nav-bar{
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    background: #fff;
    display: flex;
    font-size: .28rem;
    color: #353535;
    position: fixed;
    z-index: 5;
    border-bottom: solid .01rem #f2f2f2;
    &>div{
        box-sizing: border-box;
        flex: 1;
        width: 25%;
        text-align: center;
        position: relative;
        &>i{
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -0.4rem;
            width: .8rem;
            height: .06rem;
            line-height: .06rem;
            border-radius: .5rem;
            background: transparent;
      }
    }
    .activ{
        font-weight: bold;
        &>i{
            background: #f3c91e;
        }
    }
    
}

.order-list{
    margin-top: 1rem;
}

.order-list-kong{
    width: 6.9rem;
    margin: 1rem auto;
    padding: 2.5rem  1.5rem 0;
    img{
        width: 100%;
        height: 100%;
    }
    p{
        font-size: .28rem;
        color: #ccc;
        line-height: 1rem;
        text-align: center;
    }
}
.order{
    overflow: hidden;
    width: 6.9rem;
    background: #fff;
    border-radius: .16rem;
    margin: .3rem auto;
    padding: 0 .3rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    
    .order-top{
        padding: .25rem 0;
        font-size: .24rem;
        margin-bottom: .2rem;
        border-bottom: solid .01rem #f2f2f2;
        span{
            &:first-child{
                font-size: .28rem;
                margin-right: .1rem;
            }
            &:last-child{
                font-weight: bold;
                color: #353535;
                float: right;
            }

        }
    }

    .phone{
        display: flex;
        width: 100%;
        padding: .1rem;
        position: relative;
        .img{
            // display: block;
            width:1.8rem;
            height: 1.8rem;
            margin-right: .2rem;
            background: #fff;
            // position: absolute;
            // margin-left: -.1rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .der {
            flex: 1;
        }
        .name,.label,.imie{
            font-size: .24rem;
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
            padding-bottom: .15rem;      
            border-bottom: solid .01rem #f2f2f2;

        }
    }
    .order-date {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid .01rem #f2f2f2;
        .date {
            font-size: .28rem;
        }
    }
    .sum{
        height: .7rem;
        text-align: right;
        font-size: .24rem;
        font-weight: bold;
        line-height: .7rem;
        span{
            font-size: .36rem;
            
            i{
                font-size: .22rem;
                font-weight: bold;
                font-style: normal;
            }
        }

    }
    .order-bottom{
        height: .88rem;
        font-size: .24rem;
        position: relative;
        &>div>div{
            float: right;
            margin: .15rem 0 0 .1rem;
            padding: .12rem .3rem;
            border: solid .01rem #999;
            border-radius: .5rem;
            font-size: .26rem;
        }
        span{
            line-height: .88rem;
            color: #eb2828;
        }
        .pay{
            border: none;
            background: #f3c91e;
            font-weight: bold;
            box-shadow: 0.01rem 0.1rem 0.1rem -.03rem #fff8d0;            
        }
    }
}
</style>

