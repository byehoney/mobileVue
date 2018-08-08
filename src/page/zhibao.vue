<template>
    <!-- 质量保证 -->
    <div class="zhibao-warp">
        <topbar title="质量保证"></topbar>
        <div class="zhibao">
            <img src="../img/zhibao1.png">
            <img class="zhibao2" src="../img/zhibao2.png">
            <div class="video">
                <h1>哐叽竭诚为您服务</h1>
                <video 
                  ref="myVideo"
                  class="video" 
                  x5-playsinline="" playsinline="" webkit-playsinline="" 
                  src="https://imgs.kjershou.com/video/db7b387c2f589dbd079ba036b418ee1e.mp4" 
                  poster="https://imgs.kjershou.com/video/69276d2c9f5410c22d6af784a16bbb27.mp4?x-oss-process=video/snapshot,t_4500,f_jpg,w_345,h_194,m_fast" 
                  >
                </video>
                <div v-show="videoPlayShow" class="video-layer">
                    <img src="@/assets/img/play.png" @click="videoPlay">
                </div>
            </div>
            <img src="../img/zhibao3.png">
            
        </div>
    </div>
</template>

<script>
import topbar from '../components/topbar'
import { returnGoods } from '../api';
import { fail } from 'assert';
export default {
    data(){
        return{
            videoPlayShow:true
        }
    },
    components:{
        topbar
    },
    methods:{
        videoPlay() {
        let video = this.$refs.myVideo;
        video.play();
        video.controls = true;
        this.videoPlayShow = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.zhibao2{
    display: block;
    width: 6.9rem;
    margin: -.6rem auto 0;
}
.video{
    width: 6.9rem;
    margin: .2rem auto;
    border-radius: .16rem;
    position: relative;
    h1{
        text-align: center;
        font-size: .36rem;
        line-height: 1rem;
    }
    video{
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .video-layer{
        width: 1rem;
        height: 1rem;
        position: absolute;
        top: 60%;
        left: 50%;
        margin-left: -.5rem;
        margin-top: -.5rem;
    }
}
</style>
