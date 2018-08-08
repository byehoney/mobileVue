<template>
    <!-- 查看物流 -->
    <div class="logistics-warp">
        <!-- 头部 -->
        <topbar title="查看物流"></topbar>

        <!-- 物流信息 -->
        <div class="logistics-infor">
            <!-- 物流公司 -->
            <div class="logistics-company">
                <div class="logistics-company-logo">
                    <img    :src="imgurl === ''?require('../../img/touxiang.png'):imgurl">
                </div>
                <div class="logistics-company-name">
                    {{companyName}}
                </div>
                <div class="shipment-number">
                    物流单号：{{shipmentNumber}}
                </div>
            </div>
            <!-- 物流动态 -->
            <div class="logistics-dynamics">
                <div class="title">追踪信息</div>
                <div class="list" v-for="(item,index) in list" :key="index" :class="(index == 0?'activ':'')||(index == list.length-1?'last':'')" >
                    <i></i>
                    <div class="content">
                        {{item.content}}                        
                    </div>
                    <div class="time">
                        {{item.time}}
                    </div>
               </div>

               <div v-if="list.length === 0">
                    暂无快递信息
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { getOrderExpress} from "@/api/index.js"
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            imgurl:'',
            companyName:"",
            shipmentNumber:"",
            list:[]
        }
    },
    components:{
        topbar
    },
    methods:{
        // 返回上一步
        back(){
            this.$router.go(-1)
        },
        // 获取物流信息
        OrderExpress(){
            let data = {
                expressNo:this.$route.query.expressNumber,
                expressName:this.$route.query.expressCode
            }

           getOrderExpress(data).then(res=>{
               if (res.body.code === 'OK') {
                    this.imgurl=res.body.logo;
                    this.companyName=res.body.name;
                    this.shipmentNumber=res.body.no;
                    this.list=res.body.list;
               }else{
                    this.companyName='未知';
                    this.shipmentNumber=res.body.no;
                    this.list=res.body.list;
               }
           })
            
        }
    },
    beforeMount(){
        this.OrderExpress()
    }
}
</script>

<style lang="less" scoped>
body,html{
    background:  #ededed;
}



.logistics-company{
    width: 6.9rem;
    height: 1.5rem;
    margin: .3rem auto 0;
    padding: .3rem .3rem;
    background: #fff;
    border-radius: .16rem;
    .logistics-company-logo{
        width: .9rem;
        height: .9rem;
        float: left;
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .logistics-company-name,.shipment-number{
        margin-left: 1.2rem;
        font-size: .28rem
    }
    .logistics-company-name{
        margin: .05rem  0 .1rem 1.2rem;
    }
    .shipment-number{
        font-weight: bold;
    }

}

.logistics-dynamics{
    width: 6.9rem;
    margin: .3rem  auto ;
    padding: 0 .3rem .3rem;
    background: #fff;
    border-radius: .16rem;
    .title{
        padding: .25rem 0;
        margin-bottom: .4rem;
        font-size: .28rem;
        border-bottom: solid .01rem #e5e5e5;
    }
    .list{
        padding: 0 .4rem .6rem .4rem;
        margin-left: .39rem;
        border-left: solid .01rem #e5e5e5;
        position: relative;
        color: #999;
        font-size: .28rem;
        i{
            display: block;
            width: .25rem;
            height: .25rem;
            border-radius: 50%;
            background: #e5e5e5;
            position: absolute;
            left: -.125rem;
        }
        .content{
            margin-bottom: .3rem;
            line-height: .4rem;
        }
    }

    .activ{
        color: #353535;
        i{
            background: #f3c91e;
        }
    }
    .last{
        border: none;
    }
    
}
</style>
