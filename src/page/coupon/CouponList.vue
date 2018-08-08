<template>
   <div class="coupon-warp">
       <!-- 标题 -->
       <!-- <mt-header fixed title="优惠券">
            <a  @click="back" slot="left">
                <mt-button icon="back" ></mt-button>
            </a>
             <mt-button slot="right" >兑换</mt-button>
        </mt-header> -->
       
        <topbar title="优惠券"></topbar>
        <!-- 优惠券选项卡切换 -->
        <div class="nav-bar">
            <div :class="state===1?'activ':''" @click="couponstate(1)">
                <span>未使用</span>
                <i></i>
            </div>
            <div :class="state===2?'activ':''" @click="couponstate(2)">
                <span>已使用</span>
                <i></i>
            </div>
            <div :class="state===3?'activ':''" @click="couponstate(3)">
                <span>已过期</span>
                <i></i>
            </div>                     
        </div>
        
        <!-- 优惠券列表 -->
        <div class="coupon-list"  v-if="couponlist.length !== 0">
            <div class="coupon" :class="(state===3)||(state===2)?'used':''" v-for="(item,index) in couponlist" :key="index">
                <div class="top">
                    <div class="top-left">
                        <span>￥</span>
                        <span>{{item.value}}</span>
                    </div>
                    <div class="top-right">
                        <p>现金券</p>
                        <p>{{item.remark}}</p>
                    </div>
                </div>
                <div class="bottom">
                    <p>品类限制:商品金额超过{{item.useLine}}元可用</p>
                    <p>有效期:&nbsp;{{item.startTime}}&nbsp;至&nbsp;{{item.endTime}}</p>   
                </div>
            </div>
        </div>

        <!-- 优惠券为空 -->
        <div class="coupon-list-kong" v-else>
            <img src="../../img/couponkong.png" >
            <p>亲，没有相关优惠券！</p>
        </div>

        <!-- 兑换入口 -->
        <div class="exchange-Acode" @click="showbox">
            兑换A码
        </div>
        <!-- 兑换框 -->
        <div class="exchange-box" v-show="box" @touchmove.prevent>
            <div class="exchange">
                <div class="title">兑换优惠券</div>
                <div class="content">
                    <input type="text" placeholder="请输入兑换码" ref="acode">
                </div>
                <div class="button">
                    <span @click="hidebox">取消</span>
                    <span @click="subline">确定</span>
                </div>
            </div>
        </div>  
   </div>
</template>

<script>
import { getAcodeList,obtainCoupon } from '../../api/index.js'
import { timestampToDate } from '../../utils.js'
import topbar from '../../components/topbar'
export default {
    data(){
        return{
            state:1,
            couponlist:[],
            box:false
        }
    },
    components:{
        topbar
    },
    methods:{
        //优惠券列表选项卡通过状态改变优惠券状态
        couponstate(state){
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
            this.state=state
            this.getCouponlist()
        },
        //获取优惠券列表
        getCouponlist(){
            switch (this.state) {
                case 1:
                    // 未使用
                    _paq.push(['trackEvent', '84.CouponPage', '84.10.UnUseList', '84.10.UnUseList']);                                        
                    getAcodeList("1").then(res=>{
                        this.couponlist= res.body
                    })
                    break;
                case 2:
                    // 已使用
                    _paq.push(['trackEvent', '84.CouponPage', '84.11.UsedList', '84.11.UsedList']);                                        
                    getAcodeList("3").then(res=>{
                        this.couponlist= res.body
                    })     
                    break;
                case 3:
                    // 已过期
                    _paq.push(['trackEvent', '84.CouponPage', '84.12.ExpireList', '84.12.ExpireList']);                                        
                    getAcodeList("5").then(res=>{
                        this.couponlist= res.body
                    })
                    break;
                default:
                    this.$router.push("/index")
                    break;
            }
        
        },
        back(){
            this.$router.back()
        },
        // 显示兑换框
        showbox(){
            _paq.push(['trackEvent', '84.CouponPage', '84.13.UseACode', '84.13.UseACode']);                                        
            this.box=true;
        },
        // 取消兑换
        hidebox(){
            _paq.push(['trackEvent', '84.CouponPage', '84.14.CancelUseACode', '84.14.CancelUseACode']);                                        
            this.box=false;
        },
        //确认兑换
        subline(){ 
            _paq.push(['trackEvent', '84.CouponPage', '84.15.ConfirmUseACode', '84.15.ConfirmUseACode']);                                        
            if(this.$refs.acode.value.trim().length === 0 ){
                this.$showToast("请输入兑换码")
            }else{
                
                let data = {
                    acode:this.$refs.acode.value
                }
                obtainCoupon(data).then(res=>{
                    if (res.code == "0") {
                        this.getCouponlist()
                        this.$showToast("兑换成功")

                    } else {
                        this.$showToast("a码不可用")
                    } 
                })
                this.box=false;
            }
        }

    },
    mounted(){
        _paq.push(['trackEvent', '80.MyPage', '80.18.Coupon', '80.18.Coupon']);                    
        this.getCouponlist()
    }
}
</script>

<style lang="less" scoped>
.coupon-warp{
    overflow: hidden;
}

.nav-bar{
    width: 100%;
    height: 1rem;
    background: #fff;
    position: fixed;
    display: flex;
    font-size: .28rem;
    color: #353535;
    border-bottom: solid .01rem #f2f2f2;
    &>div{
        box-sizing: border-box;
        flex: 1;
        width: 25%;
        text-align: center;
        line-height: 1rem;
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
.coupon-list{
     margin: 1.3rem auto 1.3rem;
}
.coupon-list-kong{
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
.coupon{
    margin: .2rem auto 0;
    width: 7.06rem;
    height: 2.46rem;
    background: url('../../img/couponbg1.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .top{
        
        height: 1.4rem;
        padding: .35rem 0 0;
        .top-left{
            display: inline-block;
            width: 4rem;
            padding: 0 .6rem 0 1rem;
            vertical-align: top;
            span{
                font-weight: bold;
                &:first-child{
                    font-size: .38rem;
                    vertical-align: top;
                    line-height: .8rem;
                }
                &:last-child{
                    font-size: .76rem;
                }
            }
        }
        .top-right{
            display: inline-block;
            overflow: hidden;
            width: 2.5rem;
            p{
                line-height: .5rem;
                &:first-child{
                    font-size: .32rem;
                    font-weight: bold;
                }
                &:last-child{
                    font-size: .24rem;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
            }
        }
    }
    .bottom{
        padding: .2rem .45rem 0;
        p{
            font-size: .24rem;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            &:last-child{
                color: #999;
            }
        }
    }
}
.used{
    background: url('../../img/couponbg2.png') no-repeat;
    background-size: 100% 100%;
}

.exchange-box{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .6);
    z-index: 5;
    .exchange{
        width: 5.6rem;
        border-radius: .16rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -1.55rem;
        margin-left: -2.8rem;
        color: #353535; 
        font-size: .28rem;
        text-align: center;
        overflow: hidden;
        .title{
            text-align: center;
            padding-top: .3rem;
            font-weight: bold;      
        }
        .content{
            input{
                display: block;
                width: 4.8rem;
                height: .8rem;
                border: none;
                border-radius:.16rem;
                background: #e5e5e5;
                color: #999;
                margin: .45rem auto;
                padding-left: .3rem;
                outline: none;
            }

        }  
        .button{
            display: flex;
            height: .8rem;
            line-height: .8rem;
            font-weight: bold;  
            span{
                flex: 1;
                text-align: center;
                &:first-child{
                    background: #ededed;
                }
                &:last-child{
                    background: #f3c91e;
                }
            }  
        }
    }
}


.exchange-Acode{
    width: 100%;
    height: .98rem; 
    line-height: .98rem;
    font-size: .28rem;
    text-align: center;
    background: #fff;
    position: fixed;
    bottom: 0;
}
</style>

