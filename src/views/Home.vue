<template>
  <Header></Header>
  <Carousel autoplay>
    <div class="swiper-box" v-for="it in  top_stories" :key="it.id">
      <img :src="it.image">
      <div class="desc">
        <div class="title">{{ it.title }}</div>
      </div>
    </div>
  </Carousel>
  <ul v-infinite-scroll="getNewsByDate" style=" padding: 5px; height:100%; overflow:auto ; background-color:#DDD">
    <li v-for="(it, index) in news_list" :key="it.date">
      <Divider v-if="index > 0">{{ it.date }}</Divider>
      <List item-layout="horizontal" :data-source="it.stories">
        <template #renderItem="{ item }">
          <ListItem>
            <ListItemMeta :description="item.hint">
              <template #title>
                <router-link :to="'/detail/' + item.id">{{ item.title }}</router-link>
              </template>
              <template #avatar>
                <Avatar :src="item.images[0]" /> <!--图片-->
              </template>
            </ListItemMeta>
            <!-- 评论点赞收藏 -->
            <div :style="{ marginRight: '5px', display: 'block' }">
              <a-space>
                <a-badge :offset="[-8, -2]" :dot="true" size="small" :style="{ fontSize: '9px' }">
                  <message-filled :style="{ fontSize: '18px', marginRight: '10px', color: 'gray' }" />
                </a-badge>
                <a-badge :offset="[-8, -2]" :dot="true" size="small" :style="{ fontSize: '8px' }">
                  <heart-filled :style="{ fontSize: '20px', marginRight: '10px', color: 'gray' }" />
                </a-badge>
                <star-filled @click.stop="ifCollect(item.id)" :style="{ fontSize: '20px', color: 'gray' }" />
              </a-space>
            </div>
          </ListItem>
        </template>
      </List>
    </li>
  </ul>
</template>

<script>
import { useStore } from '../stores/counter.js'
import { mapStores } from 'pinia'
import Header from './Header.vue'
import { HeartFilled, StarFilled, MessageFilled, ZhihuCircleFilled, UserOutlined } from '@ant-design/icons-vue'; //引入图标
import { Carousel, List, ListItem, ListItemMeta, Avatar, Button, Divider, message } from 'ant-design-vue';

export default {
  components: {
    Carousel, List, ListItem, ListItemMeta, Avatar, Button, Divider, Header, 
    HeartFilled, StarFilled, MessageFilled, ZhihuCircleFilled, UserOutlined
  },
  computed: {
    ...mapStores(useStore)   //使用pinia调取数据
  },
  data() {
    return {
      top_stories: [],
      news_list: [],
    }
  },
  methods: {
    //点击收藏按钮,获得收藏的新闻id
    ifCollect(id) {
      if (useStore().passport == false) {        //根据passport的真假判断是否登录
        message.error('请先登录！')             
        this.$router.push('/login')              //未登录则跳转登录界面
      } else {                                   //已登录则继续
        //将id与数据库对比，存在则提示已收藏
        let isCollect = false
        const that = this  //不修改当前的this
        that.axios({
          methods: 'GET',  //通过GET向后端请求数据
          url: 'http://localhost:8080/ifcollect?id=' + id  //设置获取数据的端口
        }).then(function (resources) {
          isCollect = resources.data  //将返回的数据传给isCollect
        })
        if (isCollect) message.success('已在收藏列表中')
        else { message.warning('请在详情页收藏！') }
      }
    },

    //获取最新新闻，页面挂载时向后端请求
    getLatest() {
      const that = this
      that.axios({
        methods: 'GET',
        url: 'http://localhost:8080/getnewslatest'  //设置请求的接口
      }).then(function (resources) {
        let { date, stories, top_stories } = resources.data
        that.top_stories = top_stories
        that.news_list.push({ date, stories })
      })
    },

    //根据日期向后端请求新闻
    getNewsByDate() {
      let date = this.news_list[this.news_list.length - 1].date  //获取日期
      const that = this  //保存this，使得后续的this仍然可用
      that.axios({
        methods: 'GET',
        url: 'http://localhost:8080/getnewsbydate?date=' + date  //设置请求的接口
      }).then(function (resources) {
        let { date, stories, } = resources.data
        that.news_list.push({ date, stories })
        let res = resources.data
        that.news_list.push(res)
      })
    }

  },
  // 挂载时加载数据
  async mounted() {
    // let { date, stories, top_stories, } = await http.get("/api/news/latest")
    // console.log(111, date, stories, top_stories);
    // this.top_stories = top_stories
    // this.news_list.push({ date, stories })

    await this.getLatest()   //界面挂载时获取当日新闻
  },
  showDetail(id) {
    console.log(111, id)
  },
}
</script>

<style lang="less" scoped>
.swiper-box {
  position: relative;
  height: 260px;
  width: 100%;

  img {
    width: 100%;
    height: 100%;
  }


  .desc {
    color: white;
    position: absolute;
    left: 0;
    top: 30px;
    // z-index: 9999;
  }

  .title {
    font-weight: 600;
    font-size: 22px;
    position: relative;
    top: 130px;
  }

}
</style>