<template>
    <page-header style="border: 1px solid rgb(235, 237, 240); background-color:#DDD" title="返回" @back="() => { $router.go(-1) }" />
    <!-- <page-header style="border: 1px solid rgb(235, 237, 240)" title="返回" @click="goback()" /> -->
    <div class="detail-box">
        <div class="content" v-html="news.body"></div>

        <!-- 底部图标 -->
        <div class="tab-bar">
            <div class="back">
                <LeftOutlined @click="goback()" :style="{ fontSize: '24px' }" />
            </div>
            <div class="icons">
                <Badge content="0" :count="this.extra.comments" :show-zero="true" style="overflow: visible;">
                    <MessageOutlined :style="{ fontSize: '24px' }" />
                </Badge>
                <Badge content="0" :count="this.extra.popularity" :show-zero="true" style="overflow: visible;">
                    <LikeOutlined v-if="isLiked" @click.stop="likeit()" :style="{ fontSize: '24px' }" />
                    <like-filled v-else @click.stop="likeit()" :style="{ fontSize: '24px' }" />
                </Badge>
                <span class="{isStore ? 'stored' : ''}">
                    <star-filled v-if="isCollect" @click="collectit()" :style="{ fontSize: '24px' }" />
                    <StarOutlined v-else @click="collectit()" :style="{ fontSize: '24px' }" />
                </span>
                <span>
                    <MoreOutlined :style="{ fontSize: '24px' }" />
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { PageHeader, Badge, message } from 'ant-design-vue';
import { LeftOutlined, MessageOutlined, LikeOutlined, StarOutlined, MoreOutlined, LikeFilled, StarFilled } from '@ant-design/icons-vue';
import { nextTick } from 'vue'
import { useStore } from '../stores/counter.js'
import { mapStores } from 'pinia'

export default {
    components: {
        LeftOutlined, MessageOutlined, LikeOutlined, StarOutlined, MoreOutlined, LikeFilled, message, StarFilled,
        PageHeader, Badge
    },
    computed: {
        ...mapStores(useStore)   //使用pinia调取数据
    },
    data() {
        return {
            id: '',
            news: { body: '' },
            link: null,
            extra: {},
            isLiked: true,  //点赞按钮，默认为未点赞
            isCollect: false //控制收藏按钮状态，默认为未收藏
        }
    },
    methods: {
        handleStyle(result) {
            if (result == null) return;
            let { css } = result;
            if (!Array.isArray(css)) return;
            css = css[0];
            if (!css) return;
            // 创建<LINK>导入样式
            this.link = document.createElement('link');
            this.link.rel = "stylesheet";
            this.link.href = css;
            document.head.appendChild(this.link);
        },
        handleImage(result) {
            if (result == null) return;
            let imgPlaceHolder = document.querySelector('.img-place-holder');
            console.log("***", imgPlaceHolder)
            if (!imgPlaceHolder) return;
            // 创建大图
            let tempImg = new Image;
            tempImg.src = result.image;
            tempImg.onload = () => {
                imgPlaceHolder.appendChild(tempImg);
            };
            tempImg.onerror = () => {
                let parent = imgPlaceHolder.parentNode;
                parent.parentNode.removeChild(parent);
            };
        },
        likeit() {
            if (useStore().passport == false) {
                message.error('请先登录！')
                this.$router.replace('/login')
            }
            this.isLiked = !this.isLiked  //取反
        },
        collectit() {
            if (useStore().passport == false) {  //点击事件
                message.error('请先登录！')
                this.$router.replace('/login')
            }
            this.isCollect = !this.isCollect  //取反
        },
        //检查是否已经收藏
        checkIfCollect(id) {
            //将id与数据库对比
            const that = this  //不修改当前的this
                  that.axios({  
                    methods:'GET',  //通过GET向后端请求数据
                    url: 'http://localhost:8080/ifcollect?id=' + id//设置获取数据的端口
                  }).then(function (resources) {
                    that.isCollect = resources.data  //将返回的数据传给isCollect,页面修改显示图标
                  })
        },
        //退出界面前，加载此新闻是否收藏，并更新数据库
        goback() {  //返回按钮点击事件
            const that = this
            that.axios({  //退出新闻详情页时再向后端发起操作数据库请求
                methods: 'GET',  //通过GET向后端请求数据
                url: 'http://localhost:8080/ifcollect?id=' + that.id //设置获取数据的端口
            }).then(function (resources) {  //后端返回新闻是否已经存在,true or false
                if (resources.data == true && that.isCollect == false) {   //数据库中已收藏，退出时取消收藏
                    that.axios({
                        methods: 'GET',  //通过GET向后端请求数据
                        url: 'http://localhost:8080/detelecollect?id=' + that.id  //删除收藏
                    })
                }
                else if(resources.data == false && that.isCollect == true){   //数据库中未收藏，退出时选择收藏
                    that.axios({
                        methods: 'GET',  //通过GET向后端请求数据
                        url: 'http://localhost:8080/addcollect?id=' + that.id  //添加收藏
                    })
                }
            })
            this.$router.replace('/')   //返回Home
        },
        getDetailById(){  
            this.id = this.$route.params.id  //获取路由携带的参数id
            const that = this
            that.axios({
                methods: 'GET',  //通过GET向后端请求新闻详情数据
                url: 'http://localhost:8080/getdetail?id=' + that.id  
            }).then(function (resources) {
                that.news = resources.data
                nextTick(() => {
                    that.handleStyle(that.news);
                    that.handleImage(that.news);
                })
            })
        },
        getExtraById(){
            this.id = this.$route.params.id  //获取路由携带的参数id
            const that = this
            that.axios({          //向后端请求评论点赞数据
                methods: 'GET',  //通过GET向后端请求数据
                url: 'http://localhost:8080/getextra?id=' + that.id  
            }).then(function (resources) {
                that.extra = resources.data  //点赞数据放到this.extra上
            })
        }
    },
    created() {
        this.getDetailById()
        this.getExtraById()
    },
    mounted() {
        this.checkIfCollect(this.id)  //页面挂载时调用checkIfCollect函数检查是否已经收藏，修改收藏按钮状态
    },
    unmounted() {
        //// 销毁组件:移除创建的样式
        if (this.link) document.head.removeChild(this.link);
    }
}
</script>

<style lang="less" scoped>
.detail-box {
    .content {
        overflow-x: hidden;
        margin: 0;
        padding-bottom: 90px;
        ::v-deep {
            .img-place-holder {
                overflow: hidden;

                img {
                    margin: 0;
                    width: 100%;
                }
            }
            .meta {
                .avatar {
                    display: inline-block;
                    margin-top: 0;
                    margin-bottom: 0;
                }
            }
            .ant-scroll-number-only-unit {
                margin: 0 0 !important;
            }
        }
    }
    /* 底部栏 */
    .tab-bar {
        position: fixed;
        // height: 40px;
        bottom: 0;
        left: 0;
        z-index: 999;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        background: #DDD;
        display: flex;
        align-items: center;

        .back {
            box-sizing: border-box;
            width: 100px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            font-size: 40px;
            font-weight: 900;
            border-right: 2px solid #CCC;
        }

        .icons {
            flex-grow: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
            line-height: 50px;

            .adm-badge-wrapper,
            span {
                flex-grow: 1;
                text-align: center;
                font-size: 40px;
            }

            span {
                &:nth-last-of-type(1) {
                    color: #AAA;
                }

                &:nth-of-type(1) {
                    &.stored {
                        color: #108ee9;
                    }
                }
            }
        }
    }
}
</style>