<template>
     <div class="coupon-card" @click.stop="handleClick(data)" :class="{'disabled': disabled}">
        <div class="card-header">
            <div class="amount">
                <i class="font-rmb">￥</i>
                <span>{{data.value}}</span>
            </div>
            <div class="text">
                <p class="text-1">现金券</p>
                <p class="text-2">{{data.remark}}</p>
            </div>
        </div>
        <div class="card-body">
            <p>品类限制： 商品金额超过{{data.useLine}}元可用</p>
            <p class="validity text-gray">有效期：{{data.startTime}} 至 {{data.endTime}}</p>
        </div>
    </div>
</template>
<script>
import { timestampToDate } from '@/utils.js'
export default {
    name: 'coupon',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        data: Object
    },
    computed: {
        startTime() {
            return timestampToDate(this.data.startTime)
        },
        endTime() {
            return timestampToDate(this.data.endTime)
        }
    },
    methods: {
        handleClick(coupon) {
            this.$emit('couponClick', coupon)
        }
    }
}
</script>

<style lang="scss" scoped>
    .coupon-card {
        width: 100%;
        height: 2.46rem;
        background: url('../assets/img/coupon.png') no-repeat top;
        background-size: 100% 100%;
        &.disabled {
            opacity: .6;
        }
        .card-header {
            display: flex;
            justify-content: space-around;
            padding: .3rem .2rem;
            .amount {
                margin-left: -0.4rem;
                font-size: .76rem;
                font-weight: bolder;
                .font-rmb {
                    position: relative;
                    top: -0.2rem;
                    font-size: .4rem;
                }
                span {
                    margin-left: -0.2rem;
                }
            }
            .text {
                position: relative;
                top: .18rem;
                .text-1 {
                    margin-bottom: .1rem;
                    font-weight: bolder;
                    font-size: .32rem;
                }
                .text-2 {
                    font-size: .24rem;
                }
            }
        }
        .card-body {
            padding: .1rem .3rem;
            p {
                line-height: 1.5;
            }
        }
    }
</style>
