<template>
  <div class="pageIndex">
      <Search></Search>
      <div style="background:#ededed; padding-top:0.3rem;">
        <Slider></Slider>
      </div>
    <div class="bg">

      <div class="tese">
        <div class="leftSide">
          <div @click="baokuan" class="baokuan">
            <div>爆款</div>
            <div class="jixing">{{hotName}}</div>
            <div class="jixingimg">
              <img :src="hotPicture" alt="">
            </div>
          </div>
          <div @click="zhibao" class="zhibao">
            <div class="img">
              <img src="../img/zhibao.png" alt="">
            </div>
            <div>
              <span>质量保证</span><br/>
              <span style="color:#999;">海量手机 满足需求</span>
            </div>
          </div>
        </div>
        <div class="rightSide">
          <div @click="iPhone" class="app">
            <div class="img">
              <img src="../img/apple.png" alt="">
            </div>
            <div>
              <span>iPhone专场</span><br/>
              <span style="color:#999;">超低价iPhone等你拿</span>
            </div>
          </div>
          <div @click="hongbao" class="hongbao">
            <div class="img">
              <img src="../img/hongbao.png" alt="">
            </div>
            <div>
              <span>优惠券</span><br/>
              <span style="color:#999;">每月月初定时更新</span>
            </div>
          </div>
          <div @click="caigou" class="caigou">
            <div class="img">
              <img src="../img/caigou.png" alt="">
            </div>
            <div>
              <span>企业采购</span><br/>
              <span style="color:#999;">海量手机 优价采购</span>
            </div>
          </div>
        </div>
      </div>
      <XSQG></XSQG>
    </div>
    <div class="check">
      <SelectPhone></SelectPhone>
    </div>
    <div class="custom">
      <div class="titl">消费者反馈</div>
      <XFFK></XFFK>
    </div>
    <TabBar></TabBar>
  </div>
</template>

<script>
  import{createNamespacedHelpers} from 'vuex'
  const {mapState,mapGetters,mapMutations,mapActions} = createNamespacedHelpers('index');
  import Slider from '../components/CardSlider'
  import XSQG from '../components/XSQG';
  import Search from '../components/Search'
  import  SelectPhone from '../components/SelectPhone';
  import XFFK from '../components/XFFK';
  import { getBaoKuan, weixinShare } from '../api/index';
  import TabBar from '../components/tabbar'
	export default {
		name: "index",
    data(){
		  return({
        hotPicture:'',
        hotName:'',
        link:''
      })
    },
    async beforeMount(){
      let baoKuanInfo = await getBaoKuan();
      this.hotName = baoKuanInfo.body.hotName;
      this.hotPicture = baoKuanInfo.body.hotPicture;
      this.link = baoKuanInfo.body.link
    },
    mounted() {
       this.wxShare()
    },
    methods:{
      randomChar(l) {
          var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
          var tmp = "";
          for (var i = 0; i < l; i++) {
              tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
          }
          return tmp;
      },
      wxShare() {
        const nonceStr = this.randomChar(8);
        const myTimestamp = Date.parse(new Date()).toString().substr(0, 10);
        let params = {
          url: location.href.split('#')[0],
        }
        weixinShare(params).then(res => {
          if(res.signature) {
            wx.config({
                debug: false,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function () {
                wx.onMenuShareAppMessage({
                    title: '哐叽 - 爱回收旗下二手机直卖平台',
                    desc: '搞机，我们是认真的',
                    link: "http://m.kdyoupin.com",
                    imgUrl: 'https://wx.kuangjifix.com/img/round-logo.png'
                });
                wx.onMenuShareTimeline({
                    title: '哐叽 - 爱回收旗下二手机直卖平台',
                    desc: '搞机，我们是认真的',
                    link: "http://m.kdyoupin.com",
                    imgUrl: 'https://wx.kuangjifix.com/img/round-logo.png'
                });
            })
          } else {
            this.$showToast('参数有误')
          }
        })
      },
      baokuan(){
        location.href = this.link;
      },
      zhibao(){
        location.href='http://m.kdyoupin.com/activity/service'
      },
      iPhone(){
        location.href='http://m.kdyoupin.com/search/search?id_category=7&id_manufacturer=1'
      },
      hongbao(){
        location.href='http://m.kdyoupin.com/StandardActivity/index/50'
      },
      caigou(){
        this.$router.push('/purchase')
      }
    },
    computed:{
      ...mapState(['msg'])
    },
    components:{
      Slider,
      XSQG,
      Search,
      SelectPhone,
      XFFK,
      TabBar
    }
	}
</script>

<style scoped lang="less">
  .pageIndex{
    padding-bottom:1.15rem;
  }
.bg{
  width:100%;
  padding:0.1rem 0.3rem 0 0.3rem;
  background:#ededed;
}

  .tese{
    width:100%;
    height:4.2rem;
    background:white;
    border-radius: 0.16rem;
    border:0.01rem solid #e5e5e5;
    .leftSide{
      float:left;
      width:50%;
      .baokuan{
        height:2.8rem;
        border-right: 0.01rem solid #e5e5e5;
        overflow: hidden;
        div:nth-child(1){
          width:100%;
          height:0.6rem;
          line-height:0.8rem;
          color:#353535;
          border:none;
          padding-left:0.3rem;
          overflow: hidden;
          font-size:0.32rem;
          font-weight: bold;
        }
        .jixing{
          width:100%;
          height:0.4rem;
          padding-left:0.3rem;
          font-size:0.22rem;
        }
        .jixingimg{
          width:2rem;
          height:1.8rem;
          float:right;
          margin-right:5px;
          img{
            width:100%;
            height:100%;
          }
        }
      }
      .zhibao{
        height:1.38rem;
        border-right: 0.01rem solid #e5e5e5;
        border-top:0.01rem solid #e5e5e5;
      }

    }
    .img{
      width:1rem;
      height:1.38rem !important;
      padding:0.3rem 0.1rem;
      float:left;
      img{
        width:100%;
        height:100%;
      }
    }
    .img+div{
      float:right;
      width:2.4rem;
      padding-top:0.3rem;
      span:last-child{
        font-size:12px;
      }
    }
    .rightSide{
      float:right;
      width:50%;
      .app{
        height:1.4rem;
        overflow: hidden;
      }
      .caigou{
        height:1.38rem;
        border-top:0.01rem solid #e5e5e5;
        overflow: hidden;
      }
      .hongbao{
        height:1.4rem;
        border-top:0.01rem solid #e5e5e5;
        overflow: hidden;
      }

    }
  }

  .check{
    width:100%;
    background:white;
    padding:0 0.3rem 0 0.3rem;
  }
  .custom{
    width:100%;
    background:#ededed;
    min-height: 5.5rem;
    .titl{
      margin-left:0.3rem;
      height:1rem;
      font-weight: bold;
      line-height:1rem;
      font-size: 0.35rem;
      color:#353535;
    }

  }
</style>
