<template>
  <div class="swiper-container" id="mySwiper1">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item,index) in list" :key="index">
          <div class="userInfo">{{item.userName}}</div>
          <div class="jixing">
            <span>{{item.name}}</span>
            <span style="float:right;">{{item.dtCreated}}</span>
          </div>
          <div class="miaoshu">
            {{item.content}}
          </div>
          <div class="img">
            <ul>
              <li v-for="(it,index) in item.picture" :key="index">
                <img :src="it" alt="">
              </li>
            </ul>
          </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue';
  import 'swiper/dist/css/swiper.min.css';
  import Swiper  from'swiper'
  import{getReviewList} from '../api/index'
	export default {
		name: "x-f-f-k",
    data(){
		  return({
        list:[]
      })
    },

    async mounted(){
      let userSayList = await getReviewList({sum:4})
      this.list = userSayList.body;
      Vue.nextTick(()=>{
        setTimeout(()=>{
          var swiper = new Swiper('#mySwiper1', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 10,
            initialSlide:1,

          });
        },1000)
      })
    }
	}
</script>

<style scoped lang="less">
.swiper-container{
  width:100%;
  height:4.2rem;
}
.swiper-slide{
  width:6.6rem !important;
  height:4.2rem;
  background:white;
  border-radius: 0.16rem;
  padding:0.4rem;
  .userInfo{
    width:100%;
    height:0.4rem;
    line-height:0.4rem;
  }
  .jixing{
    width:100%;
    height:0.3rem;
    line-height:0.3rem;
    margin-top:0.1rem;
    color:#999;
  }
  .miaoshu{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    width:100%;
    height:54px;
    margin-top:0.3rem;
    color:#999;
    font-size:12px;

  }
  .img{
    width:100%;
    height:1.2rem;
    overflow: hidden;
    margin-top:0.2rem;
    ul{
      li{
        width:1.2rem;
        height:1.2rem;
        float:left;
        margin-right:10px;
        img{
          width:100%;
          height:100%;
        }
      }
    }
  }
}

</style>
