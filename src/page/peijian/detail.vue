<template>
    <!-- 配件详情 -->
    <div class="peijian-warp" ref="tabmodule">
        <!-- 导航 -->
        <div class="tabbar-warp">
            <i class="iconfont icon-fanhui1 back" @click="$router.back()"></i>
            <div class="tabbar">
                <div v-for="(item,index) in tablist"
                    :key="index"
                    :class="{activ : index === tabindex}"
                    @click="tab(index)"
                >{{item}}</div>
            </div>
        </div>
        <!-- 商品 -->
        <div class="commodity  module">
            <!-- 轮播 -->
            <div class="banner-wrap">
                <div id="bannerSwiper" class="swiper-container" style="width: 100%; height: 5.44rem;">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in showImgList" :key="index">
                            <img :src="item" style="width: 100%; height: 5.44rem;">
                        </div>
                    </div>
                </div>
                <div class="indicator">
                    <span>{{bannerIndex}}/{{showImgList.length}}</span>
                </div>
            </div>
            <div class="name">{{name}}</div>
            <div class="price"><span>￥</span>{{price}}</div>
            <!-- 质保-->
            <div class="warranty-warp">
                <div class="warranty">
                    <div>
                        <img src="@/assets/img/icon-7day.png" class="icon">
                        <span>质保，七天无理由换货</span>
                    </div>
                    <div>
                        <img src="@/assets/img/icon-wrench.png" class="icon">
                        <span>30天质保，只换不修</span>
                    </div>
                </div>
            </div>
            <!-- 支付方式 -->
            <div class="payment">
                <span>支付方式</span>
                <img src="@/assets/img/icon-alipay.png" class="icon">
                <img src="@/assets/img/icon-wxpay.png" class="icon">
            </div>
            <!-- 售后 -->
            <div class="aftersale">
                <img src="../../img/pj_afteralse.png">
            </div>
            <!-- 常见问题 -->
            <div class="problem">
                <img src="../../img/pj_problem.png">
                <div class="more">
                    查看更多常见问题
                </div>
            </div>
        </div>
        <!-- 评价 -->
        <div class="evaluation module">
            <div class="ev-header">
                <img src="../../img/pj_fankui.png">
            </div>
            <div class="ev-body">
                <ul class="evaluation-list">
                    <li class="evaluation-item" v-for="(item, index) in evaluationList" :key="index">
                        <div class="item-header">
                            <div class="user">{{item.userName}}</div>
                            <div class="device">
                                <span>购买机型：{{item.name}}</span>
                                <span class="ev-date text-gray">{{item.dtCreated}}</span>
                            </div>
                        </div>
                        <div class="item-body">
                            <div class="ev-content">
                                <p>{{item.content}}</p>
                            </div>
                            <ul class="ev-pic-list">
                                <li class="pic" v-for="(picUrl, index) in item.picture" :key="index">
                                    <img :src="picUrl" @click="showPicture(picUrl)">
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 详情 -->
        <div class="detail  module">
            <div class="detail-header">
                <img src="../../img/pj_detail.png">
            </div>
            <div class="detail-body">
                <img v-for="(item,index) in detailImgList" :key="index" :src="item" alt="">
            </div>
        </div>
        <!-- 立即购买 -->
        <div class="buy">
            <div class="kefu" v-kefu>
                <i class="iconfont icon-erji"></i>
                <span>客服</span>
            </div>
            <div class="price">
                ￥{{price}}
            </div>
            <div class="buy-bth" @click="buy">
                立即购买
            </div>
        </div>
    </div>
</template>

<script>
import { getReviewList,getFittingsDetails } from '../../api/index.js'
export default {
    data(){
        return{
            tablist:['商品','评价','详情'],
            tabindex:0,
            tabBodyHeight:[],
            isBackShow:null,
            name:"",
            price:"",
            skuid:"",
            evaluationList:[],
            detailImgList:[],
            showImgList:[],
            bannerIndex: 1,
            swiper: null,
        }
    },
    methods:{
        // 选项卡切换
        tab(index){
            this.tabindex=index;
            window.scrollTo(0, this.tabBodyHeight[index] + 1);
        },
        // 获取各个模块的高度
        getoffsettop(){
            let tabList = this.$refs.tabmodule.getElementsByClassName("module");
            for (let i = 0; i < tabList.length; i++) {
                let item = tabList[i];
                this.tabBodyHeight.push(tabList[i].offsetTop-50);
            }
        },
        // 滚动监听
        scrollEvent() {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                let scrollY =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop;
                this.highLightCurrentTab(Math.round(scrollY));
                this.isBackShow = scrollY > 45 ? true : false;
            }, 20);
        },
        // 高亮当前选择
        highLightCurrentTab(scrollY) {
            let lastNavIndex = this.tablist.length - 1;
            if (scrollY < this.tabBodyHeight[0]) {
                this.tabindex = 0;
                return;
            } else if (scrollY > this.tabBodyHeight[lastNavIndex]) {

                this.tabindex = lastNavIndex;
                return;
            }
            for (let i = 0; i < this.tabBodyHeight.length; i++) {
                if (
                scrollY >= this.tabBodyHeight[i] &&
                scrollY <= this.tabBodyHeight[i + 1]
                ) {
                    this.tabindex = i;
                }
            }
        },
         // 评论列表
        getEvaluations() {
            getReviewList().then(res => {
                if (res.code === "0") {
                    this.evaluationList = res.body;
                } else {
                    this.$showToast(res.message);
                }
            });
        },
        // 产品详情
        FittingsDetails(){
            let data = {
                utmSource:localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source,
                utmMedium:localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium,
                categoryId:15,
                skuId:this.$route.query.id
                }
            getFittingsDetails(data).then(res=>{
                if (res.code === '0') {
                    this.name = res.body.name;
                    this.price = res.body.price;
                    this.skuid = this.$route.query.id;
                    this.detailImgList = res.body.detailImgList;
                    this.showImgList = this.showImgList.concat(res.body.detailImgList[0]);
                    this.showImgList = this.showImgList.concat(res.body.detailImgList[1]);
                    let that = this;
                    this.bannerIndex = 1;
                    if(this.swiper !== null) {
                        this.swiper.autoplay.stop();
                    }
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.swiper = new Swiper("#bannerSwiper", {
                            slidesPerView: "auto",
                            centeredSlides: true,
                            spaceBetween: 0,
                            initialSlide: 0,
                            loop:true,
                            autoplay: {
                                disableOnInteraction: true,
                            },
                            on: {
                                slideChangeTransitionStart() {
                                    that.bannerIndex = this.realIndex + 1;
                                }
                            }
                            })
                        }, 500)
                    });
                }else{
                    this.$showToast(res.message)
                }
                
            })
        },
        // 去下单
        buy(){
            this.$router.push(`/peijian/order?skuid=${this.skuid}&utm_source=${localStorage.getItem('utm_source')?localStorage.getItem('utm_source'):this.$utm_source}&utm_medium=${localStorage.getItem('utm_medium')?localStorage.getItem('utm_medium'):this.$utm_medium}`)
        }

    },
    mounted(){
        document.title = '商品详情';
        this.FittingsDetails();
        this.getEvaluations();
        setTimeout(() => {
            this.getoffsettop();
            window.addEventListener('scroll', this.scrollEvent)
        }, 500);
    }
}
</script>

<style lang="less" scoped>
 .peijian-warp{
    width: 100%;
    overflow: hidden;
    background: #fff;

    .tabbar-warp{
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        position: fixed;
        top: 0;
        left: 0;
        background: #fff;
        z-index: 10;
        .back{
            position: absolute;
            left: .3rem;
            font-size: .54rem;
            top: 50%;
            transform: translateY(-50%);

        }
        .tabbar{
            width: 2.6rem;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            font-size: .24rem;
            .activ{
                font-weight: bold;
                 position: relative;
                &:after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: .04rem;
                    background: #f3c91e;
                    border-radius: 5rem;
                }
            }
        }
    }

    .commodity{
        margin-top: 1rem;
        .banner-wrap{
            width: 100%;
            height: 5.44rem;
            position: relative;
            .indicator {
                z-index: 10;
                position: absolute;
                bottom: 0.3rem;
                right: 0.3rem;
                padding: 2px 8px;
                color: #fff;
                font-size: 12px;
                letter-spacing: 2px;
                border-radius: 15px;
                background: rgba(0, 0, 0, 0.5);
            }

        }
        .name{
            width: 6.9rem;
            margin: .5rem auto .4rem;
            font-size: .32rem;
            font-weight: bold;
            color: #353535;
            line-height: .48rem;

        }
        .price{
            width: 6.9rem;
            margin: 0 auto .4rem;
            font-size: .48rem;
            color: #EB2828;
            span{
                font-size: .36rem;
            }
        }
        .warranty-warp{
            width: 100%;
            background: #fafafa;
            overflow: hidden;
            .warranty{
                width: 100%;
                margin: .14rem auto;
                display: flex;
                height: .68rem;
                background: #f2f2f2;
                line-height: .74rem;
                justify-content: space-around;
               div{
                   position: relative;
                   span{
                       font-size: .24rem;
                       color: #353535;
                       margin-left: .5rem;
                   }
               }
                .icon{
                    width: .35rem;
                    height: .35rem;
                    display: inline-block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }
        .payment{
            width: 100%;
            padding: 0 .3rem;
            height: .68rem;
            span{
                font-size: .24rem;
                color: #999;
                line-height: .68rem;
            }
            .icon{
                height: .3rem;
                width: auto;
                display: inline-block;
                vertical-align: middle;
                margin-left: .38rem;
            }
        }
        .aftersale{
            background: #fafafa;
            padding-top: .3rem;

            img{
                width: 100%;
                height: auto;
            }
        }
        .problem{
            background: #fafafa;
            padding-top: .25rem;
            img{
                width: 100%;
                display: block;
                height: auto;
            }
            .more{
                width: 100%;
                height: .9rem;
                text-align: center;
                line-height: .9rem;
                font-size: .3rem;
                color: #FFD428;
                background:#fff;
            }
        }
    }

    .evaluation {
    margin: 0;
    background: #fff;
    .ev-header {
        background: #fafafa;
        padding: .5rem  0 .3rem;
        img{
            display: block;
            width: 3rem;
            height: auto;
            margin: 0 auto;
        }
    }
    .ev-body {
        margin: 0.3rem auto;
        width: 6.9rem;

        .evaluation-item {
        margin-top: 0.3rem;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid #f2f2f2;
        &:last-child {
            padding-bottom: 0;
            border-bottom: 0;
        }
        .item-header {
            .user {
            font-weight: bolder;
            margin-bottom: 0.1rem;
            }
            .device {
            display: flex;
            justify-content: space-between;
            }
        }
        .item-body {
            margin-top: 0.3rem;
            .ev-content {
            margin: 0.3rem 0;
            }
            .ev-pic-list {
            display: flex;
            flex-wrap: wrap;
            .pic {
                width: 1.2rem;
                height: 1.2rem;
                margin-right: 0.2rem;
                &.last-child {
                margin-right: 0;
                }
                img {
                width: 100%;
                height: 100%;
                }
            }
            }
        }
        }
    
        }
    }
    .detail{
        .detail-header{
            background: #f2f2f2;
            padding: .5rem 0 .3rem;
            img{
                width:2.8rem;
                height: auto;
                display: block;
                margin: 0 auto;
            }
        }
        .detail-body{
            overflow: hidden;
            margin-bottom: .96rem;
            img{
                display: block;
                width: 100%;
                height: auto;
            }
        }
    }

    .buy{
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

        .kefu{
            padding-top: .15rem;
            display: flex;
            width: 1.6rem;
            color: #353535;
            text-align: center;
            flex-direction:column;
            i{
                margin:  0 auto;
            }
        }
        .price{
            line-height: .96rem;
            font-size: .32rem;
            color: #EB2828;
        }
        .buy-bth{
            width: 3.04rem;
            height: 100%;
            text-align:center;
            line-height: .96rem;
            background: #EB2828;
            color: #fff;
            font-size: .32rem;
        }
        
    }

}   
</style>
