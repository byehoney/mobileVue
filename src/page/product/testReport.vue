<template>
   <div class="full-page">
       <div v-title :data-title="$route.name"></div>
       <div class="container">
        <div class="page-header">
            <div class="page-title">
                <h2 class="title">质检报告</h2>
                <!-- <h4 class="subtitle">Test Report</h4> -->
            </div>
            <div class="test-info">
                <div class="auth">
                    <img src="../../img/report-auth.png">
                </div>
                <div class="row">
                    <div class="model">
                        <label>型号：</label>
                        <span>{{testInfo.model}}</span>
                    </div>
                </div>
                <div class="row">
                    <div class="imei">
                        <label>IMEI：</label>
                        <span>{{testInfo.imei}}</span>
                    </div>
                    <div class="inspector">
                        <label>质检员：</label>
                        <span>{{testInfo.name}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="device-info">
            <ul class="flex-row" :class="{'row-2': isRepairShow === false}">
                <!-- <li class="col-3" v-for="(item, index) in devices" :key="index">
                    <label>{{item.label}}：</label>
                    <span>{{item.value}}</span>
                </li> -->
                <li class="col-3" v-if="isRepairShow">
                    <label>生产日期: </label>
                    <span>{{devices.date}}</span>
                </li>
                <li class="col-3">
                    <label>系统版本: </label>
                    <span>{{devices.version}}</span>
                </li>
                <li class="col-3">
                    <label>电池效率: </label>
                    <span>{{devices.battery}}%</span>
                </li>
                <li class="col-3">
                    <label>手机版本: </label>
                    <span>{{devices.edition}}</span>
                </li>
                <li class="col-3">
                    <label>外观成色: </label>
                    <span>{{devices.condition}}</span>
                </li>
                <li class="col-3">
                    <div v-if="isRepairShow">
                        <label>机器来源: </label>
                        <span>{{devices.origin}}</span>
                    </div>
                </li>
                <li class="col-1" v-show="isRepairShow">
                    <label>维修记录: </label>
                    <span v-for="item in devices.repair" :key="item">{{item}}</span>
                </li>
            </ul>
        </div>
        <div class="params-info">
            <h3 class="title">参数信息</h3>
            <div class="params-box">
                <ul class="flex-row">
                    <!-- <li v-for="(item, index) in params" :key="index" class="col-3">
                        <label>{{item.label}}：</label>
                        <span>{{item.value}}</span>
                    </li> -->
                    <li class="col-3">
                        <label>颜色：</label>
                        <span>{{params.colour}}</span>
                    </li>
                    <li class="col-3">
                        <label>存储容量：</label>
                        <span>{{params.capacity}}</span>
                    </li>
                    <li class="col-3">
                        <label>网络制式：</label>
                        <span>{{params.network}}</span>
                    </li>
                    <li class="col-3">
                        <label>尺寸：</label>
                        <span>{{params.phoneSize}}</span>
                    </li>
                    <li class="col-3">
                        <label>显示分辨率：</label>
                        <span>{{params.resolvingPower}}</span>
                    </li>
                    <li class="col-3">
                        <label>SIM卡规格：</label>
                        <span>{{params.simCard}}</span>
                    </li>
                    <li class="col-3" v-if="isRepairShow">
                        <label>CPU：</label>
                        <span>{{params.cpu}}</span>
                    </li>
                    <li class="col-3">
                        <label>前置摄像头：</label>
                        <span>{{params.frontCamera}}</span>
                    </li>
                    <li class="col-3">
                        <label>后置摄像头：</label>
                        <span>{{params.rearCamera}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="func-test">
            <h3 class="title">功能检测</h3>
            <div class="funcs-box">
                <ul class="flex-row">
                    <li v-for="(item, index) in functions" :key="index" class="col-4">
                        <label>{{item}}</label>
                        <i class="icon-check"></i>
                    </li>
                </ul>
            </div>
        </div>
        <div class="page-footer">
           <p class="text-center text-red">此手机通过哐叽长达8小时煲机测试，请放心使用！</p>
        </div>
       </div>
   </div>
</template>
<script>
import { getTestReport } from '@/api'
export default {
    data() {
        return {
            isRepairShow: true,
            serialNumber: '',
            testInfo: {},
            jd: 0,
            devices: {},
            params: {},
            functions: [
                '触摸',
                '屏幕显示',
                '通话',
                '音量键',
                'HOME键',
                '静音键',
                '指纹识别',
                '前置摄像头',
                '后置摄像头',
                '闪光灯',
                'WIFI',
                '蓝牙',
                'GPS',
                'NFC',
                'SIM卡识别',
                '距离感应',
                '指南针',
                '陀螺仪',
                '重力感应',
                '扬声器',
                '话筒',
                '听筒',
                '耳机',
                'USB连接',
                '充电',
            ]
        }
    },
    methods: {
        getReport() {
            let data = {
                serialNumber: this.serialNumber
            }
            getTestReport(data).then(res => {
                if(res.code === '0') {
                    if(!res.body) {
                        this.$showToast('未查到该货号的质检报告', 3000);
                        return;
                    }
                    let body = res.body;
                    this.testInfo = body.head;
                    this.devices = body.devices;
                    this.params = body.params;
                    if(this.jd == 1) {
                        this.devices.battery = Number(this.devices.battery) <= 85 ? 85 : this.devices.battery;
                        // this.devices.condition = this.devices.condition === '9成新' ? '9成新' : '95新';
                        this.devices.condition = '95新';
                    }
                } else {
                    this.$showToast(res.message)
                }
            })
        }
    },
    mounted() {
        document.body.style.backgroundColor = '#fff';
        this.serialNumber = this.$route.query.serialNumber || '18060813520001136';
        this.jd = this.$route.query.jd;
        if(this.jd == 1){
          this.isRepairShow = false;
        }
        this.getReport()
    },
    beforeDestroy() {
        document.body.style.backgroundColor = '';
    }
}
</script>
<style lang="scss" scoped>
    .full-page {
        background: #fff;
    }
    .container {
        position: relative;
        width: 1000px;
        height: 1492px;
        padding: 50px;
        margin: 0 auto;
        font-size: 22px;
        background: url('../../img/report-bg.jpg') no-repeat top;
        background-size: cover;
    }
    .page-title {
        margin: 20px 0 50px;
        text-align: center;
        font-weight: normal;
        .title {
            display: inline-block;
            padding-bottom: 10px;
            margin: 0;
            font-size: 36px;
            border-bottom: 1px solid #353535;
        }
        .subtitle {
            margin-top: 10px;
            font-weight: normal;
        }
    }
    .flex-row {
        display: flex;
        flex-wrap: wrap;
        .col-3 {
            width: 33.33333333%;
        }
        .col-4 {
            width: 25%;
        }
    }
    .title {
        margin: 50px auto;
        text-align: center;
    }
    .test-info {
        position: relative;
        margin-bottom: 10px;
        .auth {
            position: absolute;
            right: 0;
            top: -110px;
        }
        .row {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            label {
                font-weight: bolder;
            }
            .inspector {
                position: relative;
                right: 150px;
                label {
                    font-weight: normal;
                }
            }
        }
    }
    .device-info {
        height: 182px;
        .flex-row {
            border-radius: 16px;
            border: 1px solid #e5e5e5;
            &.row-2 {
                .col-3 {
                    &:nth-child(n+4) {
                        border-bottom: 0;
                    }
                }
            }
        }
        .col-1 {
            width: 100%;
            padding: 15px;
            span {
                margin-right: 10px;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .col-3 {
            padding: 15px;
            border-right: 1px solid #e5e5e5;
            border-bottom: 1px solid #e5e5e5;
            &:nth-child(3n) {
                border-right: 0;
            }
            &:nth-child(n+6) {
                border-right: 0;
            }
            &:nth-child(n+7) {
                border-bottom: 0;
            }
        }
    }
    .params-box {
        border-radius: 8px;
        background: #e5e5e5;
        .col-3 {
            padding: 15px 0 15px 5px;
            border-right: 1px solid #fff;
            border-bottom: 1px solid #fff;
        }
    }
    .funcs-box {
        .col-4 {
            padding: 15px;
            display: flex;
            justify-content: space-between;
            .icon-check {
                position: relative;
                top: 5px;
                right: 10px;
                display: inline-block;
                width: 22px;
                height: 22px;
                background: url('../../assets/img/icon-circle-check.png') no-repeat center;
                background-size: cover;
            }
        }
    }
    .page-footer {
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
    }
</style>


