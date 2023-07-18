<template>
    <a-layout>
        <a-layout-header style="background-color: white">
            <div class="loginHeader">
                <span>登录/注册</span>
            </div>
        </a-layout-header>
        <a-layout-content>
            <a-form style="margin: 5px;">
                <a-form-item>
                    <a-input v-model:value="phoneNumber" placeholder="请输入手机号" />
                </a-form-item>
                <a-form-item>
                    <a-input v-model:value="passcode" placeholder="请输入验证码" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" style="margin-left: 20%" @click="getCode()">获取验证码</a-button>
                    <a-button type="primary" style="margin-left: 15%" @click="loginIn()">登录</a-button>
                </a-form-item>
            </a-form>
        </a-layout-content>
    </a-layout>
</template>

<script>
import { message } from 'ant-design-vue';
import { useStore } from '../stores/counter';

export default {
    data() {
        return {
            phoneNumber: '',
            passcode: ''
        }
    },

    methods: {
        getCode() {  //向后端请求验证码
            message.success('获取验证码成功')
            const that = this //保留当前this值不修改
            that.axios({
                methods: 'GET',  //通过GET向后端请求数据
                url: 'http://localhost:8080/getcode'//设置获取数据的端口
            }).then(function (resources) {
                that.passcode = resources.data  //将返回的数据传给passcode,v-model双向绑定直接填入输入框
            })
        },
        loginIn() {
            if (this.phoneNumber == "" || this.passcode == "") {
                message.error('手机号和验证码不能为空！'); //弹出错误信息
            }
            else {  //输入不为空
                const that = this
                useStore().phonenumber = this.phoneNumber
                that.axios({
                    methods: 'GET',  //通过GET向后端发送登录的手机号
                    url: 'http://localhost:8080/login?phonenumber=' + useStore().phonenumber  //设置获取数据的端口
                }).then(function (resources) {
                    if( that.phoneNumber == resources.data ){
                        useStore().passport = true //登陆成功则设置登录情况为已登录
                        that.$router.replace('/') //跳转主界面
                    }
                })  
            }
        }
    }
}
</script>

<style lang="less" scoped>
.loginHeader {
    width: 100%;
    height: 64px;
    background-color: #ffffff;
    text-align: center;
    border-bottom: 1px solid rgb(235, 237, 240)
}

.loginHeader span {
    font-size: 25px;
    font-weight: 700;
}
</style>