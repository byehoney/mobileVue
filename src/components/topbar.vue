<template>
    <div v-if="isShow">
        <div class="placeholder"></div>
        <div class="topbar">
            <div class="button" @click="handleBack">
                <i class="iconfont icon-fanhui1"></i>
            </div>
            <div class="page-title">{{title}}</div>
            <div class="button"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'topbar',
    props: ['title', 'path'],
    data() {
        return {
            isShow: false,
        }
    },
    methods: {
        handleBack() {
            if(this.path) {
                this.$router.push(this.path)
            } else {
                this.$router.back()
            }
        },
        // 判断是否微信环境
        isWeiXin() {
            const ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        },
    },
    mounted() {
        document.title = this.title;
        this.isShow = this.isWeiXin() ? false : true;
    }
}
</script>
<style lang="scss" scoped>
    .placeholder {
        height: .8rem;
    }
    .topbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 98;
        width: 100%;
        height: .8rem;
        line-height: .8rem;
        display: flex;
        justify-content: space-between;
        background: #fff;
        .page-title {
            flex: 1;
            text-align: center;
            font-size: .36rem;
        }
        .button {
            width: .3rem;
            .iconfont {
                font-size: .6rem;
            }
        }
    }
</style>

