<template>
<!-- 配件活动列表 -->
    <div class="peijian-warp">
        <!-- 搜索框 -->
        <searchbar :content="this.searchName" isHome="true"></searchbar>

        <!-- 商品列表 -->
        <div class="list-warp" v-if="list.length !== 0">
            <div class="list" v-for="(item,index) in list" :key="index" @click="goDetail(item.id)" >
                <div class="img">
                    <img :src="item.img+'@100w_100h_1e_1c.jpg'">
                </div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="price">
                        <span class="new">￥{{item.price}}</span>
                        <span class="old">￥{{item.originalPrice}}</span>
                        <div class="chajia"> <span>省</span> <span>￥{{item.originalPrice - item.price}}</span></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="list-warp-kong" v-else>
            <img src="@/assets/img/notfound.png" style="width: 2.57rem;">
            <p class="text-gray">暂无相关商品！</p>
        </div>
    </div>

</template>

<script>
import searchbar from '@/components/searchbar';
import {getFittingsList} from '../../api/index.js'
export default {
    data(){
        return{
            list:[],
            searchText:""
        }
    },
    components:{
      searchbar
    },
    methods:{
        goDetail(id){
            this.$router.push(`/peijian/detail?id=${id}&utm_source=${localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source}&utm_medium=${localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium}`)
        }
    },
    mounted(){
        document.title="商品列表";
        let data={
            utmSource:localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source,
            utmMedium:localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium,
            categoryId:"15",
            productId:this.$route.query.productId === ''?'':this.$route.query.productId
        }
        getFittingsList(data).then(res=>{
            if (res.code === '0') {
                this.list = res.body.fittingsResponseList;
            }else{
                this.$showToast(res.message)
            }
        })
    }
}
</script>

<style lang="less" scoped>
.peijian-warp{
    overflow: hidden;
    .search-bar{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 1.1rem;
        background: #fff;
        overflow: hidden;
        display: flex;
        padding: .15rem 0;
        font-size: .28rem;

        .back{
            line-height: .8rem;
            padding: 0 .15rem;
            color: #353535;
            i::before{
                font-size: .54rem
            }
        }
        .search{
            width: 5.6rem;
            height: .78rem;
            border:  solid .01rem #f2f2f2;
            border-radius: .16rem;
            line-height: .78rem;
            i{
                margin: 0 .15rem
            }
            input{
                border: none; 
                background: transparent;
            }
            span{
                font-size: .24rem;
                padding: 4px;
                color: #fff;
                border-radius: 4px;
                background: #808080;
            }
        }
        .kefu{
            display: flex;
            margin: .02rem auto;
            color: #353535;
            flex-direction:column;
            i{
                margin:  0 auto;
            }
        }

    }

    .list-warp{
        margin: 1.4rem auto .3rem;
        width: 100%;
        .list{
            width: 6.9rem;
            background: #fff;
            margin: .3rem auto;
            border-radius: .16rem;
            padding: .2rem .27rem;
            display: flex;
            box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;

            .img{
                width: 1.8rem;
                height: 1.8rem;
                margin-right: .25rem;
                img{
                    display: block;
                    width: 100%;
                    height: 100%;
                }
            }
            .info{
                width: 4.4rem;
                display: flex;
                flex-direction:column;
                justify-content: space-between;
                padding: .1rem 0;
                .name{
                    font-size: .3rem;
                    color: #252525;
                }
                .price{
                    .new{
                        font-size: .3rem;
                        color: #EB2828;
                        font-weight: bold;
                    }
                    .old{
                        font-size: .2rem;
                        color: #999999;
                        text-decoration: line-through;
                        margin-left: .15rem;
                    }
                    .chajia{
                        float: right;
                        background: #FFE5E5;
                        height: .32rem;
                        border-radius: .08rem;
                        overflow: hidden;
                        padding-right: .1rem;
                        margin-top: .03rem;
                        span{
                            &:first-child{
                                display: inline-block;
                                width: .35rem;
                                height: .35rem;
                                background: #EB2828;
                                font-size: .16rem;
                                text-align: center;
                                line-height: .32rem;
                                color: #fff;
                            }
                            &:last-child{
                                font-size: .16rem;
                                color: #333333;
                            }
                        }
                    }
                }
            }
        }
    }

    .list-warp-kong{
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, 50%);
        text-align: center;
    }
    
}
</style>

