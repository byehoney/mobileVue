<template>
    <div class="pPage">
      <topbar title="企业采购"></topbar>
      <div class="img1">
        <img src="@/img/caigou1.jpg" alt="">
        <!-- <div class="back" @click="goBack">
          <i class="icon-back v-back"></i>
        </div> -->
      </div>
      <div class="img2">
        <img src="@/img/caigou2.jpg" alt="">
      </div>
      <div class="img3">
        <img src="@/img/caigou03.jpg" alt="">
      </div>
      <div class="caigou">
        <form action="">
          <div class="listItem">
            <label for="user" class="item">
              联系人
              <input type="text" id="user" placeholder="请输入联系人" v-model.trim="linkMan">
            </label>
            <label for="companyName" class="item">
              公司名称
              <input type="text" id="companyName" placeholder="请输入公司名称" v-model.trim="corporateName">
            </label>
            <label for="companyMail" class="item">
              公司邮箱
              <input type="text" id="companyMail" placeholder="请输入公司邮箱" v-model.trim="CompanyEmail">
            </label>
            <label for="companyPhone" class="item">
              手机号码
              <input type="text" id="companyPhone" placeholder="请输入手机号码" v-model.trim="phone">
            </label>
            <textarea name="" id="" cols="30" rows="10" placeholder="说明：请填写您采购的机型以及数量，如iPhone6 10台、小米平板 5台，如需开发票，请填写发票抬头" v-model="explain">

            </textarea>
          </div>
          <div class="btn" @click="submit">
            <img src="@/img/button.png" alt="">
          </div>
          <div class="text">
            <span style="color:red">*</span>
            提交信息后，一个工作日内我们就会给您回复<br/>
            我们将竭诚为您服务
          </div>
        </form>
      </div>
      <div class="img4">
        <img src="@/img/caigou04.jpg">
      </div>
    </div>
</template>
<script>
  import{companyPost} from '@/api/index';
  import { Indicator, MessageBox } from 'mint-ui';
	export default {
		name: "purchase",
    data(){
		  return({
        linkMan:'',
        corporateName:'',
        CompanyEmail:'',
        phone:'',
        explain:''
      })
    },
    methods:{
		  async submit(){
        if(this.linkMan === '') {
          this.$showToast('请输入联系人');
          return;
        } else if(this.corporateName === '') {
          this.$showToast('请输入公司名称');
          return;
        }else if(this.CompanyEmail === '') {
          this.$showToast('请输入公司邮箱');
          return;
        }else if(this.phone === '') {
          this.$showToast('请输入手机号码');
          return;
        } 
         let res = await companyPost({
          linkMan: this.linkMan,
          corporateName:this.corporateName,
          CompanyEmail:this.CompanyEmail,
          phone:this.phone,
          explain:this.explain
        })
        if(res.code == 0){
          MessageBox({
            title: '提示',
            message: '信息已提交'
          }).then(res=>{
            if(res == 'confirm'){
              this.linkMan = '';
              this.corporateName = '';
              this.CompanyEmail = '';
              this.phone = '';
              this.explain = '';
            }
          })
        }
      },
      goBack(){
		    this.$router.push('/index');
      }
    }
	}
</script>

<style scoped lang="less">
  .title{
    width:100%;
    height:0.88rem;
    line-height:0.88rem;
    text-align:center;
    position:relative;
  }
  img{
    width:100%;
    height:100%;
  }
  .img1{
    width:100%;
    height:5rem;
    position:relative;
  }
  .img2{
    width:100%;
    height:4.18rem;
  }
  .img3{
    width:100%;
    height:8.12rem;
  }
  .caigou{
    width:100%;
    min-height:9.9rem;
    padding:0 0.3rem;
  }
  .img4{
    width:100%;
    height:5.45rem;
  }
  .listItem{
    width:100%;
    min-height:7rem;
    border:1px solid #e5e5e5;
    padding:0.2rem;
    box-shadow: 2px 2px 2px #e5e5e5;
    background: #fff;
  }
  .item{
    width:100%;
    height:0.85rem;
    float:left;
    line-height:0.85rem;
  }
  .item input{
    width:4.9rem;
    height:0.85rem;
    line-height:0.85rem;
    border:none;
    border-bottom:1px solid #e5e5e5;
    float:right;
    outline: none;
    -webkit-appearance: none;
    margin-right:0.2rem;
  }
  .listItem textarea{
    width:100%;
    height:3rem;
    border:1px solid #e5e5e5;
    -webkit-appearance: none;
    margin-top:0.3rem;
    outline: none;
    padding:0.1rem;
  }
  .btn{
    width:5rem;
    height:1.1rem;
    margin:0 auto;
    margin-top:0.5rem;
    img{
      width:100%;
      height:100%;
    }
  }
  .text{
    width:100%;
    min-height:0.56rem;
    font-size:0.28rem;
    text-align:center;
  }
  .back{
    position: absolute;
    width:30px;
    left:0.3rem;
    top:0.4rem;
    height:30px;
    border-radius: 15px;
    line-height:30px;
    text-align:center;
  }
  .icon-back{
    opacity: 0.8;
  }
</style>
