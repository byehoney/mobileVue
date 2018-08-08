<template>
    <div class="tabbar-wrapper">
        <div class="placeholder"></div>
        <div class="tabbar fixed-bottom">
            <div v-for="(item, index) in tabs" :key="index" class="tab-item">
                <router-link :to="item.path" class="item-link" @click.native="handleTabClick(item)">
                    <div class="tab-item-icon">
                        <img v-show="currPath !== item.path" :src="item.icon">
                        <img v-show="currPath === item.path" :src="item.activeIcon">
                    </div>
                    <div class="tab-item-label">
                        <span class="tab-name">{{item.label}}</span>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'tabbar',
    data() {
        return {
            currPath: '',
            tabs: [
                {
                    label: '首页',
                    path: '/index',
                    icon: '//imgs.kjershou.com/static/tabbar/icon-home.png',
                    activeIcon: '//imgs.kjershou.com/static/tabbar/icon-home-active.png'
                },
                {
                    label: '分类',
                    path: '/product/category',
                    icon: '//imgs.kjershou.com/static/tabbar/icon-category.png',
                    activeIcon: '//imgs.kjershou.com/static/tabbar/icon-category-active.png'
                },
                {
                    label: '我的',
                    path: '/myCenter',
                    icon: '//imgs.kjershou.com/static/tabbar/icon-user.png',
                    activeIcon: '//imgs.kjershou.com/static/tabbar/icon-user-active.png'
                }
            ]
        }
    },
    methods: {
        handleTabClick(item) {
            switch(item.label) {
                case '首页' :
                    _paq.push(['trackEvent', '20.HomePage', '20.13.Footer', '20.13.10.Home']);
                    break;
                case '分类' :
                    _paq.push(['trackEvent', '20.HomePage', '20.13.Footer', '20.13.11.Category']);
                    break;
                case '我的' :
                    _paq.push(['trackEvent', '20.HomePage', '20.13.Footer', '20.13.12.My']);
                    break;
            }
        }
    },
    mounted() {
        this.currPath = this.$route.path;
    }
}
</script>
<style lang="scss" scoped>
    .placeholder {
        height: 1rem;
    }
    .tabbar {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        background: #fff;
        &.fixed-bottom {
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 98;
            border-top: 1px solid #eee;
        }
        .tab-item {
            flex: 1;
            text-align: center;
            color: #a7a7a7;
            .item-link {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            .tab-item-icon {
                margin-bottom: 2px;
                line-height: 1;
                img {
                    width: .44rem;
                }
                .iconfont {
                    font-size: 22px;
                }
            }
            .tab-item-label {
                line-height: 1;
            }
            .router-link-active {
                color: #000;
            }
        }
    }
</style>
