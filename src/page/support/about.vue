<template>
    <div class="page">
        <topbar title="关于我们"></topbar>
        <div class="page-header">
            <div class="header-content">
                <p>哐叽，二手手机直卖平台（原口袋优品）初创于2012年，源自爱回收二手数码产品销售团队。
                    我们拥有自己的供应链渠道和完善的售前售后保障体系，在二手行业中业绩一直排名前列， 成为不少竞争对手争相模仿的案例。
                    目前哐叽已和口袋优品合并，合并后的新哐叽，将以大数据为支撑， 以深度分析用户产品诉求为核心驱动，
                    向用户提供更加自由的产品选择权。</p>
            </div>
        </div>
        <div class="page-body">
            <div class="content">
                <div class="content-item">
                    <h3>行业情况</h3>
                    <p>
                        这是一个更容易掌握用户特征的行业，用户的标签化在这个行业更明显，需求更明确。
                        每一个用户的消费水平和层次更容易被定位，他们都是一群注重实用，在意价格和品质的人，也更希望在享受服务的同时，
                        受到更多的尊重和保护。在这个行业中，用户获取更精准，来意更明确，消费频次和消费额度更可衡量。
                    </p>
                </div>
                <div class="content-item">
                    <h3>哐叽团队</h3>
                    <p>
                        我们致力于为更多人提供更好且有保障的二手数码产品，经过多年的发展，
                        哐叽团队已设立运营、市场、财务、客服、质检、售后、采购、仓库、物流等职能岗位，目前团队规模达到50人。
                    </p>
                </div>
                <div class="content-item">
                    <h3>哐叽历程</h3>
                    <p>2012 历经三个月的研发，6月正式上线，开始探索B2C模式。</p>
                    <p>2013 双11订单暴增30倍，经历首次双11洗礼。</p>
                    <p>2014 开始对接B端业务，为企业提供优质测试机。</p>
                    <p>2015 与顺丰快递顺利达成战略合作，承诺“一日两发”，月订单成交额突破300万。</p>
                    <p>2016 用户量突破30万，11月营收破2000万，全年营收达9500万。</p>
                    <p>2017 脱离”爱回收”，成立独立法人，完成主流电商平台销售布局。</p>
                    <p>2018 全新的哐叽二手手机直卖平台再度扬帆起航！</p>
                </div>
                <div class="content-item">
                    <h3>哐叽优势</h3>
                    <p>1.从行业痛点中找出突破口，让用户清晰了解手机的来源及维修情况。</p>
                    <p>2.提供最丰富的品类和更全面的机型。</p>
                    <p>3.专业质检团队，专业采销团队，占全员40%。</p>
                    <p>4.完善售前售后，7天无理由退换货，1年质保。</p>
                    <p>5.顺丰合作，急速送达。</p>
                </div>
                <div class="content-item">
                    <h3>哐叽目标</h3>
                    <p>
                        哐叽二手手机直卖平台始终追寻品质与服务，在发展中不断优化服务、用户购买流程、产品展示等方面的体验。
                        让用户以较低的价格买到超出预期的产品和体验，做好二手电子产品销售。愿哐叽与用户一起成长。
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
    .page-header {
        position: relative;
        height: 6.26rem;
        width: 100%;
        background: url('../../img/about-bg.png') no-repeat top;
        background-size: cover;
        .header-content {
            position: absolute;
            top: 2.3rem;
            padding: .6rem;
            p {
                line-height: 1.4;
                font-size: .26rem;
            }
        }
    }
    .page-body {
        position: relative;
        top: -0.8rem;
        padding: .3rem;
        .content {
            padding: .4rem;
            background: #fff;
            border-radius: .16rem;
            box-shadow: 0 1px 5px 1px #f2f2f2;
            .content-item {
                margin-bottom: .4rem;
                h3 {
                    display: inline-block;
                    padding:  0 .1rem;
                    margin: .2rem 0;
                    font-size: .4rem;
                    font-weight: bold;
                    position: relative;
                    z-index: 2;
                    &::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        bottom: 3px;
                        z-index: -1;
                        width: 100%;
                        height: .1rem;
                        background: #f3c91e;
                    }
                }
                p {
                    line-height: 1.5;
                    color: #666;
                    letter-spacing: .5px;
                    // text-indent: 2em;
                }
            }
        }
    }
</style>

