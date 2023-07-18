<template>
    <page-header style="border: 1px solid rgb(206, 208, 213)" title="返回" @back="() => { $router.replace('/') }" />
    <div class="personal-container" style="background-color:rgb(0, 0, 0,0.05)">
        <div class="personal-header">
            <!-- 头部，头像 -->
            <a-upload class="avatar-uploader" action="#" :before-upload="beforeUpload" :show-upload-list="false"
                @change="handleChange">
                <a-avatar :src="imageUrl" :size="128" />
            </a-upload>
        </div>
        <!-- 手机号 -->
        <div class="personal-info">
            <div class="personal-name">{{ userPhone }}</div>
        </div>
        <!-- 显示收藏 -->
        <div class="personal-body">
            <a-tabs default-active-key="2">
                <a-tab-pane key="1" tab="我的收藏">
                    <ul style=" padding: 5px; height:100%; overflow:auto ;">
                        <li v-for="item in collectNews_list" :key="item.collectNewsId" @click="goToDetail(item.collectNewsId)" style="border-bottom: 1px solid #DDD  ;">
                            <ListItem>
                                <ListItemMeta>
                                    <template #title>
                                        <router-link :to="'/detail/' + item.collectNewsId">{{ item.collectNewsTitle }}</router-link>
                                    </template>
                                    <template #avatar>
                                        <Avatar :src="item.collectNewsImg" /> <!--图片-->
                                    </template>
                                </ListItemMeta>
                            </ListItem>
                        </li>
                    </ul>
                </a-tab-pane>
                <a-tab-pane key="2" tab="其他"></a-tab-pane>
            </a-tabs>
        </div>
        <div class="personal-footer">
            <a-button type="danger" @click="logout">退出登录</a-button>
        </div>
    </div>
</template>
  
<script>
import { PageHeader, List, ListItem, ListItemMeta, Avatar, Tabs, Button, message } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';

import { useStore } from '../stores/counter.js'
import { mapStores } from 'pinia'

export default {
    computed: {
        ...mapStores(useStore)   //使用pinia调取数据
    },
    components: {
        PageHeader,
        List,
        ListItem,
        ListItemMeta,
        Avatar,
        Tabs,
        TabPane: Tabs.TabPane,
        Button,
        PlusOutlined, LoadingOutlined
    },
    data() {
        return {
            collectNews_list: [],  //存储后端发送过来的查询结果
            imageUrl: useStore().imgPth, // 头像地址
            userPhone: useStore().phonenumber, // 用户名
        }
    },
    methods: {
        handleChange: info => {
            if (info.file.status === 'done') {
                getBase64(info.file.originFileObj, base64Url => {
                    imageUrl.value = base64Url;
                });
            }
            if (info.file.status === 'error') {
                message.error('上传错误');
            }
        },
        beforeUpload(file) { //限制上传文件的格式以及大小
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            if (!isJPG && !isPNG) {
                this.$message.error('请上传 JPG 或 PNG 格式的图片');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传的图片大小不能超过 2MB');
                return false;
            }
            this.avatarUrl = URL.createObjectURL(file);
            return true;
        },
        getCollect() {  //向后端请求当前手机号的所有收藏的文章信息
            const that = this
            that.axios({
                methods: 'GET',  //通过GET向后端请求数据
                url: 'http://localhost:8080/selectCollect'  //设置获取数据的端口
            }).then(function (resources) {
                that.collectNews_list = resources.data  //将返回的数据传给isCollect
                console.log(that.collectNews_list);
            })
        },
        goToDetail(id) {
            this.$router.replace('/detail/' + id)
        },
        logout() {  // 退出登录
            useStore().passport = false  //设置登录情况为false
            this.$router.replace('/') //返回主界面

        }
    },
    created() {
        this.getCollect()  //页面创建时向后端发起请求，申请当前手机号收藏的文章
    }
}
</script>
  
<style scoped>
html,
body {
    height: 100%;
}
.personal-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}
.personal-header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-bottom: 1px solid rgb(206, 208, 213);
}
.personal-info {
    text-align: center;
}
.personal-name {
    font-size: 18px;
}
.personal-body {
    flex: 1;
    padding: 24px;
}
.personal-footer {
    justify-content: center;
    position: fixed;
    bottom: 3%;
    left: 39%;
    z-index: 999;
}
</style>