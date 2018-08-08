<template>  
    <!-- 售后详情 -->
    <div class="detail">
        <topbar title="售后详情"></topbar>

        <!-- 受理状态 -->
        <div class="state">
            <div class="line">
                <i :class="(text3 !=='')||(text2 !=='')?'line-activ':''"></i> 
                <i :class="text3 !==''?'line-activ':''"></i>             
            </div>
            
            <div class="text">
                <div :class="text1 !=='' ?'text-activ':''">
                    <i></i>
                    {{text1}}
                </div>
                <div :class="text2 !=='' ?'text-activ':''">
                    <i></i>
                    {{text2}}
                </div>
                <div :class="text3 !=='' ?'text-activ':''">
                    <i></i>
                    {{text3}}
                </div>
            </div>
        </div>
        <!-- 服务类型 -->
        <div class="service-type">
            <div class="title">
                服务类型
                <span>{{type}}</span>
            </div>
            <!-- 手机相关 -->
            <div class="phone" >
                <div class="img">
                    <img :src="info.coverImg+'@125w_125h_1e_1c.jpg'">
                </div>
                <div class="name">
                    {{info.name}}
                </div>
                <!-- <div class="label">
                    <span>{{info.sourceTypeName}}</span>
                    <span v-for="(item,index) in info.repairTypeNameList" :key="index">{{item}}</span>
                    
                </div>
                <div class="imie">
                    IMEI:{{info.imei}}
                </div> -->
            </div>
            <!-- 提示 -->
            <div class="tips">
                <p>温馨提示:</p>
                <p>您的售后申请，我们已经收到，会尽快审核。</p>
                <p>审核通过之后请把商品寄到:</p>
                <p style="font-weight: bold;font-size:.28rem">广东省深圳市福田区园岭街道八卦三路深爱大厦二楼2026口袋售后组</p>
                <p style="font-weight: bold;font-size:.28rem">售后电话:400-6070-259</p>
                <!-- <p style="color:#eb2828;">注:请不要在审核通过之前把商品寄出，谢谢您的配合！</p> -->
            </div>
        </div>

        <!-- 取消售后 -->
        <div class="cancell"  @click="cancell" v-if="text3 ===''">
            取消售后
        </div>
    </div>
</template>

<script>
import {barterDetail,repairDetail,returnGoodsDetail,cancelReturnGoods,cancelBarter,cancelRepair} from "../../api/index.js"
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            info:{},
            text1:"",
            text2:"",
            text3:"",
            type:""
        }
    },
    components:{
        topbar
    },
    methods:{
        //获取详情
        getDetail(){
            let id = this.$route.query.id;
            let type = this.$route.query.type;  
            switch (type) {
                case "1":
                    barterDetail(id).then(res=>{
                        if (res.code === '0') {
                            this.info = res.body;
                            this.type="换货";
                            this.text1 = this.info.progressBarArray[0];
                            this.text2 = this.info.progressBarArray[1];
                            this.text3 = this.info.progressBarArray[2];
                        } else {
                            this.$showToast(res.message)
                            setTimeout(()=>{
                                this.$router.back()
                            },1000)
                        }
                        
                    })
                    break;
                case "2":
                    repairDetail(id).then(res=>{
                        if (res.code === '0') {
                            this.info = res.body;
                            this.type="维修";
                            this.text1 = this.info.progressBarArray[0];
                            this.text2 = this.info.progressBarArray[1];
                            this.text3 = this.info.progressBarArray[2];
                        } else {
                            this.$showToast(res.message)
                            setTimeout(()=>{
                                this.$router.back()
                            },1000)
                        }
                    })
                    break;
                case "3":
                    returnGoodsDetail(id).then(res=>{
                        if (res.code === '0') {
                            this.info = res.body;
                            this.type="退货";
                            this.text1 = this.info.progressBarArray[0];
                            this.text2 = this.info.progressBarArray[1];
                            this.text3 = this.info.progressBarArray[2];
                        } else {
                            this.$showToast(res.message)
                            setTimeout(()=>{
                                this.$router.back()
                            },1000)
                        }
                    })
                    break;
                default:
                    break;
            }
        },
        // 取消售后
        cancell(){
            let data = {
                data:{
                    id:this.$route.query.id
                }
            } 
            let type = this.$route.query.type;  
            switch (type) {
                case "1":
                    cancelBarter(data).then(res=>{
                       
                        
                        if(res.code  === "0" ){
                            this.$router.push('/mycenter/aftersaleslist')
                            this.$showToast("取消售后成功")
                            setTimeout(()=>{
                                this.$router.push('/mycenter/aftersaleslist')                                
                            },1000)
                            
                        }else{
                            this.$showToast(res.message)
                        }
                        
                    })
                    break;
                case "2":
                    cancelRepair(data).then(res=>{
                        if(res.code  === "0" ){
                            this.$showToast("取消售后成功")
                            setTimeout(()=>{
                                this.$router.push('/mycenter/aftersaleslist')                                
                            },1000)
                        }else{
                            this.$showToast(res.message)
                        }
                        
                    })
                    break;
                case "3":
                    cancelReturnGoods(data).then(res=>{
                        if(res.code  === "0" ){
                            this.$showToast("取消售后成功")
                            setTimeout(()=>{
                                this.$router.push('/mycenter/aftersaleslist')                                
                            },1000)
                        }else{
                            this.$showToast(res.message)
                        }
                        
                    })
                    break;
                default:
                    break;
            }
        }
    },
    created(){
        this.getDetail()  
    }
}
</script>

<style lang="less" scoped>
.state{
    width: 6.9rem;
    margin: .3rem auto .3rem;
    padding: .3rem .8rem;
    background: #fff;
    position: relative;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;         
    
    .line{
        width: 4.6rem;
        height: .03rem;
        margin: 0 auto;
        background: #ededed;
        position: absolute;
        top: .74rem;
        left: 50%;
        margin-left: -2.3rem;
        display: flex;
        i{
            flex: 1;
            height: 100%;
            
        }
        .line-activ{
            background: #f1d33f;
        }
    }
    .text{
        display: flex;
        justify-content:space-between;
        font-size: .24rem;
        &>div{
            i{
                display: block;
                width: .3rem;
                height: .3rem;
                margin: .3rem auto .2rem;
                background: #ededed;
                border-radius: 50%;
            }
        }
        .text-activ{
            i{
                background: #f1d33f;
                z-index: 1000;
            }
            font-weight: bold;
                z-index: 1;
        }

    }
}

.service-type{
    width: 6.9rem;
    margin: .3rem auto;
    padding:  0 .3rem .3rem;
    background: #fff;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;         
    
    .title{
        padding: .25rem 0;
        font-size: .28rem;
        font-weight: bold;
        border-bottom: solid .01rem #f2f2f2;
        margin-bottom: .2rem;
        span{
            float: right;
        }
    }
    .phone{
        width: 100%;
        border-bottom: solid .01rem #f2f2f2;
        padding: .1rem;
        overflow: hidden;
        .img{
            display: block;
            width:1.8rem;
            height: 1.8rem;
            margin-right: .2rem;
            position: absolute;
            background: #fff;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .name,.label,.imie{
            font-size: .24rem;
            margin-left: 2rem;
        }
        .name{
            font-weight: bold;
            margin-bottom: 1.15rem;
        }
        .label{
            margin-bottom: .15rem;
            span{
                display: block;
                border-radius: 4px;
                background: #fff8d0;
                border: 1px solid #f3c91e;
                float: left;
                font-size: .22rem;
                margin: 0 .1rem .14rem 0;
                padding: .03rem .2rem;
            }
        }
        .imie{
            clear: both;
            margin-bottom: .15rem;            
        }
    }

    .tips{
        margin-top: .3rem;
        font-size: .24rem;
        p{
            margin-bottom: .15rem;
        }
    }
}

.cancell{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: .98rem;
    background: #f1d33f;
    text-align: center;
    line-height: .98rem;
    font-size: .28rem;
}

</style>

