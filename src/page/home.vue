<template>
    <div class="page">
        <div v-title :data-title="$route.name"></div>
        <searchbar></searchbar>
        <!-- banner -->
        <div class="banner-wrap">
            <div id="bannerSwiper" class="swiper-container">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(item,index) in bannerList" :key="index">
                      <a :href="`${item.mHref}?stamp=${new Date().getTime()}`">
                          <img :src="item.mPic">
                      </a>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <!-- 导航区 -->
        <div class="container">
          <div class="navbar">
            <ul class="nav-list">
              <li v-for="(item, index) in navList" :key="index">
                  <router-link :to="item.path" @click.native="handleNavClick(item)">
                    <img :src="item.imgUrl">
                    <span>{{item.text}}</span>
                  </router-link>
              </li>
            </ul>
          </div>
        </div>
        <!-- 热门机型 -->
        <div class="pop-section container">
          <h3 class="title">热门机型</h3>
          <ul class="pop-list">
            <li class="pop-item" v-for="(item, index) in popList" :key="index">
              <router-link :to="`/product/list?productId=${item.id}&model=${item.name}&stamp=${new Date().getTime()}`" @click.native="handleActivityClick(item)">
                <img :src="item.picUrl">
              </router-link>
            </li>
          </ul>
        </div>
        <!-- 评论区 -->
        <div class="review-area">
            <h3 class="title">消费者反馈</h3>
            <div id="reviewSwiper" class="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide review-item" v-for="(item,index) in reviewList" :key="index">
                        <div class="user">{{item.userName}}</div>
                        <div class="model">
                            <span>{{item.name}}</span>
                            <span>{{item.dtCreated}}</span>
                        </div>
                        <div class="review-content ellipsis-3">{{item.content}}</div>
                        <ul class="review-pic">
                            <li v-for="(pic, index) in item.picture" :key="index" @click="showPicture(pic)">
                                <img :src="pic" onclick="return false;">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="swiper-pagination"></div>
            </div>
        </div>
        <tabbar></tabbar>
        <div v-show="picShow" class="page-layer" @click="picShow = false">
            <img ref="previewPic" :src="picUrl" onclick="return false;"> 
        </div>
    </div>
</template>
<script>
import tabbar from "@/components/tabbar";
import searchbar from "@/components/searchbar";
import { getBanner, getBaoKuan, getHotProduct, getReviewList } from "@/api";
export default {
  name: "aliveHome",
  data() {
    return {
      bannerList: [],
      hotInfo: {},
      reviewList: [],
      picUrl: '',
      picShow: false,
      navList: [
        {
          path: '/product/list?productId=2196&model=iPhone 7 Plus&stamp='+new Date().getTime(),
          imgUrl: '//imgs.kjershou.com/static/navbar/icon-remen.png',
          text: '爆款',
        },
        // {
        //   path: '/receivecoupons?stamp='+new Date().getTime(),
        //   imgUrl: '//imgs.kjershou.com/static/navbar/icon-youhui.png',
        //   text: '优惠券',
        // },
        {
          path: '/support/purchase?stamp='+new Date().getTime(),
          imgUrl: '//imgs.kjershou.com/static/navbar/icon-caigou.png',
          text: '企业采购',
        },
        {
          path: '/zhibao?stamp='+new Date().getTime(),
          imgUrl: '//imgs.kjershou.com/static/navbar/icon-zhibao.png',
          text: '质量保证',
        },
      ],
      popList: [],
    };
  },
  components: {
    searchbar,
    tabbar,
  },
  methods: {
    // 获取banner
    getBannerList() {
      getBanner().then(res => {
        if (res.code === "0") {
          this.bannerList = res.body;
          this.$nextTick(() => {
            setTimeout(() => {
              new Swiper("#bannerSwiper", {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 0,
                initialSlide: 0,
                autoplay: {
                  disableOnInteraction: true
                },
                pagination: {
                  el: ".swiper-pagination"
                },
              })
            }, 500)
          })
        } else {
          this.$showToast(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取爆款详情
    getHotDetail() {
      getBaoKuan().then(res => {
        if (res.code === "0") {
          this.hotInfo = res.body;
        } else {
          this.$showToast(res.message);
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getHotProductList() {
      getHotProduct().then(res => {
        if(!res.body) return;
        if(res.code === '0') {
          this.popList = res.body;
        } else {
          this.$showToast(res.message)
        }
      })
    },
    // 评论列表
    getReviews() {
      getReviewList().then(res => {
        if (res.code === "0") {
          this.reviewList = res.body;
          this.$nextTick(() => {
            setTimeout(() => {
              new Swiper("#reviewSwiper", {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 10,
                initialSlide: 1
              })
            }, 200)
          });
        } else {
          this.$showToast(res.message);
        }
      }).catch(err => {
         console.log(err)
      })
    },
    // 导航栏点击处理
    handleNavClick(item) {
      switch(item.text) {
        case '爆款':
          _paq.push(['trackEvent', '20.HomePage', '20.11.Icon', '20.11.10.HotModel']);
          break;
        case '优惠券':
          _paq.push(['trackEvent', '20.HomePage', '20.11.Icon', '20.11.10.Coupon']);
          break;
        case '企业采购':
          _paq.push(['trackEvent', '20.HomePage', '20.11.Icon', '20.11.10.CorpTestPhone']);
          break;
        case '质量保证':
          _paq.push(['trackEvent', '20.HomePage', '20.11.Icon', '20.11.10.Quality']);
          break;
      }
    },
    //热门机型点击处理 
    handleActivityClick(item) {
      switch(item.name) {
        case 'iPhone 7 Plus':
          _paq.push(['trackEvent', '20.HomePage', '20.12.Activity', '20.12.10.iPhone 7 Plus']);
          break;
        case 'iPhone 7':
          _paq.push(['trackEvent', '20.HomePage', '20.12.Activity', '20.12.11.iPhone 7']);
          break; 
        case 'iPhone 6s':
          _paq.push(['trackEvent', '20.HomePage', '20.12.Activity', '20.12.12.iPhone 6s']);
          break; 
        case 'iPhone 6':
          _paq.push(['trackEvent', '20.HomePage', '20.12.Activity', '20.12.13.iPhone 6']);
          break; 
      }
    },
    showPicture(picUrl) {
      this.picShow = true;
      this.picUrl = picUrl;
    }
  },
  mounted() {
    this.getBannerList();
    this.getHotProductList();
    this.getReviews();
  }
};
</script>
<style scoped lang="scss">
.container {
  padding: .3rem;
}
.banner-wrap {
  margin-top: 0.98rem;
  background: #ededed;
  .swiper-container {
    height: 4rem;
    .swiper-slide {
      img {
        width: 100%;
      }
    }
  }
}
.nav-box {
  display: flex;
  width: 100%;
  height: 4.2rem;
  background: #fff;
  border-radius: 0.16rem;
  border: 1px solid #e5e5e5;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .nav-item {
    display: flex;
    .item-pic {
      width: 1rem;
      padding: 0.3rem 0.1rem;
    }
    .item-text {
      flex: 1;
      padding-top: 0.3rem;
      p {
        line-height: 1.6;
      }
    }
  }
  .box-left {
    border-right: 1px solid #e5e5e5;
    .nav-item-hot {
      height: 2.8rem;
      padding: 0.2rem 0.1rem 0 0.3rem;
      border-bottom: 1px solid #e5e5e5;
      position: relative;
      .hot-title {
        margin-bottom: 0.1rem;
        font-size: 0.28rem;
        font-weight: bolder;
      }
      .hot-name {
        font-size: 0.22rem;
      }
      .hot-pic {
        position: absolute;
        bottom: 0;
        right: 0.1rem;
        display: flex;
        justify-content: flex-end;
        width: 2rem;
        height: 1.8rem;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .nav-item {
      flex: 1;
    }
  }
  .box-right {
    .nav-item {
      border-bottom: 1px solid #e5e5e5;
      > a {
        display: flex;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
.navbar {
  position: relative;
  top: -0.6rem;
  z-index: 9;
  height: 2.3rem;
  padding: .28rem .3rem;
  line-height: 2rem;
  margin: auto;
  background: #fff;
  border-radius: .16rem;
  box-shadow: 1px 3px 6px -3px #ddd;
  .nav-list {
    display: flex;
    li {
      flex: 1;
      a {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        line-height: 1;
        text-align: center;
        img {
          width: 1.4rem;
        }
        span {
          font-size: .28rem;
        }
      }
    }
  }
}
.pop-section {
  min-height: 2rem;
  margin-top: -0.6rem;
  .title {
    margin-bottom: .3rem;
    font-size: .4rem;
    font-weight: bolder;
  }
  .pop-list {
    li {
      margin-bottom: .3rem;
      img {
        width: 100%;
        border-radius: .16rem;
        box-shadow: 1px 3px 6px -3px #ddd;
      }
    }
  }
}
.review-area {
  margin-bottom: .6rem;
    .title {
        margin: 0 .3rem .3rem;
        font-weight: bolder;
        font-size: .4rem;
    }
    .swiper-container {
        width: 100%;
        // height: 3.3rem;
        height: 4.2rem;
        .swiper-slide {
          width: 6.6rem !important;
          // height: 3rem;
          border-radius: 0.16rem;
          background: #fff;
          box-shadow: 1px 3px 6px -3px #ddd;
          a {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 0.16rem;
            img {
              width: 100%;
              height: 100%;
              border-radius: 0.16rem;
            }
          }
        }
    }
    // .swiper-container {
    //     height: 4.2rem;
    //     .swiper-slide {
    //       box-shadow: none;
    //       border: 1px solid #ddd;
    //     }
    // }
  .review-item {
    height: 4.2rem;
    padding: 0.4rem;
    .model {
      display: flex;
      justify-content: space-between;
      margin-top: .2rem;
      font-size: 0.22rem;
      color: #999;
    }
    .review-content {
      height: .96rem;
      margin: .2rem 0;
      line-height: 1.4;
      color: #666;
      overflow: hidden;
    }
    .review-pic {
      display: flex;
      li {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.2rem;
        &:last-child {
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
</style>
