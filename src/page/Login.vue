<template>
    <div class="login-warp">
        <div class="close-btn iconfont icon-guanbi" @click="close"></div>
        <div class="login">
            <div class="title">手机号快速登录</div>
            <div class="phone-number">
                <input type="tel" ref="phonenumber"  maxlength="11" onkeyup="value=value.replace(/[^\d\.]/g,'')" onblur="value=value.replace(/[^\d\.]/g,'')" placeholder="请输入手机号">
            </div>
            <div class="verification-code">
                <input type="text"  name="code" maxlength="6" ref="code" onkeyup="value=value.replace(/[^\d\.]/g,'')" onblur="value=value.replace(/[^\d\.]/g,'')" placeholder="请输入验证码">
                <span @click="getImgCode" v-if="code" style="color: #f3c91e;">获取验证码</span>
                <span  v-else>{{time}}秒后重试</span>                
            </div>

            <div class="login-btn" @click="login">
            登录
            </div>

            <!-- 用户协议 -->
        <div class="user-greement">
            已阅读并同意哐叽
            <a href="/useragremment" @click="handle">《用户协议》</a>
        </div>
        </div>
        

        <div class="message-box" v-if="smsCode" @touchmove.prevent>
            <div class="box">
                <div class="title">输入图形验证码</div>
                <div class="content">
                    <input type="text" maxlength="4" ref="imgcode"  v-on:input="autoAverification" placeholder="请输入右侧验证码">
                    <div class="img">
                        <img :src="img" @click="getImgCode">
                    </div>
                </div>
                <div class="button" >
                    <span @click="hide">取消</span>
                    <span @click="msgcode">确定</span>
                </div>
            </div>
        </div>

        
    </div>
</template>

<script>
import { smsCode,login, tradeList,getImgvercode } from "../api/index.js"
const API_HOST = process.env.API_ROOT;
export default {
    data(){
        return{
            img:"",
            smsCode:false,
            time:120,
            code:true
        }
    },
    methods:{
        //获取图片验证码
        getImgCode(){
            _paq.push(['trackEvent', '10.LoginPage', '10.10.GetSmsCode', '10.10.GetSmsCode']);                                                    
            let number = this.$refs.phonenumber.value;
            let myreg=/^[1][0-9]{10}$/;
            let time = new Date().getTime()
            if (!myreg.test(number)) {
                this.$showToast("请输入正确手机号码")
            } else {
                this.img=`${API_HOST }/api/v1/login/verifyCode?time=${time}&width=200&height=100&phone=${number}` 
                this.smsCode=true;
            }
        },
        // 自动验证
        autoAverification(){  
            if (this.$refs.imgcode.value.length == 4) {
                this.msgcode()
            }
        },
        // 获取短信验证码
        msgcode(){
            _paq.push(['trackEvent', '10.LoginPage', '10.12.Confirm', '10.12.Confirm']);                                                    
            let data={
                phone:this.$refs.phonenumber.value,
                verifyCode:this.$refs.imgcode.value
            }
            smsCode(data).then(res=>{ 
                    if (res.code == "0") {
                        this.$showToast("短信验证码发功成功");
                        this.code=false;
                        let time = setInterval(()=>{
                        this.time =this.time -1;
                        if (this.time == 0) {
                            this.time = 120;
                            this.code=true;
                            clearInterval(time);
                            return;
                        };
                         },1000);
                        this.smsCode=false;                        
                    } else {
                        this.$showToast(res.message)                         
                    }
            })
        },
        //取消短信验证码
        hide(){
            _paq.push(['trackEvent', '10.LoginPage', '10.11.Cancel', '10.11.Cancel']);                                                    
            this.smsCode=false;                        
        },
        // 登录
        login(){
            _paq.push(['trackEvent', '10.LoginPage', '10.13.Login', '10.13.Login']);                                                    
            let number = this.$refs.phonenumber.value
            let code   = this.$refs.code.value;
            let data ={
                'data':{
                    phone:this.$refs.phonenumber.value,
                    smsCode:this.$refs.code.value,
                    sourceType:1,
                    type:0
                }
            }
            if (!(/^[1][0-9]{10}$/.test(number))) {
                this.$showToast("手机号格式不正确")
            } else {
                if (code == "") {
                this.$showToast("验证码不能为空")
            }else{
              
                login(data).then(res=>{
                    if (res.code == "0") {
                        this.$showToast(res.message)  
                        window.localStorage.setItem('phonenumber',this.$refs.phonenumber.value)               
                        window.localStorage.setItem('token', res.body) 
                        localStorage.setItem('phone', this.$refs.phonenumber.value)
                        if (this.$route.query.redirect) {
                            this.$router.push(decodeURIComponent(this.$route.query.redirect))
                        } else {
                            this.$router.push('/')
                        } 
                    } else {
                        this.$showToast(res.message) 
                    } 
                })
            }
            }
            
        },
        // 关闭登录
        close(){
            this.$router.back()
        },
        handle(){
            _paq.push(['trackEvent', '10.LoginPage', '10.14.Agreement', '10.14.Agreement']);                                                                  
        }
    },
    mounted() {
        let phone = localStorage.getItem('phone');
        this.$refs.phonenumber.value = phone ? phone : '';
        
}
}
</script>

<style lang="less" scoped>
.login-warp{
    height: 100%;
    background: #fafafa url('../img/loginbg.png') no-repeat;
    background-position: top;
    background-size: 100%;
    overflow: hidden;
    padding-bottom: .6rem;
    .close-btn{
        width: .3rem;
        height: .3rem;
        position: absolute;
        top: .3rem;
        right: .3rem;
        font-size: .48rem;        
    }
    .login{
        width: 6.9rem;
        margin: 3.96rem auto 0;
        padding: .6rem .3rem;
        background: #fff;
        border-radius: .16rem;
        box-shadow: 0.01rem 0.03rem 0.06rem -.03rem #ddd;
        .title{
            font-size: .32rem;
            font-weight: bold;
        }
        .phone-number{
            padding: .6rem 0 .15rem 0;
            border-bottom: solid .01rem #f2f2f2;
            font-size: .28rem;
            input{
                width: 100%;
                font-size: .28rem;
                padding-left: .05rem;
                border: none;
                outline: none;
            }
        }
        .verification-code{
            padding: .5rem 0 .15rem 0;
            border-bottom: solid .01rem #f2f2f2;
            font-size: .28rem;
            input{
                font-size: .28rem;
                padding-left: .05rem;
                border: none;
                outline: none;
            }
            span{
                float: right;
                margin-right: .2rem;
            }
        }
        .login-btn{
            width: 4.8rem;
            height: .8rem;
            margin: .6rem auto;
            background: #f3c91e;
            border-radius: .5rem;
            text-align: center;
            line-height: .8rem;
            font-size: .28rem;
            font-weight: bold;
            box-shadow: 0.01rem 0.1rem 0.1rem -.03rem #fff8d0;
        
        }
    }
}
.user-greement{
    text-align: center;
    font-size: .24rem;
    color: #999;
    width: 100%;
    a{
        color: #f3c91e;
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
        height: 3.46rem;
        border-radius: .16rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -1.73rem;
        margin-left: -2.8rem;
        color: #353535; 
        font-size: .28rem;
        text-align: center;
        overflow: hidden;
        .title{
            text-align: center;
            padding-top: .4rem;
            font-weight: bold;
        }     
        .content{
            border: solid .01rem #e5e5e5;
            height: .8rem;
            margin: .55rem .3rem;
            line-height: .8rem;
            font-weight: bold;
            position: relative;
            input{
                font-size: .28rem;
                border: none;
                width: 100%;
                height: .6rem;
                padding-left: .1rem;
            }
            .img{
                position: absolute;
                right: 0rem;
                top: 0rem;
                width: 2.16rem;
                height:100%;
                background: #000;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
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

