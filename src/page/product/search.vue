<template>
    <section class="full-page page">
        <!-- 搜索栏 -->
        <!-- <searchbar :content="search"></searchbar> -->
        <!-- <div class="searchbar">
            <div class="back-button" @click="handleBack">
                <i class="iconfont icon-fanhui1"></i>
            </div>
            <div class="search">
                <div class="search-inner">
                    <i class="iconfont icon-fangdajing"></i>
                    <span v-text="search" class="search-input"></span>
                    <input type="text" v-model="search" class="search-input" placeholder="请输入要搜索的手机型号" @keyup.enter="handleEnter">
                    <i v-show="search" class="iconfont icon-close" @click="handleCancel">&times;</i>
                </div>
            </div>
            <div v-kefu class="kefu">
                <i class="iconfont icon-erji"></i>
                <span>客服</span>
            </div>
        </div> -->
        <!-- 热门搜索 -->
        <div class="search-box hot-box">
            <div class="box-header">
                <div class="box-title">
                    <img src="@/assets/img/icon-hot.png" class="icon">
                    <span>请选择热门搜索机型</span>
                </div>
                <div v-back class="cancel-button">
                    <span>取消</span>
                </div>
            </div>
            <div class="model-title"><h3>手机</h3></div>
            <ul class="box-list">
                <li class="box-item" v-for="item in mobileList" :key="item.id" @click="handleClick(item)">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <div class="model-title" v-if="padList.length !== 0"><h3>平板</h3></div>
            <ul class="box-list">
                <li class="box-item" v-for="item in padList" :key="item.id" @click="handleClick(item)">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <div class="model-title" v-if="peijianList.length !== 0"><h3>配件</h3></div>
            <ul class="box-list">
                <li class="box-item" v-for="item in peijianList" :key="item.id" @click="handleClick(item)">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <!-- 历史搜索 -->
       <div class="search-box history-box" v-if="historyList.length > 0">
           <div class="box-header history-header">
                <div class="box-title">
                    <!-- <img src="@/assets/img/icon-history.png" class="icon"> -->
                    <span>最近搜索</span>
                </div>
                <div class="list-clear">
                    <button class="clear-button text-gray" @click="clearHistory">全部清除</button>
                </div>
           </div>
            <ul class="box-list">
                <li class="box-item" v-for="item in historyList" :key="item.id" @click="handleClick(item)">
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
    </section>
</template>
<script>
import { getHotSearch } from '@/api'
import searchbar from '@/components/searchbar'
export default {
    name: 'Search',
    components: {
        searchbar
    },
    data() {
        return {
            search: '',
            hotList: [],
            mobileList: [],
            peijianList: [],
            padList: [],
            historyList: [],
        }
    },
    methods: {
        getHotList() {
            let data = {
                utmSource: localStorage.getItem('utm_source') || this.$utm_source,
                utmMedium: localStorage.getItem('utm_medium') || this.$utm_medium,
            }
            getHotSearch(data).then(res => {
                if(res.code === '0') {
                    this.mobileList = res.body.filter(item => item.type === 'mobile');
                    this.peijianList = res.body.filter(item => item.type === 'fittings');
                    this.padList = res.body.filter(item => item.type === 'tablet_pc');
                } else {
                    this.$showToast(res.message)
                }
            })
        },
        handleBack() {
            this.$router.back()
        },
        handleCancel() {
            this.search = '';
        },
        handleClick(item) {
            this.search = item.name;
            this.handleEnter(item)
        },
        handleEnter(item) {
            if(!this.historyList.map(his => his.id).includes(item.id)) {
                let historyList = JSON.parse(JSON.stringify(this.historyList));
                historyList.push(item)
                sessionStorage.setItem('historicalSearch', JSON.stringify(historyList))
            }
            if(item.type === 'fittings') {
                this.$router.push(`/peijian/list?productId=${item.id}&search=${item.name}`)
            } else {
                this.$router.push(`/product/list?productId=${item.id}&search=${item.name}`)
            }
        },
        clearHistory() {
            sessionStorage.removeItem('historicalSearch');
            this.historyList = [];
        }
    },
    created() {
        this.search = this.$route.query.searchName;
        this.historyList = JSON.parse(sessionStorage.getItem('historicalSearch')) || [];
        this.getHotList()
    }
}
</script>
<style lang="scss" scoped>
    .page {
        padding-top: 1rem;
        background: #fff;
    }
    .searchbar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 1rem;
        padding: 0.1rem 0.3rem;
        line-height: 1rem;
        background: #fff;
        border-bottom: 1px solid #eee;
        .back-button {
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
            height: 0.8rem;
            padding: 0 0.2rem;
            line-height: 0.8rem;
            border-radius: 8px;
            border: 1px solid #e5e5e5;
            position: relative;
            .search-inner {
                height: .8rem;
            }
            .iconfont {
                margin-right: 0.16rem;
                color: #999;
            }
            .search-input {
                position: relative;
                top: -1px;
                font-size: 0.28rem;
                border: none;
                outline: none;
            }
            .icon-close {
                position: absolute;
                right: 0;
                font-size: .4rem;
            }
            .search-content {
                background: transparent;
            }
        }
        .kefu {
            display: flex;
            flex-direction: column;
            width: 0.6rem;
            padding-top: .1rem;
            margin-left: 0.2rem;
            line-height: 1;
            text-align: center;
            .iconfont {
                font-size: 0.4rem;
            }
        }
    }
    .search-box {
        padding: 0.3rem;
        .box-header {
            margin: .2rem 0 .4rem;
            font-size: 0.32rem;
            .box-title {
                font-weight: bolder;
                .icon {
                    width: .36rem;
                    height: .36rem;
                    margin-right: .1rem;
                    vertical-align: bottom;
                }
            }
        }
        .model-title {
            padding-left: .1rem;
            margin: .2rem 0;
        }
        .box-list {
            display: flex;
            flex-wrap: wrap;
            .box-item {
                margin-bottom: .2rem;
                text-align: center;
                margin-right: .2rem;
                span {
                    display: inline-block;
                    padding: .1rem;
                    border-radius: .08rem;
                    white-space: nowrap;
                    background: #f0f0f0;
                }
            }
        }
    }
    .hot-box {
        margin-top: -1rem;
        .box-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .cancel-button {
                font-size: .28rem;
                color: #999;
            }
        }
    }
    .history-header {
        display: flex;
        justify-content: space-between;
        .box-title {
            span {
                color: #999;
                font-weight: normal;
            }
        }
        .list-clear {
            .clear-button {
                border: none;
                background: none;
            }
        }
    }
</style>

