<template>
    <!-- 领取优惠券 -->
    <div class="receive-coupons-warp">
        <topbar title="领券中心"></topbar>

        <div class="coupons">
            <div class="box">
                <!-- <div class="list" @click="lingqu(item.acode)"  v-for="(item,index) in code" :key="index">
                    <div class="title">优惠券</div>
                    <div class="value">
                        <span>￥</span>
                        <span>{{item.field1}}</span> 
                    </div>
                    <div class="condition">
                        满{{item.field2}}元可用
                    </div>
                    <div class="receive" >
                        立即领取
                    </div>
                </div> -->

                <!-- 电话营销要求只显示一个 -->
                <div class="list" @click="lingqu(oneccoupon.acode)"  >
                    <div class="title">优惠券</div>
                    <div class="value">
                        <span>￥</span>
                        <span>{{oneccoupon.field1}}</span> 
                    </div>
                    <div class="condition">
                        满{{oneccoupon.field2}}元可用
                    </div>
                    <div class="receive" >
                        立即领取
                    </div>
                </div>
            </div>
        </div>


        <div class="rule">
            <div class="title">
                活动规则:
            </div>
            <div>
                <p>1.30元优惠券每个用户每个月各限领一张。</p>
                <!-- <p>2.150元优惠券每月1号开抢，每月限量500张，先到先得。</p> -->
                <p>2.优惠券仅限领取当月有效。</p>
                <p>3.所有配件均不能使用优惠券。</p>
                <p>4.最终解释权归哐叽官网所有。</p>
            </div>
        </div>
    </div>
</template>

<script>
import topbar from '../../components/topbar'
import { fetchCoupon,standardActivityCodeList } from "../../api/index.js"

export default {
    data(){
        return{
            code:[],
            oneccoupon:{}
        }
    },
    components:{
        topbar
    },
    methods:{
        //领取优惠券
        lingqu(val){
            let data = {
                data:val
            }
            fetchCoupon(data).then(res=>{
                if (res.code === '0') {
                    this.$showToast(res.message)
                } 
                else{
                    this.$showToast(res.message)
                }
                
            })
        }
    },
    created(){
        standardActivityCodeList().then(res=>{
            // this.code =res.body;
            
            for (let index = 0; index < res.body.length; index++) {
                if (res.body[index].field1 === '30') {
                   this.oneccoupon = res.body[index];
                   return;
                }
            }
            
        })
    }
}
</script>

<style lang="less" scoped>
.coupons{
    height: 9.03rem;
    background: url('../../img/couponbg.jpg');
    background-size: 100%;
    overflow: hidden;
    .box{
        width: 6.9rem;
        height: 2.8rem;
        margin: 5.35rem auto 0;
        display: flex;
        justify-content:space-around;
        // justify-content:space-between;  电话营销
        
        .list{
            width: 2.17rem;
            height: 2.8rem;
            background: url('../../img/couponsmallbg.png');
            background-size: 100% 100%;
            text-align: center;
            position: relative;
            .title{
                width: 100%;
                position: absolute;
                top: .1rem;
                font-size: .24rem;
            }
            .value{
                font-weight: bold;
                position: absolute;
                top: 0.5rem;
                width: 100%;
                span{
                    &:first-child{
                        position: absolute;
                        top: .2rem;
                        left: .4rem;
                        font-size: .32rem;
                    }
                    &:last-child{
                         position: absolute;
                        top: .1rem;
                        left: .75rem;
                        font-size: .7rem;
                    }
                }
            }
            .condition{
                width: 1.84rem;
                height: .4rem;
                background: #ffe764;
                border-radius: .5rem;
                box-shadow: 0.01rem 0.1rem 0.1rem -.03rem #fff8d0;
                font-size: .22rem;
                line-height: .4rem;
                position: absolute;
                top: 1.5rem;
                left: 50%;
                margin-left: -.92rem;
            }

            .receive{
                height: .7rem;
                position: absolute;
                bottom: -.2rem;
                width: 100%;
            }

        }
    }
}
.rule{
    width: 6.9rem;
    margin: .4rem auto;
    font-size: .24rem;
    color: #999;
    line-height: .4rem;
    .title{
        font-weight: bold;
    }
}
</style>

