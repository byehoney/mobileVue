<template>
    <div class="full-page">
        <topbar title="电池寿命"></topbar>
        <!-- <i class="icon-back" v-back></i> -->
    </div>
</template>
<script>
export default {
    name: 'mobilebattery'
}
</script>

<style lang="scss" scoped>
    .full-page {
        background: url('../../img/index/banner2-bg.jpg') no-repeat top;
        background-size: 100% 100%;
        .icon-back {
            position: absolute;
            top: .3rem;
            left: .3rem;
            font-size: .52rem;
            opacity: .6;
        }
    }
</style>
