<template>
  <div class="search">
    <div class="sr" @click="search">
      <div>
        <i class="iconfont icon-fangdajing"></i>
        <span class="placeholder">请输入要搜索的手机型号</span>
        </div>
    </div>
    <div id="kefu" class="kefu">
      <i class="iconfont icon-erji"></i>
      <span style="font-size:12px; position:absolute;left:0.04rem;bottom:-0.13rem;">客服</span>
    </div>
  </div>
</template>

<script>
	export default {
		name: "search",
    data(){
		  return ({
        searchInfo:''
      })
    },
    mounted(){
      setTimeout(function () {
        (function (a, h, c, b, f, g) {
          a["UdeskApiObject"] = f;
          a[f] = a[f] || function () {
            (a[f].d = a[f].d || []).push(arguments)
          };
          g = h.createElement(c);
          g.async = 1;
          g.src = b;
          c = h.getElementsByTagName(c)[0];
          c.parentNode.insertBefore(g, c)
        })(window, document, "script", "//kdyoupin.udesk.cn/im_client/js/udeskApi.js?_t=1474541522379", "ud");
        ud({
          "code": "1579hf7j",
          "link": "//kdyoupin.udesk.cn/im_client",
          "targetSelector": "#kefu",
          "selector": ".kefu",
          "mobile": {
            "mode": "inner",
            "color": "#307AE8",
            "pos_flag": "srb",
            "onlineText": "联系客服，在线咨询",
            "offlineText": "客服下班，请留言",
            "pop": {
              "direction": "top",
              "arrow": {
                "top": 0,
                "left": "70%"
              }
            }
          },
          "mode": "inner",
          "color": "#307AE8",
          "pos_flag": "srb",
          "onlineText": "联系客服，在线咨询",
          "offlineText": "客服下班，请留言",
          "pop": {
            "direction": "top",
            "arrow": {
              "top": 0,
              "left": "70%"
            }
          }
        });
      }, 500);
    },
    methods:{
      search(){
        window.location.href = 'http://m.kdyoupin.com/product/search'
      }
    },

	}
</script>

<style scoped lang="less">
  .search{
    width:100%;
    height:1rem;
    padding:0 0.3rem;
    padding-top:0.1rem;
    position:fixed;
    top:0;
    left:0;
    z-index:3;
    background:white;
  }
  .search div:nth-child(1){
    float:left;
  }
  .search div:nth-child(2){
    float:right;
    width:0.6rem;
    height:0.8rem;
    text-align:center;
    line-height:0.6rem;
    font-size:0.38rem;
    position:relative;
  }
  .sr{
    width:6.2rem;
    height:0.8rem;
    line-height:0.8rem;
    border:1px solid #e5e5e5;
    border-radius: 0.2rem;
    color:#999;
    padding-left:10px;
    .icon-fangdajing {
      margin-right: 5px;
      vertical-align: middle;
    }
    .placeholder {
      font-size: 14px;
    }
  }
.iconfont{
  font-size:20px;
}
</style>
