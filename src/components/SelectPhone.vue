<template>
    <div>
      <div class="title">品牌选机</div>
      <div>
        <div class="con">
          <a :href="url1" class="more">查看更多></a>
          <mt-navbar v-model="selected1">
            <mt-tab-item id="苹果">苹果</mt-tab-item>
            <mt-tab-item id="华为">华为</mt-tab-item>
            <mt-tab-item id="小米">小米</mt-tab-item>
          </mt-navbar>
        </div>

        <!-- tab-container -->
        <mt-tab-container v-model="selected1">
          <mt-tab-container-item id="苹果">
            <ul class="list">
              <li class="item" v-for="(item,index) in iPhoneList" :key="index">
                <a :href="`//m.kdyoupin.com/product/ProdDetail/${item.id}`">
                  <div class="img">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="jixing">
                    {{item.name}}
                  </div>
                  <div class="price">
                    <span style="color:red;">¥{{item.price}}</span>
                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="华为">
            <ul class="list">
              <li class="item" v-for="(item,index) in HWList" :key="index">
                <a :href="`//m.kdyoupin.com/product/ProdDetail/${item.id}`">
                  <div class="img">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="jixing">
                    {{item.name}}
                  </div>
                  <div class="price">
                    <span style="color:red;">¥{{item.price}}</span>
                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="小米">
            <ul class="list">
              <li class="item" v-for="(item,index) in MIList" :key="index">
                <a :href="`//m.kdyoupin.com/product/ProdDetail/${item.id}`">
                  <div class="img">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="jixing">
                    {{item.name}}
                  </div>
                  <div class="price">
                    <span style="color:red;">¥{{item.price}}</span>
                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>

      <div>
        <div class="con">
          <a :href="url2" class="more">查看更多></a>
          <mt-navbar v-model="selected2">
            <div>
              <mt-tab-item id="qianyuanjiqi" class="qy">千元机器</mt-tab-item>
              <mt-tab-item id="new">最新发布</mt-tab-item>
            </div>
          </mt-navbar>
        </div>

        <!-- tab-container -->
        <mt-tab-container v-model="selected2">
          <mt-tab-container-item id="qianyuanjiqi">
            <ul class="list">
              <li class="item" v-for="(item,index) in lowPriceList" :key="index">
                <a :href="`//m.kdyoupin.com/product/ProdDetail/${item.id}`">
                  <div class="img">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="jixing">
                    {{item.name}}
                  </div>
                  <div class="price">
                    <span style="color:red;">¥{{item.price}}</span>
                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="new">
            <ul class="list">
              <li class="item" v-for="(item,index) in newList" :key="index">
                <a :href="`//m.kdyoupin.com/product/ProdDetail/${item.id}`">
                  <div class="img">
                    <img :src="item.picture" alt="">
                  </div>
                  <div class="jixing">
                    {{item.name}}
                  </div>
                  <div class="price">
                    <span style="color:red;">¥{{item.price}}</span>
                  </div>
                </a>
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
    </div>
</template>

<script>
  import{getPinPaiList, getLowPricePhone} from '../api/index'
	export default {
		name: "select-phone",
    data(){
		  return({
        selected1:'苹果',
        selected2:'qianyuanjiqi',
        iPhoneList:[],
        MIList:[],
        HWList:[],
        newList:[],
        lowPriceList:[]
      })
    },
    async beforeMount(){
      let iPhoneList = await getPinPaiList({name:'苹果',sum:4});
      this.iPhoneList = iPhoneList.body;
      let MIList = await getPinPaiList({name:'小米',sum:4})
      this.MIList = MIList.body;
      let HWList = await getPinPaiList({name:'华为',sum:4});
      this.HWList = HWList.body;

      //千元苹果 sid：9   小米专区：sid：13

      let lowPriceList = await getLowPricePhone({'sid':9})
      this.lowPriceList = lowPriceList.body;
      let newList = await getLowPricePhone({sid:13});
      this.newList =newList.body;
    },
    computed:{
		  url1(){
        // return '/product/category';
		    return 'http://m.kdyoupin.com/search/Search?k='+ this.selected1
      },
      url2(){
		    return 'http://m.kdyoupin.com/search/Search'
      }
    }
	}
</script>

<style scoped lang="less">
  .title{
    height:0.8rem;
    font-size:0.32rem;
    line-height:1rem;
    font-weight: bolder;
  }
  .con{
    position:relative;
    border-bottom: 1px solid #e5e5e5;
  }
  .more{
    position:absolute;
    right:0;
    top:0;
    bottom:0;
    line-height:0.8rem;
    font-size:0.23rem;
    color:#f3c91e;
  }
  .mint-navbar{
    width:3rem;
    font-size:0.28rem;
    color:#999;
    font-weight: bold;
    div{
      width:3rem;
      float:left;
    }

  }
  .mint-navbar .mint-tab-item{
    padding:10px 0;
    float:left;
    width:50%;
  }

  .is-selected{
    color:#353535 !important;
    border-bottom:3px solid #f3c91e !important;
    margin-bottom:0;
  }
 .mint-tab-container{
    margin-top:0.2rem;
  }
  .list li:nth-child(1),.list li:nth-child(3){
    margin-left:0;
  }

  .item{
    width:3.3rem;
    min-height:2.85rem;
    background:#ededed;
    border-radius:0.16rem;
    float:left;
    margin-left:0.2rem;
    margin-bottom:0.2rem;
    background:#fff;
    border:1px solid #e5e5e5;
    overflow: hidden;
    padding:0.1rem;
    a{
      display: block;
      width:100%;
      height:100%;
      color:black;
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
      height:0.5rem;
      line-height:0.3rem;
      text-align:center;
      font-size:0.24rem;
      margin-top:0.1rem;
    }
    .price{
      width:100%;
      height:0.6rem;
      line-height:0.6rem;
      text-align:center;
    }
  }
  .mint-navbar .mint-tab-item.is-selected{
    margin-bottom:0px;
  }
  .mint-navbar .mint-tab-item .mint-tab-item-label{
    font-size:14px;
  }
</style>
