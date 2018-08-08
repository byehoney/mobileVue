<template>

    <div class="my-center">
        <div class="user-infor">
            <div  class="user-avatar">
                <img src="../img/touxiang.png" alt="">
            </div>
            <div class="user-name">
                <span>你好,</span>
                <span>{{username}}</span>
            </div>

            <div class="sign-out" @click="signOut">退出</div>

        </div>

        <div class="my-orders">
            <span>我的订单</span>
            <ul class="order-state">
                <li  @click="handle('ToPayOrderList')">
                    <router-link  to="/mycenter/myorder?state=fukuan" >
                    <i><i v-if="fukuan > 0">{{fukuan}}</i></i>
                    <span>待付款</span>
                    </router-link>
                </li>
                <li @click="handle('ToDeliveryOrderList')">
                    <router-link to="/mycenter/myorder?state=fahuo" >
                    <i><i v-if="fahuo > 0">{{fahuo}}</i></i>
                    <span>待发货</span>
                    </router-link>
                </li>
                <li @click="handle('ToReceiveOrderList')">
                    <router-link to="/mycenter/myorder?state=shouhuo"  >
                    <i><i v-if="shouhuo > 0">{{shouhuo}}</i></i>
                    <span>待收货</span>
                    </router-link>
                </li>
                <li @click="handle('AllOrderList')">
                    <router-link to="/mycenter/myorder?state=quanbu" >
                    <i></i>
                    <span>全部订单</span>
                    </router-link>
                </li>
            </ul>
            <mt-cell title="管理地址" to="/mycenter/dizhiguanli" is-link></mt-cell>
            <mt-cell title="优惠券"   to="/mycenter/coupon" is-link> </mt-cell>
            <mt-cell title="售后记录" to="/mycenter/aftersaleslist" is-link ></mt-cell>
            <mt-cell title="联系客服" v-kefu is-link @click.native="handle('CustomService')"></mt-cell>
            <mt-cell title="关于我们" to="/mycenter/about" is-link></mt-cell>
        </div>
        
        <TabBar></TabBar>
    </div>

</template>

<script>
import TabBar from '../components/tabbar'
import { logout,tradeCount } from "../api/index.js"
export default {
    data(){
        return{
            username:"",
            fukuan:0,
            shouhuo:0,
            fahuo:0
        }
    },
    components:{
        TabBar
    },
    methods:{
        // 用户登出
        signOut(){    
            _paq.push(['trackEvent', '80.MyPage', '80.12.Logout', '80.12.Logout']);
            logout().then(res=>{
                localStorage.removeItem('token')
                localStorage.removeItem('phonenumber')
                this.$showToast("退出成功")
                this.$router.push('/index')
            })
        },
        // 订单数量统计
        orderQuantity(){
            tradeCount('1').then(res=>{
                if(res !== undefined ){
                    this.fukuan=res.body
                }
            })
            tradeCount('3,4').then(res=>{
                if(res !== undefined ){
                    this.fahuo=res.body
                }
            })
            tradeCount('5').then(res=>{
                if(res !== undefined ){
                    this.shouhuo=res.body
                }
            })
        },
        handle(val){
            console.log(val);
            
            switch (val) {
                case 'ToPayOrderList':
                    _paq.push(['trackEvent', '80.MyPage', '80.13.ToPayOrderList', '80.13.ToPayOrderList']);                   
                    break;
                case 'ToDeliveryOrderList':
                    _paq.push(['trackEvent', '80.MyPage', '80.14.ToDeliveryOrderList', '80.14.ToDeliveryOrderList']);                    
                    break;
                case 'ToReceiveOrderList':
                    _paq.push(['trackEvent', '80.MyPage', '80.15.ToReceiveOrderList', '80.15.ToReceiveOrderList']);                    
                    break;
                case 'AllOrderList':
                    _paq.push(['trackEvent', '80.MyPage', '80.16.AllOrderList', '80.16.AllOrderList']);                    
                    break;
                case 'CustomService':
                    _paq.push(['trackEvent', '80.MyPage', '80.20.CustomService', '80.20.CustomService']);                    
                    break;
                default:
                    break;
            }
        },
        },
        mounted(){
            document.title='个人中心'
            this.username=localStorage.getItem("phonenumber")
            this.orderQuantity()
        }
}
</script>

<style lang="less" scoped>
.my-center{
    height: 100%;
    background-image:url('../img/mycenterbg.png');
    background-size: 100% auto;
    background-repeat:no-repeat;
    color: #353535;

}
.user-infor{
    overflow: hidden;
    height: 3.15rem;
    position: relative;
    .user-avatar{
        display: block;
        width: 1.3rem;
        height: 1.3rem;
        margin: .7rem auto 0;

        img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    .user-name{
        margin: .3rem auto .2rem;
        font-size: .32rem;
        font-weight: bold;
        text-align:center;
    }
}

.my-orders{
    width: 6.9rem;
    margin: 0 auto;
    padding: .3rem;
    padding-bottom: 0;
    background: #fff;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    

    &>span{
        font-size: .28rem;
        font-weight: bold;
    }

    .order-state{
        height: 1.7rem;
        border-bottom: solid .01rem #f2f2f2;
        li{
            display: block;
            float: left;
            text-align: center;
            height: 100%;
            width: 25%;
            text-align: center;
            a{
                i{
                    margin: .3rem auto .1rem;
                    display: block;
                    width: .6rem;
                    height: .6rem;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    position: relative;

                    i{
                        display: block;
                        width: .28rem;
                        height: .28rem;
                        background: red;
                        border-radius: 50%;
                        position: absolute;
                        right: -0.1rem;
                        top: -.3rem;
                        font-size: .12rem;
                        font-style: normal;
                        color: #fff;
                        text-align: center;
                        line-height: .28rem;
                    }

                }
                span{
                    color: #353535;
                    font-size: .24rem;
                    font-weight: normal;
                }
           }
        &:nth-child(1)>a>i{
            background-image: url("../img/dingdanbg2.png");
        }
        &:nth-child(2)>a>i{
            background-image: url("../img/dingdanbg1.png");
        }
        &:nth-child(3)>a>i{
             background-image: url("../img/dingdanbg3.png");
        }
        &:nth-child(4)>a>i{
             background-image: url("../img/dingdanbg4.png");
        }
        }
    }
}

.sign-out{
    margin: .35rem auto 2rem;
    position: absolute;
    top: .1rem;
    right: .3rem;
    font-size: .28rem;
    color: #353535;
}





</style>

