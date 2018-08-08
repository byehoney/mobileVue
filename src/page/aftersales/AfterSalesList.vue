<template>
    <!-- 售后记录 -->
    <div>
        <!-- 头部导航 -->
       <topbar title="售后记录"></topbar>
        
        <!-- 售后列表 -->
        <div class="list-warp" v-if="list.length !== 0">
            <div class="list" v-for="(item,index) in list" :key="index">
                <div class="state" v-if="item.status == 1">等待审核</div>
                <div class="state" v-if="item.status == 2">等待寄回</div>
                <div class="state" v-if="item.status == 3">等待质检</div>
                <div class="state" v-if="item.status == 4">等待裁定</div>
                <div class="state" v-if="item.status == 10">已完成</div>
                <div class="state" v-if="item.status == 50">已取消</div>
                <div class="state" v-if="item.status == 60">已关闭</div>
                
                
                <div class="phone" >
                    <div class="img">
                        <img :src="item.coverImg+'@125w_125h_1e_1c.jpg'">
                    </div>
                    <div class="name">
                        {{item.name}}
                    </div>
                    <!-- <div class="label">
                        <span>{{item.sourceTypeName}}</span>
                        <span v-for="(i,index) in item.repairTypeNameList" :key="index">{{i}}</span>
                    </div>
                    <div class="imie">
                        IMEI:{{item.imei}}
                    </div> -->
                </div>
                <div class="bottom">
                    <span @click="detail(item.id,item.type)">查看状态</span>
                </div>
            </div>
        </div>   
        <!-- 售后列表为空 -->
        <div class="list-warp-kong" v-else>
            <img src="../../img/shouhoukong.png" >
            <p>亲，没有售后记录！</p>
        </div>
    </div>
</template>

<script>
import {barterList,repairList,returnGoodsList} from "../../api/index.js"
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            list:[]
        }
    },
    components:{
        topbar
    },
    methods:{
        //售后详情
        detail(id,type){
            _paq.push(['trackEvent', '85.AfterSalePage', '85.10.AfterSaleDetail', '85.10.AfterSaleDetail']);                                                    
            this.$router.push(`/mycenter/aftersaleslist/aftersalesdetail?id=${id}&type=${type}`)
        }
    },
    mounted(){
        //统计用户流量
        _paq.push(['trackEvent', '80.MyPage', '80.19.AfterSale', '80.19.AfterSale']);                    

        //售后换货列表
        barterList().then(res=>{
            if (res.body == null) {
                return
            }
            this.list=this.list.concat(res.body) 
        });
        //售后维修列表
        repairList().then(res=>{
            if (res.body == null) {
                return
            }
            this.list=this.list.concat(res.body) 
        });
        // 售后退货列表
        returnGoodsList().then(res=>{
            if (res.body == null) {
                return
            }
            this.list=this.list.concat(res.body) 
        });
        
    }
}
</script>

<style lang="less" scoped>
.list-warp{
    margin-top: .3rem;
}
.list-warp-kong{
    width: 6.9rem;
    margin: 1rem auto;
    padding: 2.5rem  1.5rem 0;
    img{
        width: 100%;
        height: 100%;
    }
    p{
        font-size: .28rem;
        color: #ccc;
        line-height: 1rem;
        text-align: center;
    }
}
.list{
    width: 6.9rem;
    margin: .3rem auto;
    padding: 0 .3rem;
    background: #fff;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;         
    
}
.state{
    padding: .3rem  .3rem .3rem 0;
    margin-bottom: .2rem;
    border-bottom: solid .01rem #e5e5e5;
    font-size: .28rem;
    font-weight:bold;
}

.phone{
    width: 100%;
    background: #ededed;
    padding: .1rem;
    overflow: hidden;
    .img{
        display: block;
        width:1.25rem;
        height: 1.25rem;
        margin-right: .2rem;
        float: left;
        background: #fff;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .name,.label,.imie{
        font-size: .24rem;
        margin-left: 1.45rem;
    }
    .name{
        font-weight: bold;
        margin-bottom: .15rem;
    }
    .label{
        margin-bottom: .15rem;
        span{
            display: block;
            border-radius: 4px;
            background: #fff8d0;
            float: left;
            font-size: .22rem;
            margin: 0 .1rem .14rem 0;
            padding: .03rem .2rem;
        }
    }
    .imie{
        float: left;
        clear: both;
        margin-bottom: .15rem;            
    }
}

.bottom{
    text-align: right;
    padding: .3rem 0;
    overflow: hidden;
    &>span{
        border-radius: .5rem;
        border: solid .01rem #999;
        line-height: 0.4rem;
        display: block;
        width: 1.2rem;
        text-align: center;
        float: right;
        
    }
}
</style>

