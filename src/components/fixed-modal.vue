<template>
    <transition name="fade">
        <div class="modal-layer" v-show="visible"  @click="handleClick">
            <transition name="slide-fade">
                <div v-show="visible" class="modal-box" @click.stop>
                    <slot></slot>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'fixedModel',
    props: ['visible'],
    methods: {
        handleClick() {
            this.$emit('close')
        },
        emptyEvent() {
        }
    },
    watch: {
        visible(val) {
            if(val) {
                document.body.style.position = 'fixed';
            } else {
                document.body.style.position = '';
            }
        }
    },
    beforeDestroy() {
        document.body.style.position = '';
    }
}
</script>
<style lang="scss" scoped>
    .modal-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        width: 100%;
        background: rgba(0,0,0,.5);
        .modal-box {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: inherit;
            width: 100%;
            padding: 0;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s ease-out;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateY(300px);
        opacity: 0;
    }
</style>

