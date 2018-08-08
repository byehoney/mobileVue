<template>
    <div class="xzdz">
        <topbar :title=this.title></topbar>
        <div class="addres-infor">
            <!-- 收货人 -->
            <div >
                <label>收货人</label>
                <input type="text" placeholder="请输入收件人"  v-model="user.contact"> 
            </div>
            <!-- 手机号 -->
             <div >
                <label>手机号</label>
                <input type="tel" maxlength="11" onkeyup="value=value.replace(/[^\d\.]/g,'')" onblur="value=value.replace(/[^\d\.]/g,'')" placeholder="请输入手机号" v-model="user.mobile"> 
            </div>
            <!-- 区域选择器 -->
             <div >
                <label>所在地区</label>
                <div @click="showpicker">
                    <span v-if="xuanze" :style="$route.query.id?'color:#353535':'color:#999999'">{{quaddres}}</span>
                    <span v-else>{{quaddres}}</span>
                    <i></i>
                </div>
            </div>
            <!-- 详细地址 -->
             <div class="">
                <label>详细地址</label>
                <input type="text"  placeholder="请填写详细收货地址" v-model="xxaddres"> 
            </div>
        </div>
        <!-- 修改的保存 -->
        <div class="save-addres" v-show="!save"  @click="updateAdders(user.id)">
            保存
        </div>
        <!-- 新增的保存 -->
        <div class="save-addres" v-show="save"  @click="saveAddres">
            保存
        </div>

        <!-- 地址列表 -->
        <div class="picker-warp" v-show="picker" @click="hidepicker">
            <div class="hidepicker"  @click="confirm">确定</div>
            <picker class="picker"  :data='data' v-model='value'  :columns=3  @on-change="addeschange" ref="picker"></picker>
        </div>
    
    </div>
</template>

<script>
import { getUserAddress,saveUserAddress,updateUserAddress,getRegionList, login } from '../../api/index.js';
import topbar from '../../components/topbar'
import { Picker } from 'vux'
export default {
    data(){
        return{
            title:"新增收货地址",
            quaddres:"请选择",
            xxaddres:"",
            user:{},
            idRegion:0,
            save:true,
            picker:false,
            xuanze:true,
            value:["上海", "海淀区", "西三旗"],
            data:['-'],
        }
    },
    components:{
        topbar,Picker
    },
    methods:{
        // 显示地址选择器
        showpicker(){
            this.xuanze=false;       
            this.picker=true;
        },
        // 隐藏地址选择器
        hidepicker(){
            this.picker=false;
        },
        confirm(){
            this.picker=false;
            this.idRegion = this.$refs.picker.value[2]
            this.quaddres=this.$refs.picker.getNameValues()
        }
        ,
         // 新增地址
        saveAddres(){
            if ((this.user.contact == undefined||(this.user.contact == null))) {
                this.$showToast("请输入收货人姓名")
            } else {
                if (!(/^[1][0-9]{10}$/.test(this.user.mobile))) {

                    this.$showToast("请输入正确手机号")
                } else {
                    if (this.idRegion == 0) {
                            this.$showToast("请选择区域")
                    } else {
                        if (this.xxaddres == "") {
                            this.$showToast("请填写详细地址")
                        } else {
                            let data = 
                            {
                                data:{
                                    address:this.xxaddres,
                                    contact:this.user.contact,
                                    mobile:this.user.mobile,
                                    idRegion: this.idRegion
                                } 
                            }
                            saveUserAddress(data).then(res=>{
                                if(res.code == 0){
                                    this.$router.push("/mycenter/dizhiguanli")
                                    this.$showToast("新增成功")
                                }
                            })
                        }
                    }
                }
            }
            
        },
        //更新地址
        updateAdders(id){
            let data = {
                data:{
                    id:parseInt(id),
                    address:this.xxaddres,
                    contact:this.user.contact,
                    mobile:this.user.mobile,
                    idRegion:this.idRegion
                } 
            }
            updateUserAddress(data).then(res=>{
                if(res.code == 0){
                    this.$router.push("/mycenter/dizhiguanli")
                    this.$showToast("保存成功")
                }      
            })
        },
        //获取地址列表并赋值给选择器
        RegionList(){
            getRegionList().then(res=>{
                this.data = res.body;
            })
        },
        // 地址选择器选择事件
        addeschange(val){
            // this.idRegion=val[2]
        }
    },
    mounted(){
      
    },
    created(){
        //根据地址栏的id来判断是新建地址还是修改地址
        if (this.$route.query.id) {
            let data = {
                "data":{
                    id:this.$route.query.id
                }
            }
            getUserAddress(this.$route.query.id).then(res=>{             
                let addresstr=res.body.address;
                this.quaddres=res.body.regionName;
                this.xxaddres=res.body.address;
                this.idRegion=res.body.idRegion;
                this.user = res.body;
                this.xuazeaddres=res.body.address;
                this.title="修改地址";
                this.save=false;
            })  
        }
        this.RegionList()
    }

}
</script>

<style lang="less" scoped>

.addres-infor{
    width:6.9rem;
    border-radius: .16rem;
    background: #fff;
    margin: .3rem auto .3rem;
    padding: .4rem .3rem;
    box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
    
    &>div{
        font-size: .28rem;
        overflow: hidden;
        margin-bottom: .2rem;
        
        &>label{
            padding: .15rem 0;
            display: block;
            width: 1.59rem;
            float: left;
            font-weight: 550;
        }
        &>input{
            color: #353535;
            box-sizing: border-box;
            font-size: .28rem;
            padding: .15rem .1rem ;
            display: block;
            float: right;
            outline: none;
            border: none;
            border-bottom:solid .01rem  #f2f2f2;
            width:4.71rem; 
        }
        &>div{
            color: #353535;
            box-sizing: border-box;
            font-size: .28rem;
            padding: .15rem .1rem ;
            display: block;
            float: right;
            outline: none;
            border: none;
            border-bottom:solid .01rem  #f2f2f2;
            width:4.71rem; 
            span{
                line-height: 0.5rem;
            }
        }
        &:last-child>input{
            width: 100%;
        }
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

.save-addres{
    display: block;
    width: 4.8rem;
    height: .8rem;
    margin: 0 auto;
    background: #f3c91e;
    text-align: center;
    line-height: .8rem;
    font-weight: 700;
    border-radius: .5rem;
    box-shadow: 0.01rem 0.1rem 0.1rem -.03rem #fff8d0;
    
}
.picker-warp{
    position: fixed;
    left: 0;
    top: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    transition: all 1s;
    .hidepicker{
        width: 100%;
        position: absolute;
        bottom: 238px;
        padding: .2rem;
        font-size: .32rem;
        text-align: center;
        background: #f3c91e;
        box-sizing: border-box;

    }

    .picker{
    transition: all 1s;
    width: 100%;
    position: absolute;
    bottom: 0;
    background: #fff;
    .picker-slot{
        font-size: .32rem;
    }
}
}

</style>
