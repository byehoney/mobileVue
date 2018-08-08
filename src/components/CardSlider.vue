<template>
  <div class="swiper-container" id="mySwiper2">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in bannerList" :key="index">
        <a :href="item.mHref">
          <img :src="item.mPic" alt="">
        </a>
      </div>
    </div>
    <!-- Add Pagination -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import 'swiper/dist/css/swiper.min.css';
  import Swiper  from 'swiper'
  import {getBanner} from '../api/index';
  import { Indicator } from 'mint-ui';
  export default {
    data(){
      return({
        bannerList:[]
      })
    },
    async mounted(){
      // Indicator.open();
      let bannerList =  await getBanner()
      this.bannerList = bannerList.body
      Vue.nextTick(()=>{
        setTimeout(()=>{
          var swiper = new Swiper('#mySwiper2', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 10,
            initialSlide:0,
            autoplay: {
              disableOnInteraction: false
            },
            loop:true,
            pagination: {
              el: '.swiper-pagination'
            },
          });
          // Indicator.close();
        },1000)
      })
    }
  }
</script>

<style scoped lang="less">
  .swiper-container{
    width:100%;
    height:3.3rem;
    margin-top:0.98rem;
  }
  .swiper-slide{
    width:6.6rem !important;
    height:3rem;
    background:white;
    box-shadow: 0px 4px 10px #ccc;
    border-radius:0.16rem;
  }
  a{
    display: block;
    width:100%;
    height:100%;
    border-radius: 0.16rem;
  }
  img{
    width:100%;
    height:100%;
    border-radius: 0.16rem;
  }
</style>
