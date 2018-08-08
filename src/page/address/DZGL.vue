<template>
    <div class="dzgl">
        <topbar title="管理地址"></topbar>
        <!-- 地址列表 -->
        <div class="address-warp" v-if="kong">
            <div class="address" v-for="(item,index) in address" :key="index">
                <span class="name">
                    {{item.contact}}
                </span>
                <span class="phone">
                    {{item.mobile}}
                </span>
                <div class="addres">
                    {{item.regionName}}&nbsp;{{item.address}}
                </div>
                <div class="">
                     <div class="moren" @click="moren(item.id)">
                         <i :class="item.isDefault == 1?'activ':''"></i>
                         设为默认地址
                     </div>
                    <div class="edit">
                         <i class="iconfont icon-bianji"></i>
                         <span  @click="editAdderss(item.id)">编辑</span >
                     </div>
                     <div class="delete">
                         <i class="iconfont icon-lajitong"></i>
                         <span @click="del(item.id)">删除</span>
                     </div>
                </div>
            </div>
        </div>
        <!-- 地址列表为空 -->
        <div class="address-warp-kong" v-else >
            <img src="../../img/dizhikong.png">
            <p>^.^这里空空如也^.^</p>
        </div>
        
        <div class="newAddres" @click="newAdderss">新增收货地址</div >
    </div>
</template>

<script>
import { getAddersslist,deleteUserAssres,updateUserAddress } from '../../api/index.js';
import topbar from '../../components/topbar'
export default {
    data(){
        return{
            kong:false,
            address:[]     
        }
        
    },
    components:{
        topbar
    },
    beforeMount(){
        //用户流量统计
        _paq.push(['trackEvent', '80.MyPage', '80.17.ManageAddress', '80.17.ManageAddress']);                    
       this.getaddress()
    },
    methods:{
        //跳到编辑地址页面
        editAdderss(id){
            _paq.push(['trackEvent', '81.ManageAddressPage', '81.20.EditAddress', '81.20.EditAddress']);                    
            this.$router.push(`/mycenter/dizhiguanli/xinjiandizhi?id=${id}`)
        },
        newAdderss(id){
            _paq.push(['trackEvent', '81.ManageAddressPage', '81.40.AddAddress', '81.40.AddAddress']);                    
            this.$router.push(`/mycenter/dizhiguanli/xinjiandizhi`)
        },
        // 获取地址列表
        getaddress(){
            getAddersslist().then(res=>{
                if(res.body.length !== 0){
                    this.kong=true;
                    this.address=res.body
                    return;
                }else{
                    this.kong=false;
                    this.address=[]
                }
                
                
            })    
        },
        // 删除地址
       del(id){
            _paq.push(['trackEvent', '81.ManageAddressPage', '81.30.DeleteAddress', '81.30.DeleteAddress']);                    
            let data={
                id:id
            }
            deleteUserAssres(data).then( res=>{
                if(res.code == "0"){
                    this.getaddress()                    
                }
            })

        },
        //默认地址
        moren(id){
            _paq.push(['trackEvent', '81.ManageAddressPage', '81.10.SetDefaultAddress', '81.10.SetDefaultAddress']);                    
            let data = {
                data:{
                    id:parseInt(id),
                    isDefault:1
                }
            }
            updateUserAddress(data).then(res=>{
                this.getaddress()
            })
        }
        
    }
}
</script>

<style lang="less" scoped>

.address-warp{
    padding-bottom: 1.15rem;

    .address{
        width: 6.9rem;
        margin: .3rem auto;
        padding: .3rem;
        padding-bottom: 0;
        background: #fff;
        border-radius: .16rem;
        box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
        

        span{
            font-size: .28rem;
            font-weight: 550;
        }
        .phone{
            float: right
        }

        .addres{
            font-size: .24rem;
            padding: .25rem 0;
            color: #353535;
            border-bottom:  solid .01rem #f2f2f2;
        }
        .address:last-child{
            margin-bottom: 1.1rem;
        }
        &>div{
            padding: .14rem 0;
            font-size: .24rem;
            color: #353535;
            overflow: hidden;
            .moren{
                overflow: hidden;
                float: left;
                &>i{
                    display: inline-block;
                    width: .3rem;
                    height: .3rem;
                    margin-bottom: .04rem;
                    border-radius: 50%;
                    vertical-align: middle;
                    border: solid .01rem #999;
                    color: #f1d32e;
                    margin-right: .05rem;
                    line-height: .3rem;
                    font-size: .32rem;
                }

                .activ{
                    background: url('../../img/morendizhi.png');
                    background-size: 100%;
                    border: none;
                }
            }
            .edit,.delete{
                overflow: hidden;
                float: right;
                margin: 0 .1rem;
                i{
                    display: inline-block;
                    width: .3rem;
                    height: .3rem;         
                    color: #ccc;
                    margin-right: .1rem;
                    font-size: .28rem;
                }
                span{
                    font-size: .24rem;
                    font-weight: normal;
                }
            }
            a{
                color: #353535;
            }
        }
    }
}

.address-warp-kong{
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

.newAddres{
        width: 100%;
        height: .98rem;
        position: fixed;
        color: #353535;
        background:#f1d32e;
        font-size: .28rem;
        font-weight: bold;
        text-align: center;
        line-height: .98rem; 
        bottom: 0;
    }
</style>

