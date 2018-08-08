<template>
  <div id="app">
    <div id="kefu"></div>
    <transition name="fade">
      <!-- <keep-alive :include="/alive/"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>
<script>
import {weixinShare} from '@/api';
import  './rotate.js'
export default {
  name: "App",
  methods: {
    wxShare() {
        let params = {
          url: location.href.split('#')[0],
        }
        weixinShare(params).then(res => {
          if(res && res.appId) {
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
                    title: '哐叽 - 爱回收旗下二手手机直卖平台',
                    desc: '一机一拍，一机一卖，来源明确，维修标注',
                    link: "https://m.kjershou.com?utm_source=kj&utm_medium=wx",
                    imgUrl: 'https://imgs.kjershou.com/static/logo/logo.jpg'
                });
                wx.onMenuShareTimeline({
                    title: '哐叽 - 爱回收旗下二手手机直卖平台',
                    desc: '一机一拍，一机一卖，来源明确，维修标注',
                    link: "https://m.kjershou.com?utm_source=kj&utm_medium=wx",
                    imgUrl: 'https://imgs.kjershou.com/static/logo/logo.jpg'
                });
            })
          } else {
            this.$showToast('分享参数有误！')
          }
        })
    },
  },
  mounted() {
    setTimeout(() => {
      this.wxShare()
    }, 2000)
    setTimeout(function() {
      (function(a, h, c, b, f, g) {
        a["UdeskApiObject"] = f;
        a[f] =
          a[f] ||
          function() {
            (a[f].d = a[f].d || []).push(arguments);
          };
        g = h.createElement(c);
        g.async = 1;
        g.src = b;
        c = h.getElementsByTagName(c)[0];
        c.parentNode.insertBefore(g, c);
      })(
        window,
        document,
        "script",
        "//kdyoupin.udesk.cn/im_client/js/udeskApi.js?_t=1474541522379",
        "ud"
      );
      ud({
        code: "1579hf7j",
        link: "//kdyoupin.udesk.cn/im_client",
        targetSelector: "#kefu",
        mobile: {
          mode: "inner",
          color: "#307AE8",
          pos_flag: "srb",
          onlineText: "联系客服，在线咨询",
          offlineText: "客服下班，请留言",
          pop: {
            direction: "top",
            arrow: {
              top: 0,
              left: "70%"
            },
          },
        },
        panel: {
          css: {
            top: 0,
            // background: '#f3c91e',
          }
        },
        mode: "inner",
        color: "#307AE8",
        pos_flag: "srb",
        onlineText: "联系客服，在线咨询",
        offlineText: "客服下班，请留言",
        pop: {
          direction: "top",
          arrow: {
            top: 0,
            left: "70%"
          }
        }
      });
    }, 1000);
  }
};
</script>