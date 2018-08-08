<template>
    <div class="searchbar">
        <!-- <div class="back-icon" @click="handleBack">
            <i class="iconfont icon-fanhui1"></i>
        </div> -->
        <div class="search" @click="handleClick">
            <i class="iconfont icon-fangdajing"></i>
            <span v-if="content" class="search-content" @click.stop="deleteSearch">{{content}}&nbsp; &times;</span>
            <span v-else class="placeholder">{{placeholder}}</span>
        </div>
        <div v-if="isHome" class="home">
            <router-link to="/index">
                <img src="//imgs.kjershou.com/static/tabbar/icon-home.png" alt="">
            </router-link>
        </div>
        <div v-else v-kefu class="kefu">
            <i class="iconfont icon-erji"></i>
            <span>客服</span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'searchbar',
    props: ['content', 'isHome'],
    data() {
        return {
            placeholder: '请输入搜索的手机型号或配件',
        }
    },
    methods: {
        handleBack() {
            this.$router.back()
        },
        handleClick() {
            if(this.content) {
                this.$router.push(`/product/search?searchName=${this.content}`)
            } else {
                this.$router.push('/product/search')
            }
        },
        deleteSearch() {
            this.$router.push('/product/search')
        }
    },
    mounted() {
    }
}
</script>
<style lang="scss" scoped>
    .searchbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 1rem;
        padding: 0.15rem 0.2rem;
        line-height: 1rem;
        background: #fff;
        border-bottom: 1px solid #f5f5f5;
        .back-icon {
            width: .4rem;
            line-height: .8rem;
            margin-right: .2rem;
            .iconfont {
                position: relative;
                right: .1rem;
                font-size: .6rem;
            }
        }
        .search {
            flex: 1;
            height: 0.7rem;
            padding: 0 0.2rem;
            line-height: .7rem;
            border-radius: 8px;
            background: #ededed;
            .iconfont {
                margin-right: 0.16rem;
                color: #999;
            }
            .placeholder {
                font-size: 0.28rem;
                color: #999;
            }
            .search-content {
                padding: 4px;
                color: #fff;
                border-radius: 4px;
                background: #808080;
            }
        }
        .home {
            margin-left: .2rem;
            img {
                width: .5rem;
            }
        }
        .kefu {
            display: flex;
            flex-direction: column;
            width: 0.6rem;
            padding-top: .04rem;
            margin-left: .2rem;
            line-height: 1;
            text-align: center;
            .iconfont {
                font-size: 0.4rem;
            }
        }
    }
</style>
