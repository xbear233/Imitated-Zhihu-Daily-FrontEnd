<template>
    <div class="header">
    <a-row>
      <a-col :span="3" :style="{ fontSize: '25px', textAlign: 'center' }">
        <zhihu-circle-filled />
      </a-col>
      <a-col :span="18" :style="{ textAlign: 'center' }">
        <b class="text" :style="{ fontSize: '22px' }">知乎日报</b>
      </a-col>
      <a-col :span="3" :style="{ textAlign: 'center', paddingTop: '5px' }">
          <a-avatar shape="square" :src="getImgPth()" @click="getpassport()"></a-avatar>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { useStore } from '../stores/counter.js'
import { mapStores } from 'pinia'
import  {ZhihuCircleFilled} from '@ant-design/icons-vue';

export default {
    name:'Header',
    components:{ZhihuCircleFilled},
    computed:{
        ...mapStores(useStore)   //使用pinia调取数据
    },
    methods:{
        getImgPth(){
            if(useStore().passport)   //根据passport的真假判断是否登录
            return useStore().imgPth  //已登录则获取头像
        },
        getpassport(){
            if(useStore().passport){
                this.$router.push('/personalinfo')  //跳转个人信息界面
            }else {this.$router.push('/login')}     //跳转登录界面
        },
    }
}
</script>

<style>

.header {
    padding-top: 10px;
    background-color: #DDD;
  }

  .text {
    font-size: 22px;
  }
</style>