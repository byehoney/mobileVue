<template>
    <section class="page">
        <topbar title="支付成功"></topbar>
        <div class="success-msg">
            <div class="success-icon">
                <img src="@/assets/img/pay-success.png">
            </div>
            <div class="success-text">您已购买成功</div>
            <div class="success-tip">温馨提示：小哐会尽快为您安排发货。</div>
        </div>
        <div class="footer-link">
            <router-link to="/mycenter/myorder?state=fahuo" class="link bg-yellow">查看我的订单</router-link>
            <router-link to="/index" class="link back-home">返回首页</router-link>
        </div>
    </section>
</template>
<script>
export default {
    name: 'paySuccess',
    mounted() {
        let token = this.$route.query.token;
        if(token) {
            localStorage.setItem('token', token);
        }
    }
}
</script>

<style lang="scss" scoped>
    .page {
        padding-top: .2rem;
    }
    .success-msg {
        text-align: center;
        .success-icon {
            width: 1.92rem;
            height: 2.05rem;
            margin: 2rem auto .65rem;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .success-text {
            font-weight: bolder;
            font-size: .4rem;
            margin-bottom: .35rem;
        }
        .success-tip {
            font-size: .28rem;
        }
    }
    .footer-link {
        position: absolute;
        bottom: 1.4rem;
        // left: 50%;
        width: 100%;
        display: flex;
        // transform: translateX(-50%);
        padding: 0 .6rem;
        text-align: center;
        .link {
            display: inline-block;
            width: 75%;
            height: .8rem;
            line-height: .8rem;
            padding: 0 .6rem;
            border: none;
            border-radius: 20px;
            font-size: .28rem;
            font-weight: bolder;
            &.back-home {
                margin-left: .3rem;
                border: 1px solid #f3c91e;
            }
        }
    }
</style>

