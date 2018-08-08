<template>
    <!-- 安卓促销列表 -->
    <div class="android-warp">
        <div class="head">
            <img src="../../img/android/mi.png" v-if="$route.query.id === '9'">
            <img src="../../img/android/oppo.png" v-if="$route.query.id === '12'">
            <img src="../../img/android/vivo.png" v-if="$route.query.id === '13'">
            <img src="../../img/android/sumsung.png" v-if="$route.query.id === '7'">
            <img src="../../img/android/huawei.png" v-if="$route.query.id === '5'">
        </div>
        <div class="main">
            <div class="list-warp">
                <div class="product-item" v-for="item in list" :key="item.id">
                    <router-link :to="'/product/detail?serialNumber='+item.serialNumber+'&utm_source='+utmSource+'&utm_medium='+utmMedium" class="item-link">
                    <div class="product-pic">
                        <img :src="item.skuPicture + '@200w_240h_1e_1c.jpg'">
                    </div>
                    <div class="product-detail">
                        <div class="product-name detail-row">
                        <span class="item-chengse bg-yellow">{{item.pskuCondition}}</span>
                        <span class="item-name">{{item.skuName}}</span>
                        </div>
                        <div class="product-tag detail-row">
                        <ul class="tag-list">
                            <li v-if="item.skuOrigin" class="tag-item">{{item.skuOrigin}}</li>
                            <li v-if="item.skuMaintenance" class="tag-item" v-for="subItem in item.skuMaintenance" :key="subItem">
                            {{subItem}}
                            </li>
                        </ul>
                        </div>
                        <div class="product-price detail-row">
                        <div class="detail-price">
                            <span class="current-price text-red"><i class="font-rmb">￥</i>{{item.price}}</span>
                            <span class="original-price text-gray"><i class="font-rmb">￥</i>{{item.newPrice}}</span>
                        </div>
                            <div class="save">
                            <i class="s-text bg-red">省</i>
                            <span class="s-amount">
                                <i class="font-rmb">￥</i>{{item.newPrice - item.price}}
                            </span>
                            </div>
                        </div>
                    </div>
                    </router-link>
                </div>
            </div>
            <a href="/index" class="more" @click="statisticsMore"></a>
        </div>
        <div class="zhezhao"></div>
    </div>
</template>

<script>
import { getMoreBrandSkuList } from '../../api/index.js'
export default {
    data(){
        return{
            list:[],
            utmSource:"",
            utmMedium:"",
            pageSize:5,
            pageNumber:1
        }
    },
    methods:{
        statisticsMore(){
            _paq.push(['trackEvent', 'activity', 'act.android.more','home' ]);    
        },
        getSkuList(){
            let data = {
                utmSource:this.$route.query.utm_source||'kj',
                utmMedium:this.$route.query.utm_medium||'mobile',
                id:this.$route.query.id||'12'
            }
            getMoreBrandSkuList(data).then(res=>{
                if (res.code === '0') {
                    this.list = res.body;
                } else {
                    this.$showToast(res.message)
                }
            })
        }
    },
    created(){
        document.title = '哐叽-安卓特卖会';
        this.getSkuList();
        this.utmSource = localStorage.getItem('utm_source')||'kj';
        this.utmMedium = localStorage.getItem('utm_medium')||'act_defult';
    }
}
</script>

<style lang="less" scoped>
.zhezhao{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url('../../img/android/bg.png');
    z-index: -1;
}
.android-warp{
    overflow: hidden;
    .head{
        width: 100%;
        height: 1.65rem;
        background: url('../../img/android/listhead.png') no-repeat;
        background-size: 100% 100%;
        img{
            display: block;
            width: 5.12rem;
            height: 1.42rem;
            margin: 0 auto;
            transform: translateY(.38rem);
        }
    }
    .main{
        overflow: hidden;
        background: url('../../img/android/bg.png');
        .list-warp{
            width: 6.9rem;
            margin: .1rem auto;
            .product-item {
                padding: .1rem .2rem;
                margin: .2rem 0;
                border-radius: 8px;
                box-shadow: 1px 3px 6px -3px #ddd;
                // box-shadow: 0 0 5px 1px #eee;
                background: #fff;
                .item-link {
                display: flex;
                }
                .product-pic {
                width: 2rem;
                img {
                    width: 100%;
                }
                }
                .product-detail {
                flex: 1;
                padding-left: .2rem;
                .product-name {
                    // display: flex;
                    height: 1rem;
                    overflow: hidden;
                    padding-top: .14rem;
                    margin-bottom: .01rem;
                    font-weight: bolder;
                    line-height: 1.6;
                    .item-chengse {
                    width: 1rem;
                    height: .36rem;
                    margin-right: .1rem;
                    padding: .1rem .12rem .06rem;
                    border-radius: .2rem;
                    font-size: .2rem;
                    position: relative;
                    top: -0.04rem;
                    }
                    .item-name {
                    font-size: .28rem;
                    }
                }
                .product-tag {
                    .tag-list {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: .04rem;
                    .tag-item {
                        height: .36rem;
                        padding: 0.02rem .14rem 0;
                        line-height: .36rem;
                        margin: 0 .1rem .1rem 0;
                        font-size: .2rem;
                        border-radius: .08rem;
                        background: #fff8d0;
                        // border: 1px solid #f3c91e;
                        &:last-child {
                        margin-right: 0;
                        }
                    }
                    }
                }
                .product-price {
                    display: flex;
                    justify-content: space-between;
                    margin-top: .3rem;
                    .current-price {
                    font-size: .36rem;
                    font-weight: bolder;
                    .font-rmb {
                        font-size: .24rem;
                    }
                    }
                    .original-price {
                    margin-left: .1rem;
                    text-decoration: line-through;
                    }
                    .save {
                    display: flex;
                    width: 1.28rem;
                    height: .38rem;
                    line-height: .38rem;
                    padding: 0;
                    border-radius: .08rem;
                    border:1px solid #eb2828;
                    overflow: hidden;
                    .s-text {
                        position: relative;
                        top: -0.01rem;
                        left: -0.01rem;
                        display: inline-block;
                        height: .38rem;
                        line-height: .38rem;
                        padding: 0 .08rem;
                        color: #fff;
                        font-size: .2rem;
                        font-weight: normal;
                    }
                    .s-amount {
                        display: inline-block;
                        height: 100%;
                        padding-left: .06rem;
                        font-size: .22rem;
                    }
                    }
                }
                }
            }
        }
        .more{
            background: url('../../img/android/more.png') no-repeat;
            background-size: 100% 100%;
            display: block;
            width: 3rem;
            height: .6rem;
            margin: .2rem auto;
            border-radius: .16rem; 
        }
    }
    
}
</style>

