<template>
    <div style="margin-top:0.15rem;">
      <div class="title">
        限时抢购
        <div class="time" v-if="today" style="color:red;">敬请期待</div>
        <div class="time" v-if="noStart">活动&nbsp;<span style="color:#eb2828">{{startHour}}:{{startMin.toString().length ==1?'0'+startMin:startMin}}</span>&nbsp;开始</div>
        <div class="time" v-if="active">倒计时&nbsp;&nbsp;
          <span class="h">{{second}}</span>
          <span style="float:right;">:</span>
          <span class="h">{{min}}</span>
          <span style="float:right;">:</span>
          <span class="h">{{h}}</span>
        </div>
      </div>
      <div>
        <ul>
          <li v-for="(item,index) in list" :key="index">
            <a :href="`//m.kdyoupin.com/product/flash/${item.itemId}`">
              <div class="img">
                <img :src="item.picture" alt="">
              </div>
              <div class="jixing">
                {{item.name}}
              </div>
              <div class="price">
                <span style="color:red;">¥{{item.afterPrice}}</span>
                <del style="color:#999; font-size:12px;">¥{{item.price}}</del>
              </div>
              <div class="cover-img" v-show="cover">
                <img src="../img/qgl.png" alt="">
              </div>
            </a>
            <div class="cover" v-show="cover"></div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import{getQiangGouList}  from '../api/index'
	export default {
		name: "x-s-q-g",
    data(){
		  return({
        active:false,
        noStart:false,
        cover:true,
        today:false,
        h:0,
        min:0,
        second:0,
        list:[],
        startHour:'00',
        startMin:'00'
      })
    },
    async beforeMount(){
      let list = await getQiangGouList();
      this.list = list.body;
      //状态1 表示进行过的活动，也就表示今天还没有活动，状态2 表示即将开始的活动; today控制的是没有活动的文本展示，cover控制的是覆盖层 nostart是控制的有活动但还没有开始的文本展示，active控制的是活动进行中的倒计时
      if(this.list[0].status == 1){
        this.today = true;
        this.cover = true;
        this.noStart = false;
        this.active = false;
        return
      }

      //有活动,就是以下逻辑
      let startTime =  this.list[0].dtOnline;
      let endTime = this.list[0].dtOffline;

      //console.log(new Date(startTime),new Date(endTime));

      //我的本地时间
      let myTime = new Date(), mySecond = myTime.getTime();
      if(mySecond < startTime){
        //活动没有开始，需要倒计时等活动开始后倒计时
        // console.log(1)
        this.cover = true;
        this.active = false;
        this.today = false;
        this.noStart = true;

        this.startHour = JSON.stringify(new Date(startTime).getHours()).length == 1 ? '0'+JSON.stringify(new Date(startTime).getHours()) : JSON.stringify(new Date(startTime).getHours());
        this.startMin = JSON.stringify(new Date(startTime).getMinutes()).length == 1 ? '0'+ new Date(startTime).getMinutes() : JSON.stringify(new Date(startTime).getMinutes());

        let sec = Math.floor((startTime - mySecond)/1000)
        let t = setInterval(()=>{
          if(sec == 0) {
            clearInterval(t);
            //倒计时结束，活动开始;
            location.reload();
          }
          sec--;
        },1000)
      }
      if(mySecond > startTime && mySecond < endTime){
        //活动进行中
        this.cover = false;
        this.noStart = false;
        this.today = false;
        this.active = true;

        let dis = (endTime - mySecond)/1000;
        let timer = setInterval(()=>{
          if(dis <= 0){
            //活动结束
            clearInterval(timer)
            location.reload()
          }
          this.h = JSON.stringify(Math.floor(dis/3600)).length == 1 ? '0'+JSON.stringify(Math.floor(dis/3600)) : JSON.stringify(Math.floor(dis/3600))

          this.min =  JSON.stringify(Math.floor((dis - this.h*3600)/(60))).length == 1 ? '0' + JSON.stringify(Math.floor((dis - this.h*3600)/(60))) : JSON.stringify(Math.floor((dis - this.h*3600)/(60)));

          this.second = JSON.stringify(Math.floor(dis - this.h*3600 - this.min*60)).length == 1 ? '0' + JSON.stringify(Math.floor(dis - this.h*3600 - this.min*60)) : JSON.stringify(Math.floor(dis - this.h*3600 - this.min*60))
          dis--
        },1000);
      }
      if(mySecond > endTime){
        //活动已结束
        if(this.list[0].status == 1){
          this.today = true;
          this.noStart = false;
          this.cover = true;
          this.active = false;
        }else{
          this.today = false;
          this.noStart = true;
          this.cover = true;
          this.active = false;
        }

      }

    },
    mounted(){

    },
    methods:{

    },
    computed:{

    }
	}
</script>

<style scoped lang="less">
  .title{
    width:100%;
    height:0.72rem;
    line-height:0.72rem;
    font-weight: bold;
    color:#353535;
    font-size:0.32rem;
    position:relative;
  }
  .time{
    position:absolute;
    right:0;
    top:0;
    line-height:0.72rem;
    font-size:0.24rem;
  }
  ul{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  li{
    width:3.3rem;
    min-height:2.85rem;
    border:1px solid #e5e5e5;
    border-radius:0.16rem;
    margin-bottom:0.3rem;
    background:white;
    position:relative;
    border-radius: 0.16rem;
    overflow: hidden;
    padding: 0.1rem 0;
    a{
      display: block;
      width:100%;
      height:100%;
      color:#353535;
    }
    .cover{
      width:100%;
      height:100%;
      position:absolute;
      left:0;
      top:0;
      background:#999;
      opacity: 0.3;
      border-radius: 0.16rem;
    }
    .cover-img{
      position:absolute;
      left:0;
      top:0.2rem;
      width:1rem;
      height:0.3rem;
      img{
        width:100%;
        height:100%;
      }
    }
    .img{
      width:100%;
      height:2.26rem;
      img{
        width:100%;
        height:100%;
      }
    }
    .jixing{
      width:100%;
      height:0.4rem;
      line-height:0.3rem;
      text-align:center;
      font-size:0.24rem;
      padding: 0 0.1rem;
    }
    .price{
      width:100%;
      height:0.6rem;
      padding-top:0.1rem;
      line-height:0.6rem;
      text-align:center;
    }
  }

  .h{
    color:#353535;
    float:right;
    width:22px;
    height:22px;
    line-height:22px;
    text-align:center;
    border-radius:11px;
    background:#f3c91e;
    margin-top:0.13rem;
  }
  .mint-tab-item-label{
    font-size:14px;
  }
</style>
