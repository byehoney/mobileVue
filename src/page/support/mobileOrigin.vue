<template>
    <div class="full-page">
      <topbar title="我们的承诺"></topbar>
        <div class="page-header">
            <h2>我们的承诺</h2>
            <h3>一机一拍、一机一卖、来源合法</h3>
            <!-- <i class="icon-back" v-back></i> -->
        </div>
        <div class="page-body">
            <div class="card">
                <h3 class="text-red">我们手机的来源：</h3>
                <h4>个人机</h4>
                <p>
                    每日哐叽驻场质检师从爱回收大库中精心挑选的优质二手手机，全部来自于对旧机爱护有加的个人卖家。
                    <span class="text-red">如不合格的机器，直接返厂不做任何维修及上架售卖，绝不欺骗顾客。</span>
                </p>
            </div>
            <div class="card">
                 <h4>官方机</h4>
                <p>
                    全部来自于手机官方授权代理商，100%正品保证。
                    <span class="text-red"> 如不合格的机器，直接返厂不做任何维修及上架售卖，绝不欺骗顾客。</span>
                </p>

            </div>
             <div class="card">
                <h4>自营机</h4>
                <p>
                    哐叽拥有数百家合作商户，经过繁琐的质检过程优中选优，只为能给您找到更好的那一台。
                </p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
   name: 'mobileorigin'
}
</script>
<style lang="scss" scoped>
.full-page {
  background: url("../../img/index/banner1-bg.jpg") no-repeat top;
  background-size: 100% 100%;
  background-position: fixed;
  overflow-y: auto;
}
.page-header {
  margin-top: 1.4rem;
  text-align: center;
  h2 {
    margin-bottom: 0.2rem;
    font-size: 0.52rem;
    font-weight: bold;
  }
  h3 {
    font-size: 0.48rem;
    font-weight: normal;
  }
  .icon-back {
    position: fixed;
    z-index: 3;
    top: 0.2rem;
    left: 0.2rem;
    font-size: 0.52rem;
    opacity: 0.8;
  }
}
.page-body {
  padding: 0.3rem;
  margin-top: 0.48rem;
  h3 {
    margin-bottom: 0.2rem;
    font-size: 0.24rem;
    font-weight: bold;
  }
  h4 {
    font-size: 0.24rem;
    margin-bottom: 0.14rem;
  }
  p {
    color: #666;
    line-height: 1.6;
  }
}
.card {
  padding: 0.36rem;
  margin-bottom: 0.3rem;
  background: #fff;
  border-radius: 0.16rem;
}
</style>


