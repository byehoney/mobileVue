<template>
    <!-- 售后 -->
    <div class="after-sales">
        <topbar title="申请售后"></topbar>
        <!-- 售后选项 -->
        <div class="tab-reason">
            <div :class="this.reason == '换货'?'activ':''"  @click="tabreason('换货')">换货</div>
            <div :class="this.reason == '维修'?'activ':''"  @click="tabreason('维修')">维修</div>
            <div :class="this.reason == '退货'?'activ':''"  @click="tabreason('退货')">退货</div>
        </div>

        <!-- 原因选项 -->
        <div class="mint-cell cell" @click="showpicker">
            <div class="mint-cell-wrapper cell-wrapper">
                <div class="mint-cell-text cell-text">
                <span >*</span>
                <span>{{xiangxiyuanyin}}</span>
                <i  class="mint-cell-allow-right"></i>
            </div>
            </div>
        </div>

        <!-- 原因选择列表 -->
       <transition name="slide-fade">     
            <div class="picker-box" @click="hidepicker" v-if="picker" @touchmove.prevent>
            <div class="confirm" @click="hidepicker">确认</div>
            <mt-picker :slots="slots" valueKey="content" @change="onValuesChange"></mt-picker>            
            </div>
        </transition>

        <!-- 备注说明 -->
        <div class="note">
            <textarea maxlength="200" placeholder="备注说明(最多200字)" ref="note"></textarea>
        </div>

        <!-- 售后提示 -->
        <div class="prompt-list">
            <div class="prompt" v-if="reasonState == 2">
                <p>换货提示</p>
                <p>1.从快递签收当日0时为基准，7日内无理由、15天有理由（质量问题）换货。</p>
                <p>2.机器7天内质量问题换机，来回运费由我公司承担（非质量问题自行承担运费）。运费先寄付，后期以检测结果返还运费（到付拒收）。</p>
                <p>3.在机器换货时，需将赠品一并返回。其他如手机卡，保护套等自行保留，如中途丢失需用户自行承担。</p>
                <p>4.机器寄出前，需要关闭手机密码及手机账号ID，并务必将机器的数据自行导出，否则若有数据遗失、损坏、泄露等哐叽概不承担相应的责任。如果您没有解除账号（如苹果iCloud、魅族Flyme）及密码，将会导致售后进程缓慢，请您务必解除账号及密码。</p>
                <p>5.如遇国家法定节假日，与换货政策存在出入、用户个人原因或者有其他需要协商的问题。则可能会增加协商和处理时间。</p>
                <p>6.因为运输存在一定的风险，建议寄出前对物品拍照留底，切记：在纸条上填写下单订单号，随手机一起邮寄。（如无法查询可联系客服咨询）。</p>
                <p>注：收到机器之后的三个工作日内给予处理。</p>
            </div>
            <div class="prompt" v-if="reasonState == 3">
                <p>维修提示</p>
                <p>1.手机质保1年，电池质保6个月</p>
                <p>2.机器质量问题维修，来回邮费由哐叽承担（检测非质量问题，运费自行承担）。运费先寄付，后期以检测结果返还运费（到付拒收）。</p>
                <p>3.机器寄出前，请务必自行保留相关配件，如：充电器、数据线、保护套、钢化膜等配件，如中途丢失需用户自行承担。</p>
                <p>4.机器寄出前，需要关闭手机密码，并务必将机器的数据自行导出备份，否则若有数据遗失、损坏、泄露等哐叽概不承担相应的责任。如果您没有解除密码，将会导致售后进程缓慢，请您务必解除手机密码。</p>
                <p>5.因为运输存在一定的风险，建议寄出前对物品拍照留底，切记：在纸条上填写下单订单号，随手机一起邮寄（如无法查询可联系客服咨询）。</p>
                <p>6.维修时间一般是在收到机器的7-15个工作日，请耐心等待。</p>
            </div>
            <div class="prompt" v-if="reasonState == 4">
                <p>退货提示</p>
                <p>1.从快递签收当日0时为基准，7日内可无理由退货。</p>
                <p>2.机器7天内质量问题退货，运费由我公司承担（非质量问题自行承担运费）。运费先寄付，后期以检测结果返还运费（到付拒收）。</p>
                <p>3.在机器退货时，有赠品的主商品发生退货时，需将赠品一并提交退货返回，如赠品未退回，则主商品无法全额退款。</p>
                <p>4.机器寄出前，需要关闭手机密码及手机账号ID，并务必将机器的数据自行导出，否则若有数据遗失、损坏、泄露等哐叽概不承担相应的责任。如果您没有解除账号（如苹果iCloud、魅族Flyme）及密码，将会导致售后进程缓慢，请您务必解除账号及密码。</p>
                <p>5.如遇国家法定节假日，与退货政策存在出入、用户个人原因或者有其他需要协商的问题。则可能会增加协商和处理时间。</p>
                <p>6.因为运输存在一定的风险，建议寄出前对物品拍照留底，切记：在纸条上填写下单订单号，随手机一起邮寄。（如无法查询可联系客服咨询）</p>
                <p>注：收到机器之后的三个工作日内给予退款。</p>
            </div>
            
        </div>

        <!-- 提交申请 -->
        <div class="submit" @touchmove.prevent>
            <div class="submit-application" v-if="reasonState == 3" >
               <span v-if="weixiu"  @click="ApplicationSubmission">
                   提交申请
               </span>
               <span v-else style="background:#e5e5e5">
                   提交申请
               </span>
            </div>
            <div class="submit-application" v-if="reasonState == 2" >
                <span v-if="huanhuo" @click="ApplicationSubmission">
                   提交申请
               </span>
               <span v-else style="background:#e5e5e5">
                   提交申请
               </span>
            </div>
            <div class="submit-application" v-if="reasonState == 4">
                <span v-if="tuihuo" @click="ApplicationSubmission">
                   提交申请
               </span>
               <span v-else style="background:#e5e5e5">
                   提交申请
               </span>
            </div>
        </div>
        <!-- 消息框 -->
        <div class="message-box" v-if="messagebox" @touchmove.prevent>
            <div class="kefu">
                <div class="title">提示</div>
                <div class="content">申请提交后，客服会在24小时内联系您。</div>
                <div class="button">
                    <span @click="cancelApplication">取消</span>
                    <span @click="submitApplication">确定</span>
                </div>
            </div>

            <div class="success" v-if="sueccess" >
                <div class="title">提示</div>
                <div class="content">您已提交成功！</div>
                <div class="button">
                    <span @click="cancelApplication">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getReasonList,barter,repair,returnGoods} from '../../api/index.js'
import topbar from '../../components/topbar'

export default {
    data(){
        return{
            reason:"换货",
            slots: [
                {
                flex: 1,
                values: [],
                textAlign: 'center',
            }],
            xiangxiyuanyin:"请选择换货原因",
            picker:false,
            messagebox:false,
            messgesflag:false,
            sueccess:false,
            reasonState:2,
            id:null,
            tuihuo:true,
            huanhuo:true,
            weixiu:true
            
        }
    },
    components:{
        topbar
    },
    methods:{
        // 售后原因滚动选择器选择事件
        onValuesChange(picker, values) {
            picker.setSlotValue(1, values[1]);
            if (values[0] > values[1]) {
                picker.setSlotValue(1, values[0]);
            }   
            this.xiangxiyuanyin = values[0].content
            this.id=values[0].id
            
        },
        // 显示滚动选择器
        showpicker(){
            this.picker=true;
        },
        // 隐藏滚动选择器
        hidepicker(){
            this.picker=false;
        },
        // 头部的返回按钮
        back(){
            this.$router.go(-1)
        },
        // 售后选项的切换
        tabreason(val){
            this.reason = val;
            this.id = null;
            switch (this.reason) {
                case "换货":
                    this.reasonState=2
                    this.getReasons(2)
                    this.xiangxiyuanyin="请选择换货原因"
                    if (!this.huanhuo) {
                        this.$showToast("亲，您现在还不能申请换货，请联系客服！")
                    }
                    break;
                case "维修":
                    this.reasonState=3
                    this.getReasons(4)
                    this.xiangxiyuanyin="请选择维修原因"
                    if (!this.weixiu) {
                        this.$showToast("亲，您现在还不能申请维修，请联系客服！")
                    }                    
                    break;
                case "退货":
                    this.reasonState=4
                    this.getReasons(3)
                    this.xiangxiyuanyin="请选择退货原因"
                     if (!this.tuihuo) {
                        this.$showToast("亲，您现在还不能申请退货，请联系客服！")
                    }
                    break;
                default:
                    break;
            }
        },
        // 申请提交
        ApplicationSubmission(){
            if (this.id == null) {
                this.$showToast("请选择详细原因！！")
            } else{
                this.messagebox=true;
            }
            
        },
        //cancelApplication 取消申请
        cancelApplication(){
            this.messagebox=false
            setTimeout(()=>{
                this.$router.back()
            },1000)  
        },
        // submitApplication  确定申请
        submitApplication(){
            this.shouhou()
        },
        // 获取售后原因
        reasonList(){
            let reason = this.reasonState;
            switch (reason) {
                case 2:
                    this.getReasons(2)
                    break;
                case 3:
                    this.getReasons(3)
                    break;
                case 4:
                    this.getReasons(4)
                    break;
                default:
                    break;
            }
        },
        // 根据state调接口
        getReasons(val){
            getReasonList(val).then(res=>{
                this.slots[0].values = res.body    
            })
        },
        // 提交申请
        shouhou(){    
                let data={
                data:{
                    tradeNo:this.$route.params.item.tradeNo,
                    tradeType:this.$route.params.item.tradeType,
                    imei:this.$route.params.item.imei,
                    idSku:this.$route.params.item.orignIdSku,
                    serialNumber:this.$route.params.item.serialNumber,
                    applyReasonId:this.id,
                    applyDesc:this.$refs.note.value
                }
            }
            let reason = this.reasonState;
            switch (reason) {
                case 2:
                    barter(data).then(res=>{
                        if (res.code == 0) {
                            this.sueccess=true
                        } else {
                            this.$showToast(res.message)
                        }
                    })
                    break;
                case 3:
                    repair(data).then(res=>{
                        if (res.code == 0) {
                            this.sueccess=true
                        } else {
                            this.$showToast(res.message)
                        }
                    })
                    break;
                case 4:
                    returnGoods(data).then(res=>{
                        if (res.code == 0) {
                            this.sueccess=true
                        } else {
                            this.$showToast(res.message)
                        }
                    })
                    break;
                default:
                    break;
            }
            
        },
        state(){
            switch (this.$route.params.type) {
                case 1:
                    this.reason="退货";
                    this.reasonState = 4;
                    this.xiangxiyuanyin="请选择退货原因";
                    this.getReasons(3);
                    if (this.$route.params.item.barterButton === 0) {
                        this.huanhuo=false;
                        this.$showToast("亲，商品正在出库中，如需退换货请您联系在线客服!");
                    }
                    if (this.$route.params.item.returnGoodsButton === 0) {
                        this.tuihuo=false;
                    }
                    if (this.$route.params.item.repairButton === 0) {
                        this.weixiu=false;
                    }
                    break;
                case 2:
                    this.getReasons(2);
                    if (this.$route.params.item.barterButton === 0) {
                        this.huanhuo=false;
                        this.$showToast("亲，您现在还不能申请换货，请联系客服！")
                    }
                    if (this.$route.params.item.returnGoodsButton === 0) {
                        this.tuihuo=false;
                    }
                    if (this.$route.params.item.repairButton === 0) {
                        this.weixiu=false;
                    }
                    break;
                default:
                     this.reasonList();
                    break;
            }

        }
    },
    mounted(){
        this.state()
    }
}
</script>

<style lang="less" scoped >

.tab-reason{
    width: 6.9rem;
    margin: .3rem auto;
    display: flex;
    justify-content: space-between;
    div{
        width: 2.1rem;
        height: .7rem;
        border-radius: .16rem;
        text-align: center;
        line-height: .7rem;
        background: #fff;
        font-size: .28rem;
        box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    }
    .activ{
            background: #f3c91e;
            font-weight: 600;
            box-shadow: 0.01rem 0.1rem 0.1rem -.03rem #fff8d0;            
    }

}

.cell{
    width: 6.9rem;
    height: .7rem;
    line-height: .7rem;
    margin: 0 auto;
    border-radius: .16rem;

    .cell-wrapper{
        background-image: none;
    }
    .cell-text{
        font-size: .28rem;
        vertical-align:baseline;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        span{
            line-height: .7rem;
            &:first-child{
                color: #eb2828;
            }
        }
    }
}

.picker-box{
    z-index: 5;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    transition: all .5s;
    .picker{
        width: 100%;
        position: absolute;
        bottom: 0;
        background: #fff;
        height: 4rem;
        
    }
    .picker-item{
        font-size: .32rem;
        color: #999;
    }
    .picker-selected{
        color: #353535;
    }
    .picker-center-highlight:before, .picker-center-highlight:after{
        background-color:#e5e5e5;
    }
    .confirm{
        width: 100%;
        height: .98rem;
        background: #f3c91e;
        text-align: center;
        line-height: .98rem;
        position: absolute;
        bottom: 4rem;
        font-size: .32rem;
    }
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(ease);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(15px);
  opacity: 0;
}

.note{
    width: 6.9rem;
    min-height: 3.7rem;
    margin: .3rem auto;
    padding: .3rem;
    background: #fff;
    border-radius: .16rem;
    box-shadow: 0.01rem 0.01rem 0.1rem -.03rem #ddd;
    
    textarea{
        width: 6.3rem;
        height: 3.1rem;
        border: none;
        display: block;
        resize:none;
        font-size: .26rem;
        line-height: .34rem;
        color: #999;
        outline: none;
    }
}
.prompt-list{
    width: 6.9rem;
    height: auto;
    margin: 0 auto 1.2rem;
    .prompt{
        p{
            font-size: .28rem;
            line-height: .5rem;
            color: #999;
            &:first-child{
                font-size: .28rem;
                font-weight: bold;
            }
        }
        font-size: .24rem;
        color: #353535;
    }
}

.submit-application{
    width: 100%;
    height: .98rem;
    position: fixed;
    bottom: 0;
    text-align: center;
    line-height: .98rem;
    font-size: .28rem;
    font-weight: bold;
    span{
        display: block;
        width: 100%;
        height: 100%;
        background: #f3c91e;
    }
}

.message-box{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
    &>div{
        width: 5.6rem;
        border-radius: .16rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -1.55rem;
        margin-left: -2.8rem;
        color: #353535; 
        font-size: .28rem;
        text-align: center;
        overflow: hidden;
        .title{
            text-align: center;
            padding-top: .3rem;
            
        }     
        .content{
            height: 1.7rem;
            line-height: 1.7rem;
            font-weight: bold;
        }  
        .button{
            display: flex;
            height: .8rem;
            line-height: .8rem;
            font-weight: bold;  
            span{
                flex: 1;
                text-align: center;
                &:first-child{
                    background: #ededed;
                }
                &:last-child{
                    background: #f3c91e;
                }
            }  
        }
    }
    

}


</style>
